"""
Test script for Pinecone vector database.
Tests connection, upserting, and similarity search.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.database import fetch_published_blogs
from utils.preprocessing import preprocess_blogs
from utils.embeddings import embed_preprocessed_blogs
from utils.vector_store import (
    get_index_stats,
    upsert_blogs_batch,
    find_similar_blogs,
)


def test_pinecone_connection():
    """Test Pinecone connection."""
    print("=" * 50)
    print("Testing Pinecone Connection")
    print("=" * 50)
    
    try:
        stats = get_index_stats()
        print(f"✅ Connected to Pinecone!")
        print(f"   Index: {stats['index_name']}")
        print(f"   Total vectors: {stats['total_vectors']}")
        print(f"   Dimension: {stats['dimension']}\n")
        return True, stats['total_vectors']
        
    except Exception as e:
        print(f"❌ Pinecone connection failed: {e}")
        import traceback
        traceback.print_exc()
        return False, 0


def test_upsert_blogs():
    """Test upserting blog embeddings to Pinecone."""
    print("=" * 50)
    print("Upserting Blog Embeddings")
    print("=" * 50)
    
    try:
        # Fetch and preprocess blogs
        print("📥 Fetching blogs from MongoDB...")
        blogs = fetch_published_blogs()
        print(f"   Found {len(blogs)} published blogs")
        
        if not blogs:
            print("⚠️ No blogs found")
            return 0
        
        # Preprocess
        print("\n🔧 Preprocessing blogs...")
        processed = preprocess_blogs(blogs)
        
        # Generate embeddings
        print("\n🧠 Generating embeddings...")
        embedded = embed_preprocessed_blogs(processed, show_progress=True)
        
        # Upsert to Pinecone
        print("\n📤 Upserting to Pinecone...")
        count = upsert_blogs_batch(embedded, show_progress=True)
        
        print(f"\n✅ Successfully upserted {count} blogs to Pinecone!")
        return count
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return 0


def test_similarity_search(slugs: list):
    """Test similarity search for each blog."""
    print("\n" + "=" * 50)
    print("Testing Similarity Search")
    print("=" * 50)
    
    if not slugs:
        print("⚠️ No slugs to test")
        return
    
    for slug in slugs:
        print(f"\n📄 Finding blogs similar to: '{slug}'")
        
        similar = find_similar_blogs(slug, top_k=2)
        
        if similar:
            for i, blog in enumerate(similar, 1):
                title = blog['metadata'].get('title', 'Unknown')[:40]
                score = blog['score']
                print(f"   {i}. {title}... (score: {score:.4f})")
        else:
            print("   No similar blogs found")


def main():
    """Run all Pinecone tests."""
    print("\n🚀 Blog Recommendation System - Pinecone Test\n")
    
    # Test 1: Pinecone connection
    connected, existing_count = test_pinecone_connection()
    if not connected:
        print("\n❌ Cannot proceed without Pinecone connection")
        return
    
    # Test 2: Upsert blogs (only if needed)
    if existing_count == 0:
        print("\n📝 No vectors in index. Upserting blogs...")
        count = test_upsert_blogs()
    else:
        print(f"\n✅ Index already has {existing_count} vectors")
        # Ask if user wants to re-upsert
        print("   Skipping upsert. Delete vectors manually if you want to re-index.")
        count = existing_count
    
    # Test 3: Similarity search
    if count > 0:
        # Get slugs from MongoDB for testing
        blogs = fetch_published_blogs()
        slugs = [b['slug'] for b in blogs[:3]]  # Test first 3
        test_similarity_search(slugs)
    
    # Summary
    print("\n" + "=" * 50)
    print("Summary")
    print("=" * 50)
    
    final_stats = get_index_stats()
    print(f"✅ Pinecone Index: {final_stats['index_name']}")
    print(f"✅ Vectors stored: {final_stats['total_vectors']}")
    print(f"\n🎉 Pinecone test completed!")
    print("\nNext step: Build the training pipeline to compute all recommendations")


if __name__ == "__main__":
    main()
