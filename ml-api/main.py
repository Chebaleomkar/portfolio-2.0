"""
FastAPI Backend for Blog Recommendation System
Deployed on Render (free tier)

Endpoints:
- POST /embed-blog: Generate embedding for a new blog and update recommendations
- POST /update-all: Recompute all recommendations (manual trigger)
- GET /health: Health check
"""

import os
import time
from typing import List, Dict, Any, Optional
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, BackgroundTasks, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from pinecone import Pinecone, ServerlessSpec
from google import genai
import markdown
from bs4 import BeautifulSoup
import re


# ============================================================
# Configuration
# ============================================================

MONGODB_URI = os.getenv("MONGODB_URI")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
API_SECRET = os.getenv("API_SECRET", "your-secret-key")  # For webhook auth

PINECONE_INDEX_NAME = "portfolio-blog-embedding"
EMBEDDING_DIMENSION = 768
MONGODB_DATABASE = "portfolio-blogs"


# ============================================================
# Pydantic Models
# ============================================================

class BlogInput(BaseModel):
    slug: str
    title: str
    description: str
    content: str
    tags: List[str] = []
    is_starred: bool = False


class RecommendationItem(BaseModel):
    slug: str
    title: str
    description: str
    score: float


class EmbedResponse(BaseModel):
    success: bool
    message: str
    slug: str
    recommendations_updated: int


# ============================================================
# Global Clients
# ============================================================

mongo_client: Optional[MongoClient] = None
pinecone_index = None
genai_client = None


def get_mongo_db():
    """Get MongoDB database connection."""
    global mongo_client
    if mongo_client is None:
        mongo_client = MongoClient(MONGODB_URI)
    return mongo_client[MONGODB_DATABASE]


def get_pinecone_index():
    """Get Pinecone index."""
    global pinecone_index
    if pinecone_index is None:
        pc = Pinecone(api_key=PINECONE_API_KEY)
        
        # Check if index exists
        existing = [idx.name for idx in pc.list_indexes()]
        if PINECONE_INDEX_NAME not in existing:
            pc.create_index(
                name=PINECONE_INDEX_NAME,
                dimension=EMBEDDING_DIMENSION,
                metric="cosine",
                spec=ServerlessSpec(cloud="aws", region="us-east-1")
            )
        
        pinecone_index = pc.Index(PINECONE_INDEX_NAME)
    return pinecone_index


def get_genai_client():
    """Get Google AI client."""
    global genai_client
    if genai_client is None:
        genai_client = genai.Client(api_key=GOOGLE_API_KEY)
    return genai_client


# ============================================================
# Text Processing
# ============================================================

def markdown_to_plain_text(md_content: str) -> str:
    """Convert markdown to plain text."""
    html = markdown.markdown(md_content)
    soup = BeautifulSoup(html, "html.parser")
    return soup.get_text(separator=" ", strip=True)


def remove_code_blocks(content: str) -> str:
    """Remove code blocks from content."""
    content = re.sub(r"```[\s\S]*?```", " [code] ", content)
    content = re.sub(r"`[^`]+`", " [code] ", content)
    return content


def clean_text(text: str) -> str:
    """Clean and normalize text."""
    text = re.sub(r"http[s]?://\S+", "", text)
    text = re.sub(r"[^\w\s.,!?-]", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def preprocess_blog(blog: Dict[str, Any]) -> str:
    """Preprocess blog content for embedding."""
    content = remove_code_blocks(blog.get("content", ""))
    plain_text = markdown_to_plain_text(content)
    clean_content = clean_text(plain_text)
    
    tags_text = ", ".join(blog.get("tags", []))
    
    processed = f"""
    Title: {blog.get('title', '')}
    Summary: {blog.get('description', '')}
    Topics: {tags_text}
    Content: {clean_content[:2000]}
    """
    
    return processed.strip()


# ============================================================
# Embedding Generation
# ============================================================

def generate_embedding(text: str) -> List[float]:
    """Generate embedding for text using Google AI."""
    client = get_genai_client()
    
    # Truncate if too long
    if len(text) > 8000:
        text = text[:8000]
    
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config={
            "task_type": "RETRIEVAL_DOCUMENT",
            "output_dimensionality": EMBEDDING_DIMENSION,# 768
        }
    )
    
    return list(result.embeddings[0].values)


