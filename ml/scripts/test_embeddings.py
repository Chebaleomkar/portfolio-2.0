"""
Test script for embedding generation.
Tests Google AI embeddings with a sample blog.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.database import fetch_published_blogs
from utils.preprocessing import preprocess_blogs
from utils.embeddings import (
    generate_embedding,
    embed_preprocessed_blogs,
    compute_similarity
)


def test_google_ai_connection():
    """Test Google AI connection."""
    print("=" * 50)
    print("Testing Google AI Connection")
    print("=" * 50)
    
    try:
        # Generate a test embedding
        test_text = "Hello, this is a test for embedding generation."
        embedding = generate_embedding(test_text)
        
        print(f"✅ Connected to Google AI")
        print(f"   Embedding dimension: {len(embedding)}")
        print(f"   Sample values: {embedding[:3]}...\n")
        return True
        
    except Exception as e:
        print(f"❌ Google AI connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_blog_embeddings():
    """Test embedding generation for actual blogs."""
    print("=" * 50)
    print("Testing Blog Embeddings")
    print("=" * 50)
    
    try:
        # Fetch blogs
        blogs = fetch_published_blogs()
        print(f"📝 Fetched {len(blogs)} blogs from MongoDB")
        
        if not blogs:
            print("⚠️ No blogs found. Add some blogs first.")
            return None
        
        # Preprocess
        processed = preprocess_blogs(blogs)
        print(f"🔧 Preprocessed {len(processed)} blogs")
        
        # Generate embeddings (limit to 3 for testing)
        test_blogs = processed[:3]
        print(f"\n🧠 Generating embeddings for {len(test_blogs)} blogs...")
        
        embedded = embed_preprocessed_blogs(test_blogs, show_progress=True)
        print(f"\n✅ Generated embeddings for {len(embedded)} blogs")
        
        return embedded
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None


def test_similarity(embedded_blogs):
    """Test similarity computation between blogs."""
    print("\n" + "=" * 50)
    print("Testing Similarity Computation")
    print("=" * 50)
    
    if not embedded_blogs or len(embedded_blogs) < 2:
        print("⚠️ Need at least 2 blogs to test similarity")
        return
    
    print("\n📊 Similarity Matrix:\n")
    
    # Print header
    max_title_len = 25
    header = " " * (max_title_len + 2)
    for blog in embedded_blogs:
        short_title = blog['title'][:8] + ".."
        header += f"{short_title:>12}"
    print(header)
    print("-" * len(header))
    
    # Print matrix
    for blog1 in embedded_blogs:
        title1 = blog1['title'][:max_title_len].ljust(max_title_len)
        row = f"{title1}  "
        
        for blog2 in embedded_blogs:
            sim = compute_similarity(blog1['embedding'], blog2['embedding'])
            row += f"{sim:>12.4f}"
        
        print(row)
    
    print("\n✅ Higher values = more similar content")


def main():
    """Run all embedding tests."""
    print("\n🚀 Blog Recommendation System - Embedding Test\n")
    
    # Test 1: Google AI connection
    if not test_google_ai_connection():
        print("\n❌ Cannot proceed without Google AI connection")
        return
    
    # Test 2: Blog embeddings
    embedded = test_blog_embeddings()
    
    # Test 3: Similarity computation
    if embedded:
        test_similarity(embedded)
    
    # Summary
    print("\n" + "=" * 50)
    print("Summary")
    print("=" * 50)
    print("✅ Google AI: Connected")
    print(f"✅ Embeddings generated: {len(embedded) if embedded else 0}")
    print("\n🎉 Embedding test completed!")
    print("\nNext step: Set up Pinecone vector database")


if __name__ == "__main__":
    main()
