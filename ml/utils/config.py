"""
Configuration for the blog recommendation system.
Loads environment variables and provides config values.
"""

import os
from dotenv import load_dotenv
from pathlib import Path

# Load .env from project root
env_path = Path(__file__).parent.parent.parent / '.env'
load_dotenv(env_path)


def get_mongodb_uri() -> str:
    """Get MongoDB connection URI."""
    uri = os.getenv('MONGODB_URI')
    if not uri:
        raise ValueError("MONGODB_URI not found in environment variables")
    return uri


def get_pinecone_api_key() -> str:
    """Get Pinecone API key."""
    key = os.getenv('PINECONE_API_KEY')
    if not key:
        raise ValueError("PINECONE_API_KEY not found in environment variables")
    return key


def get_google_api_key() -> str:
    """Get Google AI API key for embeddings."""
    key = os.getenv('GOOGLE_API_KEY')
    if not key:
        raise ValueError("GOOGLE_API_KEY not found in environment variables")
    return key


# Pinecone configuration
PINECONE_INDEX_NAME = "portfolio-blog-embedding"
PINECONE_ENVIRONMENT = os.getenv('PINECONE_ENVIRONMENT', 'gcp-starter')

# Embedding configuration
EMBEDDING_DIMENSION = 768  # Google's text-embedding model dimension

# MongoDB configuration
MONGODB_DATABASE = "portfolio"
MONGODB_COLLECTION = "blogs"