# ============================================================
# Pinecone Operations
# ============================================================

def upsert_embedding(slug: str, embedding: List[float], metadata: Dict[str, Any]):
    """Upsert a single embedding to Pinecone."""
    index = get_pinecone_index()
    
    clean_metadata = {
        "title": str(metadata.get("title", ""))[:200],
        "description": str(metadata.get("description", ""))[:500],
        "tags": metadata.get("tags", []),
        "is_starred": bool(metadata.get("is_starred", False)),
    }
    
    index.upsert(vectors=[{
        "id": slug,
        "values": embedding,
        "metadata": clean_metadata
    }])


def find_similar_blogs(slug: str, top_k: int = 3) -> List[Dict[str, Any]]:
    """Find similar blogs for a given slug."""
    index = get_pinecone_index()
    
    # Fetch embedding for this slug
    result = index.fetch(ids=[slug])
    if slug not in result.vectors:
        return []
    
    query_embedding = result.vectors[slug].values
    
    # Query for similar
    results = index.query(
        vector=query_embedding,
        top_k=top_k + 1,
        include_metadata=True
    )
    
    similar = []
    for match in results.matches:
        if match.id != slug:
            similar.append({
                "slug": match.id,
                "title": match.metadata.get("title", ""),
                "description": match.metadata.get("description", ""),
                "score": round(float(match.score), 4)
            })
    
    return similar[:top_k]


def get_all_slugs_from_pinecone() -> List[str]:
    """Get all slugs from Pinecone."""
    index = get_pinecone_index()
    slugs = []
    
    try:
        for ids_batch in index.list():
            slugs.extend(ids_batch)
    except Exception as e:
        print(f"Error listing vectors: {e}")
    
    return slugs


# ============================================================
# MongoDB Operations
# ============================================================

def update_recommendations_in_mongo(slug: str, recommendations: List[Dict]):
    """Update recommendations for a blog in MongoDB."""
    db = get_mongo_db()
    
    db.recommendations.update_one(
        {"blogSlug": slug},
        {
            "$set": {
                "recommendations": recommendations,
                "updatedAt": datetime.utcnow()
            },
            "$setOnInsert": {
                "createdAt": datetime.utcnow()
            }
        },
        upsert=True
    )


def get_all_blogs_from_mongo() -> List[Dict]:
    """Get all published blogs from MongoDB."""
    db = get_mongo_db()
    
    blogs = list(db.blogs.find(
        {"published": True},
        {"slug": 1, "title": 1, "description": 1, "content": 1, "tags": 1, "isStarred": 1}
    ))
    
    return blogs


# ============================================================
# Core Logic
# ============================================================

def embed_and_update_single_blog(blog: BlogInput, update_all_recs: bool = True) -> int:
    """
    Embed a single blog and update recommendations.
    
    Args:
        blog: The blog to embed
        update_all_recs: If True, update recommendations for ALL blogs
    
    Returns:
        Number of recommendations updated
    """
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Processing blog: {blog.slug}")
    
    # 1. Preprocess
    blog_dict = blog.model_dump()
    blog_dict["content"] = blog.content
    processed_text = preprocess_blog(blog_dict)
    
    # 2. Generate embedding
    print(f"  Generating embedding...")
    embedding = generate_embedding(processed_text)
    
    # 3. Upsert to Pinecone
    print(f"  Upserting to Pinecone...")
    upsert_embedding(
        slug=blog.slug,
        embedding=embedding,
        metadata={
            "title": blog.title,
            "description": blog.description,
            "tags": blog.tags,
            "is_starred": blog.is_starred
        }
    )
    
    # Small delay to ensure Pinecone has indexed the new vector
    time.sleep(1)
    
    # 4. Update recommendations
    updated_count = 0
    
    if update_all_recs:
        # Get all slugs and update recommendations for each
        all_slugs = get_all_slugs_from_pinecone()
        print(f"  Updating recommendations for {len(all_slugs)} blogs...")
        
        for slug in all_slugs:
            similar = find_similar_blogs(slug, top_k=3)
            update_recommendations_in_mongo(slug, similar)
            updated_count += 1
    else:
        # Just update for the new blog
        similar = find_similar_blogs(blog.slug, top_k=3)
        update_recommendations_in_mongo(blog.slug, similar)
        updated_count = 1
    
    print(f"  Done! Updated {updated_count} recommendation entries.")
    return updated_count


