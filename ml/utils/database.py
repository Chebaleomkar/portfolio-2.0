"""
Database utilities for fetching blogs from MongoDB.
"""

from typing import List, Dict, Any, Optional
from pymongo import MongoClient
from utils.config import get_mongodb_uri, MONGODB_DATABASE, MONGODB_COLLECTION


def get_mongo_client() -> MongoClient:
    """Create and return a MongoDB client."""
    uri = get_mongodb_uri()
    return MongoClient(uri)


def fetch_published_blogs(client: Optional[MongoClient] = None) -> List[Dict[str, Any]]:
    """
    Fetch all published blogs from MongoDB.
    
    Args:
        client: Optional MongoDB client. If not provided, creates a new one.
    
    Returns:
        List of blog documents
    """
    should_close = False
    if client is None:
        client = get_mongo_client()
        should_close = True
    
    try:
        db = client[MONGODB_DATABASE]
        collection = db[MONGODB_COLLECTION]
        
        # Fetch only published blogs with required fields
        blogs = list(collection.find(
            {'published': True},
            {
                '_id': 0,
                'title': 1,
                'slug': 1,
                'description': 1,
                'content': 1,
                'tags': 1,
                'isStarred': 1,
                'published': 1,
                'createdAt': 1,
                'updatedAt': 1,
            }
        ))
        
        return blogs
    
    finally:
        if should_close:
            client.close()


def fetch_blog_by_slug(slug: str, client: Optional[MongoClient] = None) -> Optional[Dict[str, Any]]:
    """
    Fetch a single blog by its slug.
    
    Args:
        slug: The blog's unique slug
        client: Optional MongoDB client
    
    Returns:
        Blog document or None if not found
    """
    should_close = False
    if client is None:
        client = get_mongo_client()
        should_close = True
    
    try:
        db = client[MONGODB_DATABASE]
        collection = db[MONGODB_COLLECTION]
        
        blog = collection.find_one(
            {'slug': slug, 'published': True},
            {'_id': 0}
        )
        
        return blog
    
    finally:
        if should_close:
            client.close()


def get_blog_count(client: Optional[MongoClient] = None) -> int:
    """
    Get the count of published blogs.
    
    Args:
        client: Optional MongoDB client
    
    Returns:
        Number of published blogs
    """
    should_close = False
    if client is None:
        client = get_mongo_client()
        should_close = True
    
    try:
        db = client[MONGODB_DATABASE]
        collection = db[MONGODB_COLLECTION]
        
        return collection.count_documents({'published': True})
    
    finally:
        if should_close:
            client.close()


# For testing
if __name__ == "__main__":
    print("Testing MongoDB connection...")
    
    try:
        count = get_blog_count()
        print(f"✅ Connected! Found {count} published blogs")
        
        blogs = fetch_published_blogs()
        for blog in blogs[:3]:  # Show first 3
            print(f"  - {blog.get('title', 'Untitled')} ({blog.get('slug', 'no-slug')})")
        
        if count > 3:
            print(f"  ... and {count - 3} more")
            
    except Exception as e:
        print(f"❌ Error: {e}")
