"""
Pinecone vector database operations.
Stores and retrieves blog embeddings for similarity search.
"""

from typing import List, Dict, Any, Optional
from pinecone import Pinecone, ServerlessSpec
from utils.config import get_pinecone_api_key, PINECONE_INDEX_NAME, EMBEDDING_DIMENSION


# Global Pinecone client
_client: Optional[Pinecone] = None
_index = None


def get_pinecone_client() -> Pinecone:
    """Get or create Pinecone client."""
    global _client
    if _client is None:
        api_key = get_pinecone_api_key()
        _client = Pinecone(api_key=api_key)
    return _client


def get_index():
    """Get or create Pinecone index."""
    global _index
    if _index is not None:
        return _index
    
    client = get_pinecone_client()
    
    # Check if index exists
    existing_indexes = [idx.name for idx in client.list_indexes()]
    
    if PINECONE_INDEX_NAME not in existing_indexes:
        print(f"Creating new index: {PINECONE_INDEX_NAME}")
        client.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=EMBEDDING_DIMENSION,
            metric="cosine",
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"
            )
        )
        print(f"✅ Index '{PINECONE_INDEX_NAME}' created successfully")
    
    _index = client.Index(PINECONE_INDEX_NAME)
    return _index


def upsert_blog_embedding(
    slug: str,
    embedding: List[float],
    metadata: Dict[str, Any]
) -> bool:
    """
    Upsert a single blog embedding to Pinecone.
    
    Args:
        slug: Blog slug (used as vector ID)
        embedding: The embedding vector
        metadata: Blog metadata (title, tags, description, etc.)
    
    Returns:
        True if successful
    """
    index = get_index()
    
    # Prepare metadata (Pinecone has restrictions on metadata values)
    clean_metadata = {
        "title": str(metadata.get("title", "")),
        "description": str(metadata.get("description", ""))[:500],  # Limit length
        "tags": metadata.get("tags", []),
        "is_starred": bool(metadata.get("is_starred", False)),
    }
    
    # Upsert to Pinecone
    index.upsert(
        vectors=[{
            "id": slug,
            "values": embedding,
            "metadata": clean_metadata
        }]
    )
    
    return True


def upsert_blogs_batch(
    embedded_blogs: List[Dict[str, Any]],
    batch_size: int = 50,
    show_progress: bool = True
) -> int:
    """
    Upsert multiple blog embeddings to Pinecone.
    
    Args:
        embedded_blogs: List of blog dicts with 'slug', 'embedding', and metadata
        batch_size: Number of vectors to upsert at once
        show_progress: Whether to print progress
    
    Returns:
        Number of blogs upserted
    """
    index = get_index()
    total = len(embedded_blogs)
    upserted = 0
    
    # Process in batches
    for i in range(0, total, batch_size):
        batch = embedded_blogs[i:i + batch_size]
        
        vectors = []
        for blog in batch:
            clean_metadata = {
                "title": str(blog.get("title", "")),
                "description": str(blog.get("description", ""))[:500],
                "tags": blog.get("tags", []),
                "is_starred": bool(blog.get("is_starred", False)),
            }
            
            vectors.append({
                "id": blog["slug"],
                "values": blog["embedding"],
                "metadata": clean_metadata
            })
        
        index.upsert(vectors=vectors)
        upserted += len(vectors)
        
        if show_progress:
            print(f"  Upserted {upserted}/{total} blogs")
    
    return upserted


def find_similar_blogs(
    slug: str,
    top_k: int = 3,
    include_metadata: bool = True
) -> List[Dict[str, Any]]:
    """
    Find similar blogs to a given blog by its slug.
    
    Args:
        slug: The slug of the blog to find similar blogs for
        top_k: Number of similar blogs to return
        include_metadata: Whether to include metadata in results
    
    Returns:
        List of similar blogs with scores
    """
    index = get_index()
    
    # First, fetch the embedding for this slug
    fetch_result = index.fetch(ids=[slug])
    
    if slug not in fetch_result.vectors:
        print(f"Blog '{slug}' not found in index")
        return []
    
    query_embedding = fetch_result.vectors[slug].values
    
    # Query for similar blogs (top_k + 1 to exclude self)
    results = index.query(
        vector=query_embedding,
        top_k=top_k + 1,
        include_metadata=include_metadata
    )
    
    # Filter out the query blog itself and format results
    similar_blogs = []
    for match in results.matches:
        if match.id != slug:
            similar_blogs.append({
                "slug": match.id,
                "score": float(match.score),
                "metadata": dict(match.metadata) if include_metadata else {}
            })
    
    return similar_blogs[:top_k]


def find_similar_by_embedding(
    embedding: List[float],
    top_k: int = 3,
    exclude_slugs: Optional[List[str]] = None,
    include_metadata: bool = True
) -> List[Dict[str, Any]]:
    """
    Find similar blogs using a raw embedding vector.
    Useful for finding similar blogs to a query or new content.
    
    Args:
        embedding: The embedding vector to search with
        top_k: Number of similar blogs to return
        exclude_slugs: List of slugs to exclude from results
        include_metadata: Whether to include metadata
    
    Returns:
        List of similar blogs with scores
    """
    index = get_index()
    exclude_slugs = exclude_slugs or []
    
    # Query for similar blogs
    results = index.query(
        vector=embedding,
        top_k=top_k + len(exclude_slugs),
        include_metadata=include_metadata
    )
    
    # Filter and format results
    similar_blogs = []
    for match in results.matches:
        if match.id not in exclude_slugs:
            similar_blogs.append({
                "slug": match.id,
                "score": float(match.score),
                "metadata": dict(match.metadata) if include_metadata else {}
            })
    
    return similar_blogs[:top_k]


def get_index_stats() -> Dict[str, Any]:
    """Get statistics about the Pinecone index."""
    index = get_index()
    stats = index.describe_index_stats()
    
    return {
        "total_vectors": stats.total_vector_count,
        "dimension": stats.dimension,
        "index_name": PINECONE_INDEX_NAME
    }


def delete_all_vectors() -> bool:
    """Delete all vectors from the index. Use with caution!"""
    index = get_index()
    index.delete(delete_all=True)
    return True


# For testing
if __name__ == "__main__":
    print("Testing Pinecone connection...")
    
    try:
        stats = get_index_stats()
        print(f"✅ Connected to Pinecone!")
        print(f"   Index: {stats['index_name']}")
        print(f"   Total vectors: {stats['total_vectors']}")
        print(f"   Dimension: {stats['dimension']}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