# ============================================================
# FastAPI App
# ============================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("🚀 Starting ML API server...")
    
    # Validate environment
    missing = []
    if not MONGODB_URI:
        missing.append("MONGODB_URI")
    if not PINECONE_API_KEY:
        missing.append("PINECONE_API_KEY")
    if not GOOGLE_API_KEY:
        missing.append("GOOGLE_API_KEY or GEMINI_API_KEY")
    
    if missing:
        print(f"⚠️ Missing environment variables: {', '.join(missing)}")
    else:
        print("✅ All environment variables configured")
    
    yield
    
    # Cleanup
    global mongo_client
    if mongo_client:
        mongo_client.close()
    print("👋 Server shutdown complete")


app = FastAPI(
    title="Blog Recommendation ML API",
    description="FastAPI backend for blog embedding and recommendations",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# Endpoints
# ============================================================

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "blog-recommendation-api"
    }


@app.post("/embed-blog", response_model=EmbedResponse)
async def embed_blog(
    blog: BlogInput,
    background_tasks: BackgroundTasks,
    x_api_secret: str = Header(None, alias="X-API-Secret")
):
    """
    Embed a new blog and update recommendations.
    Called by Next.js when a new blog is created.
    """
    # Verify secret
    if x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API secret")
    
    try:
        # Process synchronously (for now)
        # For very large scale, you might want to use background_tasks
        updated_count = embed_and_update_single_blog(blog, update_all_recs=True)
        
        return EmbedResponse(
            success=True,
            message=f"Blog '{blog.slug}' embedded and recommendations updated",
            slug=blog.slug,
            recommendations_updated=updated_count
        )
    
    except Exception as e:
        print(f"Error embedding blog: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/update-all-recommendations")
