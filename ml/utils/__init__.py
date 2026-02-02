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

from .embeddings import (
    generate_embedding,
    generate_query_embedding,
    generate_embeddings_batch,
    embed_preprocessed_blogs,
    compute_similarity,
)

from .vector_store import (
    get_index,
    upsert_blog_embedding,
    upsert_blogs_batch,
    find_similar_blogs,
    find_similar_by_embedding,
    get_index_stats,
    get_existing_slugs,
    check_slug_exists,
)
