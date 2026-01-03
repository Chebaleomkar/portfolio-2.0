"""
ML Utilities package for blog recommendation system.
"""

from .config import (
    get_mongodb_uri,
    get_pinecone_api_key,
    get_google_api_key,
    PINECONE_INDEX_NAME,
    EMBEDDING_DIMENSION,
)

from .database import (
    fetch_published_blogs,
    fetch_blog_by_slug,
    get_blog_count,
)

from .preprocessing import (
    preprocess_blog,
    preprocess_blogs,
    markdown_to_plain_text,
    clean_text,
)
