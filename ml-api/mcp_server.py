"""
MCP Server for Portfolio Blog System
=====================================
This MCP server exposes your blog recommendation system as tools that can be 
discovered and used by AI agents (like Claude, Cursor, etc.).

Architecture:
    MCP Client (Claude/Cursor) → mcp_server.py → Next.js API / ML API (FastAPI)

Current Tools (Minimal Set - Start Here):
    1. health_check - Check if ML API is running
    2. list_blogs - List all published blogs
    3. search_blogs_by_text - Semantic search using raw text query

Full Tools (Enable Later):
    4. create_blog - Post a new blog to your portfolio
    5. get_blog_recommendations - Get recommendations for a specific blog
    6. get_system_stats - Get ML system statistics
    7. embed_single_blog - Manually trigger embedding for a blog
    8. update_all_recommendations - Recompute all recommendations
    9. rerun_failed_embeddings - Fix missing embeddings in Pinecone

Usage:
    # 1. Set environment variables (or put in .env file)
    #    NEXTJS_PASSWORD=your-nextjs-password
    #    ML_API_SECRET=your-ml-api-secret
    
    # 2. Run the MCP server (stdio mode - for Claude Desktop, Cursor)
    python mcp_server.py
    
    # 3. Or run with HTTP transport (for remote connections / testing)
    python mcp_server.py --transport http --port 8001
"""

import os
import sys
import argparse
from typing import Any, Optional
from dataclasses import dataclass

import httpx
from dotenv import load_dotenv
from mcp.server.fastmcp import FastMCP
from mcp.server.fastmcp.server import TransportSecuritySettings


# ============================================================
# Configuration
# ============================================================

# Load .env file if it exists (supports both .env and mcp_config.example.env)
load_dotenv()

@dataclass
class ServerConfig:
    """Configuration for connecting to your services."""
    nextjs_url: str
    nextjs_password: str
    ml_api_url: str
    ml_api_secret: str


def get_config() -> ServerConfig:
    """Load configuration from environment variables."""
    return ServerConfig(
        nextjs_url=os.getenv("NEXTJS_URL", "http://localhost:3000"),
        nextjs_password=os.getenv("NEXTJS_PASSWORD", ""),
        ml_api_url=os.getenv("ML_API_URL", "http://localhost:8000"),
        ml_api_secret=os.getenv("ML_API_SECRET", ""),
    )


# Load config at module level so tools can access it
config = get_config()


# ============================================================
# Create FastMCP Server
# ============================================================

# Build transport security settings
# When deployed on Render, allow the external hostname so requests don't get
# rejected with 421 Misdirected Request (DNS rebinding protection)
render_hostname = os.getenv("RENDER_EXTERNAL_HOSTNAME", "")
if render_hostname:
    # Deployed: allow the Render domain + localhost for health checks
    transport_security = TransportSecuritySettings(
        enable_dns_rebinding_protection=True,
        allowed_hosts=[render_hostname, "localhost", "127.0.0.1"],
    )
else:
    # Local dev: no restrictions needed
    transport_security = TransportSecuritySettings(
        enable_dns_rebinding_protection=False,
    )

mcp = FastMCP(
    "portfolio-blog-mcp",
    instructions="""You are a helpful assistant for managing a portfolio blog system.
    You can search blogs, list blogs, create new ones, and manage the ML recommendation system.
    Always use the health_check tool first to verify the ML API is running before using ML-related tools.""",
    transport_security=transport_security,
)


# ============================================================
# Helper: HTTP Client
# ============================================================

def _log(msg: str):
    """Log to stderr (safe in stdio mode - stdout is reserved for MCP protocol)."""
    print(msg, file=sys.stderr)


async def _ml_api_request(
    method: str,
    path: str,
    json: dict = None,
    params: dict = None,
    timeout: float = 30.0,
) -> dict:
    """Make an authenticated request to the ML API."""
    async with httpx.AsyncClient(timeout=timeout) as client:
        kwargs = {
            "params": params,
            "headers": {"X-API-Secret": config.ml_api_secret},
        }
        if method != "get" and json is not None:
            kwargs["json"] = json
        
        response = await getattr(client, method)(
            f"{config.ml_api_url}{path}",
            **kwargs,
        )
        
        if response.status_code == 401:
            raise ValueError("Invalid ML API secret. Check your ML_API_SECRET env var.")
        
        response.raise_for_status()
        return response.json()


