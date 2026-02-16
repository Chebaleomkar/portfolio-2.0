"""
Embedding generation using Google AI.
Generates vector embeddings for blog content.
"""

import time
from typing import List, Dict, Any
from google import genai
from google.genai import types
from utils.config import get_google_api_key, EMBEDDING_DIMENSION


# Global client
_client = None


def get_client() -> genai.Client:
    """Get or create Google AI client."""
    global _client
    if _client is None:
        api_key = get_google_api_key()
        _client = genai.Client(api_key=api_key)
    return _client


def generate_embedding(text: str) -> List[float]:
    """
    Generate embedding for a single text using Google AI.
    
    Args:
        text: The text to embed
    
    Returns:
        List of floats representing the embedding vector
    """
    # Truncate text if too long (Google AI has token limits)
    max_chars = 25000  # Safe limit for token constraints
    if len(text) > max_chars:
        text = text[:max_chars]
    
    client = get_client()
    
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_DOCUMENT",
            output_dimensionality=EMBEDDING_DIMENSION,  # Match Pinecone index (768)
        )
    )
    
    return list(result.embeddings[0].values)


def generate_query_embedding(text: str) -> List[float]:
    """
    Generate embedding for a search query.
    Uses RETRIEVAL_QUERY task type for better search results.
    
    Args:
        text: The query text
    
    Returns:
        List of floats representing the embedding vector
    """
    client = get_client()
    
    result = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
        config=types.EmbedContentConfig(
            task_type="RETRIEVAL_QUERY",
            output_dimensionality=EMBEDDING_DIMENSION,  # Match Pinecone index (768)
        )
    )
    
    return list(result.embeddings[0].values)


def generate_embeddings_batch(
    texts: List[str], 
    delay_seconds: float = 0.5
) -> List[List[float]]:
    """
    Generate embeddings for multiple texts.
    Includes delay to respect rate limits.
    
    Args:
        texts: List of texts to embed
        delay_seconds: Delay between API calls to avoid rate limiting
    
    Returns:
        List of embedding vectors
    """
    embeddings = []
    
    for i, text in enumerate(texts):
        try:
            embedding = generate_embedding(text)
            embeddings.append(embedding)
            
            # Rate limiting delay (skip on last item)
            if i < len(texts) - 1:
                time.sleep(delay_seconds)
                
        except Exception as e:
            print(f"Error generating embedding for text {i}: {e}")
            # Return zero vector on error to maintain order
            embeddings.append([0.0] * EMBEDDING_DIMENSION)
    
    return embeddings


def embed_preprocessed_blogs(
    processed_blogs: List[Dict[str, Any]],
    show_progress: bool = True
) -> List[Dict[str, Any]]:
    """
    Generate embeddings for preprocessed blogs.
    
    Args:
        processed_blogs: List of preprocessed blog dicts with 'processed_text' field
        show_progress: Whether to print progress updates
    
    Returns:
        List of blog dicts with 'embedding' field added
    """
    total = len(processed_blogs)
    embedded_blogs = []
    
    for i, blog in enumerate(processed_blogs):
        try:
            # Generate embedding
            embedding = generate_embedding(blog['processed_text'])
            
            # Add embedding to blog dict
            blog_with_embedding = {
                **blog,
                'embedding': embedding
            }
            embedded_blogs.append(blog_with_embedding)
            
            if show_progress:
                print(f"  [{i+1}/{total}] Embedded: {blog['title'][:50]}...")
            
            # Rate limiting (skip on last item)
            if i < total - 1:
                time.sleep(0.5)
                
        except Exception as e:
            print(f"  ❌ Error embedding '{blog.get('slug', 'unknown')}': {e}")
            continue
    
    return embedded_blogs


def compute_similarity(embedding1: List[float], embedding2: List[float]) -> float:
    """
    Compute cosine similarity between two embeddings.
    
    Args:
        embedding1: First embedding vector
        embedding2: Second embedding vector
    
    Returns:
        Cosine similarity score between 0 and 1
    """
    import numpy as np
    
    vec1 = np.array(embedding1)
    vec2 = np.array(embedding2)
    
    # Cosine similarity
    dot_product = np.dot(vec1, vec2)
    norm1 = np.linalg.norm(vec1)
    norm2 = np.linalg.norm(vec2)
    
    if norm1 == 0 or norm2 == 0:
        return 0.0
    
    return float(dot_product / (norm1 * norm2))


# For testing
if __name__ == "__main__":
    print("Testing Google AI Embeddings...")
    
    try:
        # Test embedding generation
        test_text = "Building a custom recommendation system using machine learning and Python"
        embedding = generate_embedding(test_text)
        
        print(f"✅ Embedding generated successfully!")
        print(f"   Dimension: {len(embedding)}")
        print(f"   First 5 values: {embedding[:5]}")
        
        # Test similarity
        text1 = "Machine learning for blog recommendations"
        text2 = "Building ML-powered recommendation engines"
        text3 = "Cooking recipes and food preparation"
        
        emb1 = generate_embedding(text1)
        time.sleep(0.5)
        emb2 = generate_embedding(text2)
        time.sleep(0.5)
        emb3 = generate_embedding(text3)
        
        sim_related = compute_similarity(emb1, emb2)
        sim_unrelated = compute_similarity(emb1, emb3)
        
        print(f"\n📊 Similarity Test:")
        print(f'   "{text1[:30]}..." vs "{text2[:30]}...": {sim_related:.4f}')
        print(f'   "{text1[:30]}..." vs "{text3[:30]}...": {sim_unrelated:.4f}')
        print(f"   ✅ Related texts are more similar: {sim_related > sim_unrelated}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