async def update_all_recommendations(
    x_api_secret: str = Header(None, alias="X-API-Secret")
):
    """
    Recompute recommendations for ALL blogs.
    Manual trigger for full recomputation.
    """
    if x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API secret")
    
    try:
        all_slugs = get_all_slugs_from_pinecone()
        
        for slug in all_slugs:
            similar = find_similar_blogs(slug, top_k=3)
            update_recommendations_in_mongo(slug, similar)
        
        return {
            "success": True,
            "message": f"Updated recommendations for {len(all_slugs)} blogs",
            "count": len(all_slugs)
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/rerun-failed-embeddings")
async def rerun_failed_embeddings(
    x_api_secret: str = Header(None, alias="X-API-Secret")
):
    """
    Re-embed all blogs that are missing embeddings in Pinecone.
    Fetches all published blogs from MongoDB, checks which ones
    don't have vectors in Pinecone, re-generates their embeddings,
    and updates all recommendations.
    """
    if x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API secret")

    try:
        # 1. Get all published blogs from MongoDB
        all_blogs = get_all_blogs_from_mongo()
        all_mongo_slugs = {blog["slug"] for blog in all_blogs}

        # 2. Get all slugs that already have embeddings in Pinecone
        existing_slugs = set(get_all_slugs_from_pinecone())

        # 3. Find missing slugs
        missing_slugs = all_mongo_slugs - existing_slugs

        if not missing_slugs:
            return {
                "success": True,
                "message": "All blogs already have embeddings. No re-run needed.",
                "total_blogs": len(all_mongo_slugs),
                "existing_embeddings": len(existing_slugs),
                "reprocessed": 0,
                "failed": []
            }

        print(f"Found {len(missing_slugs)} blogs missing embeddings: {missing_slugs}")

        # 4. Re-embed only the missing blogs
        reprocessed = []
        failed = []

        for blog in all_blogs:
            if blog["slug"] not in missing_slugs:
                continue

            slug = blog["slug"]
            try:
                blog_input = BlogInput(
                    slug=slug,
                    title=blog.get("title", ""),
                    description=blog.get("description", ""),
                    content=blog.get("content", ""),
                    tags=blog.get("tags", []),
                    is_starred=blog.get("isStarred", False)
                )
                # Embed but skip per-blog recommendation update (we'll do it all at once)
                embed_and_update_single_blog(blog_input, update_all_recs=False)
                reprocessed.append(slug)
                print(f"  ✅ Re-embedded: {slug}")

                # Small delay for rate limiting
                time.sleep(1)

            except Exception as e:
                print(f"  ❌ Failed to re-embed {slug}: {e}")
                failed.append({"slug": slug, "error": str(e)})

        # 5. Recompute ALL recommendations now that embeddings are complete
        print("Recomputing all recommendations...")
        all_slugs = get_all_slugs_from_pinecone()
        recs_updated = 0
        for slug in all_slugs:
            similar = find_similar_blogs(slug, top_k=3)
            update_recommendations_in_mongo(slug, similar)
            recs_updated += 1

        return {
            "success": True,
            "message": f"Re-embedded {len(reprocessed)} blogs and updated {recs_updated} recommendations",
            "total_blogs": len(all_mongo_slugs),
            "existing_embeddings": len(existing_slugs),
            "reprocessed": reprocessed,
            "failed": failed,
            "recommendations_updated": recs_updated
        }

    except Exception as e:
        print(f"Error in rerun-failed-embeddings: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/search")
async def semantic_search(
    request: dict,
    x_api_secret: str = Header(None, alias="X-API-Secret")
):
    """
    Semantic search - find blogs similar to ANY text query.
    Generates an embedding from the query text and searches Pinecone.
    
    Body:
        query: str - The text to search for
        top_k: int - Number of results (default: 3)
    """
    if x_api_secret != API_SECRET:
        raise HTTPException(status_code=401, detail="Invalid API secret")
    
    query_text = request.get("query", "")
    top_k = request.get("top_k", 3)
    
    if not query_text:
        raise HTTPException(status_code=400, detail="Query is required")
    
    # Process the query like we process blogs
    processed_query = clean_text(query_text)
    
    # Generate embedding for the query
    query_embedding = generate_embedding(processed_query)
    
    # Search Pinecone
    index = get_pinecone_index()
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    
    # Format results
    search_results = []
    for match in results.matches:
        search_results.append({
            "slug": match.id,
            "title": match.metadata.get("title", ""),
            "description": match.metadata.get("description", ""),
            "tags": match.metadata.get("tags", []),
            "score": round(float(match.score), 4)
        })
    
    return {
        "query": query_text,
        "results": search_results,
        "count": len(search_results)
    }


@app.get("/stats")
async def get_stats():
    """Get statistics about the recommendation system."""
    try:
        index = get_pinecone_index()
        stats = index.describe_index_stats()

        db = get_mongo_db()
        blog_count = db.blogs.count_documents({"published": True})
        rec_count = db.recommendations.count_documents({})

        # Also show which blogs are missing embeddings
        all_blogs = list(db.blogs.find({"published": True}, {"slug": 1}))
        all_mongo_slugs = {blog["slug"] for blog in all_blogs}
        existing_slugs = set(get_all_slugs_from_pinecone())
        missing_slugs = list(all_mongo_slugs - existing_slugs)

        return {
            "pinecone": {
                "index_name": PINECONE_INDEX_NAME,
                "total_vectors": stats.total_vector_count,
                "dimension": stats.dimension
            },
            "mongodb": {
                "published_blogs": blog_count,
                "recommendation_entries": rec_count
            },
            "missing_embeddings": {
                "count": len(missing_slugs),
                "slugs": missing_slugs
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# Main
# ============================================================

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