async def _nextjs_request(
    method: str,
    path: str,
    json: dict = None,
    params: dict = None,
    timeout: float = 30.0,
) -> dict:
    """Make an authenticated request to the Next.js API."""
    async with httpx.AsyncClient(timeout=timeout) as client:
        kwargs = {
            "params": params,
            "headers": {"password": config.nextjs_password},
        }
        if method != "get" and json is not None:
            kwargs["json"] = json
        
        response = await getattr(client, method)(
            f"{config.nextjs_url}{path}",
            **kwargs,
        )
        
        if response.status_code == 401:
            raise ValueError("Invalid Next.js password. Check your NEXTJS_PASSWORD env var.")
        
        response.raise_for_status()
        return response.json()


# ============================================================
# MINIMAL TOOLS (Start with these for testing)
# ============================================================

@mcp.tool()
async def health_check() -> str:
    """Check if the ML API server is running and healthy.
    Use this first to verify the backend is available."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(f"{config.ml_api_url}/health")
            result = response.json()
        
        return (
            f"✅ ML API is healthy!\n"
            f"Status: {result.get('status', 'unknown')}\n"
            f"Service: {result.get('service', 'unknown')}\n"
            f"Timestamp: {result.get('timestamp', 'unknown')}"
        )
    except httpx.ConnectError:
        return "❌ Cannot connect to ML API. Is it running? Check ML_API_URL."
    except Exception as e:
        return f"❌ Health check failed: {str(e)}"


@mcp.tool()
async def list_blogs(limit: int = 20) -> str:
    """List all published blogs on the portfolio.
    Returns basic info (slug, title, description, tags) for all blogs.
    
    Args:
        limit: Maximum number of blogs to return (default: 20)
    """
    try:
        result = await _nextjs_request("get", "/api/blog", params={"page": 1, "starred": "false"})
        
        if not result.get("success"):
            return f"Error: {result.get('error', 'Unknown error')}"
        
        posts = result.get("posts", [])[:limit]
        
        if not posts:
            return "No blogs found."
        
        msg = f"## Published Blogs ({len(posts)} shown)\n\n"
        for post in posts:
            msg += f"### {post['title']}\n"
            msg += f"- **Slug:** `{post['slug']}`\n"
            desc = post.get('description', 'N/A')
            msg += f"- **Description:** {desc[:100]}{'...' if len(desc) > 100 else ''}\n"
            msg += f"- **Tags:** {', '.join(post.get('tags', []))}\n\n"
        
        return msg
    except Exception as e:
        return f"Error listing blogs: {str(e)}"


@mcp.tool()
async def search_blogs_by_text(query: str, top_k: int = 3) -> str:
    """Semantic search - find blogs similar to ANY text query.
    Uses the ML embedding model to find blogs that match your query semantically,
    even if they don't contain the exact keywords.
    
    Args:
        query: The text to search for (can be a topic, question, or phrase)
        top_k: Number of results to return (default: 3)
    """
    try:
        result = await _ml_api_request(
            "post", "/search",
            json={"query": query, "top_k": top_k},
            timeout=60.0,
        )
        
        if not result.get("results"):
            return f"No blogs found matching: '{query}'"
        
        msg = f'## Semantic Search Results for: "{query}"\n\n'
        for i, item in enumerate(result["results"], 1):
            msg += f"### {i}. {item['title']}\n"
            msg += f"**Slug:** `{item.get('slug', 'N/A')}`\n"
            msg += f"**Similarity:** {item.get('score', 'N/A')}\n"
            msg += f"_{item.get('description', 'No description')}_\n\n"
        
        return msg
    except httpx.ConnectError:
        return "Error: Cannot connect to ML API. Make sure it's running."
    except Exception as e:
        return f"Error during search: {str(e)}"


# ============================================================
# FULL TOOLS (Enable these after minimal set works)
# ============================================================

@mcp.tool()
async def create_blog(
    title: str,
    content: str,
    description: str = "",
    tags: list[str] = [],
    external: str = "",
    is_starred: bool = False,
) -> str:
    """Create a new blog post on the portfolio.
    Posts to the Next.js server and automatically triggers ML embedding 
    and recommendation updates.
    
    Args:
        title: Blog title (required)
        content: Blog content in markdown format (required)
        description: Short description/summary
        tags: List of tags (e.g. ["python", "ml"])
        external: External URL if this is an external post
        is_starred: Mark as curated/starred (sends email notifications)
    """
    try:
        payload = {
            "title": title,
            "body": content,  # Next.js API expects "body" not "content"
            "description": description,
            "tags": tags,
            "isStarred": is_starred,
        }
        if external:
            payload["external"] = external
        
        result = await _nextjs_request("post", "/api/blog", json=payload, timeout=60.0)
        
        if result.get("success"):
            msg = f"✅ Blog created successfully!\n"
            msg += f"**Slug:** {result.get('slug')}\n"
            msg += f"**Message:** {result.get('message', '')}\n"
            if result.get("backgroundTasks"):
                msg += f"**Background tasks:** {result.get('backgroundTasks')}"
            return msg
        else:
            return f"❌ Error: {result.get('error', 'Unknown error')}"
    except Exception as e:
        return f"Error creating blog: {str(e)}"


@mcp.tool()
async def get_blog_recommendations(slug: str) -> str:
    """Get AI-powered recommendations for a specific blog post.
    Returns similar blogs based on semantic similarity.
    
    Args:
        slug: The blog slug to get recommendations for
    """
    try:
        # Get blog info from Next.js
        blog_result = await _nextjs_request("get", f"/api/blog/{slug}")
        
        if not blog_result.get("success"):
            return f"Blog not found: {slug}"
        
        blog = blog_result.get("blog", {})
        
        msg = f"## {blog.get('title')}\n\n"
        msg += f"**Description:** {blog.get('description', 'N/A')}\n"
        msg += f"**Tags:** {', '.join(blog.get('tags', []))}\n\n"
        
        # Use semantic search with the blog's own content to find similar blogs
        # This avoids needing a direct MongoDB connection from the MCP server
        try:
            search_text = f"{blog.get('title', '')} {blog.get('description', '')}"
            search_result = await _ml_api_request(
                "post", "/search",
                json={"query": search_text, "top_k": 4},
                timeout=60.0,
            )
            
            # Filter out the blog itself from results
            recommendations = [
                r for r in search_result.get("results", [])
                if r.get("slug") != slug
            ][:3]
            
            if recommendations:
                msg += "### Similar Blogs\n"
                for i, rec in enumerate(recommendations, 1):
                    msg += f"{i}. **{rec['title']}** (score: {rec.get('score', 'N/A')})\n"
                    msg += f"   _{rec.get('description', 'No description')}_\n\n"
            else:
                msg += "_No recommendations found. The blog may not be embedded yet._\n"
        except Exception:
            msg += "_Could not fetch recommendations. ML API may be unavailable._\n"
        
        return msg
    except Exception as e:
        return f"Error getting recommendations: {str(e)}"


@mcp.tool()
async def get_system_stats() -> str:
    """Get statistics about the blog recommendation system.
    Shows: Pinecone vector count, MongoDB blog count, missing embeddings."""
    try:
        stats = await _ml_api_request("get", "/stats")
        
        msg = "## Blog Recommendation System Stats\n\n"
        
        pinecone = stats.get("pinecone", {})
        msg += "### Pinecone\n"
        msg += f"- **Index:** {pinecone.get('index_name', 'N/A')}\n"
        msg += f"- **Total Vectors:** {pinecone.get('total_vectors', 'N/A')}\n"
        msg += f"- **Dimension:** {pinecone.get('dimension', 'N/A')}\n\n"
        
        mongodb = stats.get("mongodb", {})
        msg += "### MongoDB\n"
        msg += f"- **Published Blogs:** {mongodb.get('published_blogs', 'N/A')}\n"
        msg += f"- **Recommendation Entries:** {mongodb.get('recommendation_entries', 'N/A')}\n\n"
        
        missing = stats.get("missing_embeddings", {})
        msg += f"### Missing Embeddings: {missing.get('count', 0)}\n"
        if missing.get("slugs"):
            shown = missing["slugs"][:5]
            msg += f"Slugs: {', '.join(shown)}"
            if len(missing["slugs"]) > 5:
                msg += f" ... and {len(missing['slugs']) - 5} more"
        
        return msg
    except Exception as e:
        return f"Error getting stats: {str(e)}"


@mcp.tool()
async def embed_single_blog(
    slug: str,
    title: str = "",
    description: str = "",
    content: str = "",
    tags: list[str] = [],
    is_starred: bool = False,
) -> str:
    """Manually trigger embedding generation for a specific blog.
    Use this if embedding failed during blog creation.
    
    Args:
        slug: The blog slug to embed (required)
        title: Blog title
        description: Blog description
        content: Blog content
        tags: Blog tags
        is_starred: Is the blog starred?
    """
    try:
        result = await _ml_api_request(
            "post", "/embed-blog",
            json={
                "slug": slug,
                "title": title,
                "description": description,
                "content": content,
                "tags": tags,
                "is_starred": is_starred,
            },
            timeout=120.0,
        )
        
        if result.get("success"):
            return f"✅ Embedded blog '{slug}'. {result.get('recommendations_updated', 0)} recommendations updated."
        else:
            return f"❌ Error: {result.get('detail', result.get('message', 'Unknown error'))}"
    except Exception as e:
        return f"Error embedding blog: {str(e)}"


@mcp.tool()
async def update_all_recommendations() -> str:
    """Recompute recommendations for ALL blogs.
    Use this when you've made changes and want to refresh all recommendations."""
    try:
        result = await _ml_api_request("post", "/update-all-recommendations", timeout=300.0)
        return f"✅ Updated recommendations for {result.get('count', 'unknown')} blogs."
    except Exception as e:
        return f"Error updating recommendations: {str(e)}"


@mcp.tool()
async def rerun_failed_embeddings() -> str:
    """Find and re-embed all blogs that are missing embeddings in Pinecone.
    Use this to fix blogs that failed to embed during creation."""
    try:
        result = await _ml_api_request("post", "/rerun-failed-embeddings", timeout=600.0)
        
        msg = f"✅ {result.get('message', 'Done')}\n"
        reprocessed = result.get("reprocessed", [])
        failed = result.get("failed", [])
        msg += f"- **Reprocessed:** {len(reprocessed) if isinstance(reprocessed, list) else reprocessed}\n"
        msg += f"- **Failed:** {len(failed) if isinstance(failed, list) else failed}\n"
        
        return msg
    except Exception as e:
        return f"Error rerunning embeddings: {str(e)}"


# ============================================================
# Main Entry Point
# ============================================================

def main():
    # Auto-detect deployment environment (Render sets PORT env var)
    render_port = os.getenv("PORT")
    is_deployed = render_port is not None

    parser = argparse.ArgumentParser(description="MCP Server for Portfolio Blog System")
    parser.add_argument(
        "--transport",
        choices=["stdio", "streamable-http"],
        default="streamable-http" if is_deployed else "stdio",
        help="Transport to use (stdio for local, streamable-http for remote)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=int(render_port) if render_port else 8001,
        help="Port for HTTP transport",
    )
    parser.add_argument(
        "--host",
        default="0.0.0.0",
        help="Host for HTTP transport",
    )
    
    args = parser.parse_args()
    
    # Validate passwords (log to stderr so it doesn't interfere with stdio)
    if not config.nextjs_password:
        _log("⚠️  WARNING: NEXTJS_PASSWORD not set. Blog creation will fail.")
    
    if not config.ml_api_secret:
        _log("⚠️  WARNING: ML_API_SECRET not set. ML API calls will fail.")
    
    _log("=" * 60)
    _log("Portfolio Blog MCP Server")
    _log("=" * 60)
    _log(f"Transport:   {args.transport}")
    _log(f"Deployed:    {is_deployed}")
    _log(f"Next.js URL: {config.nextjs_url}")
    _log(f"ML API URL:  {config.ml_api_url}")
    _log(f"Tools:       {len(mcp._tool_manager._tools)} registered")
    _log("=" * 60)
    
    if args.transport == "stdio":
        _log("\n🚀 Running MCP server over stdio...")
        _log("   Connect via Claude Desktop, Cursor, or other MCP clients")
        mcp.run(transport="stdio")
    else:
        # Set host/port on settings before running (run() doesn't accept these)
        mcp.settings.host = args.host
        mcp.settings.port = args.port
        _log(f"\n🚀 Running MCP server on http://{args.host}:{args.port}/mcp")
        mcp.run(transport="streamable-http")


if __name__ == "__main__":
    main()
