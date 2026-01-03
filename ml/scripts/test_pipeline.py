"""
Test script to verify the ML pipeline setup.
Fetches blogs from MongoDB and runs preprocessing.
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.database import fetch_published_blogs, get_blog_count
from utils.preprocessing import preprocess_blog, preprocess_blogs


def test_mongodb_connection():
    """Test MongoDB connection and fetch blogs."""
    print("=" * 50)
    print("Testing MongoDB Connection")
    print("=" * 50)
    
    try:
        count = get_blog_count()
        print(f"✅ Connected to MongoDB")
        print(f"📝 Found {count} published blogs\n")
        return count > 0
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False


def test_fetch_blogs():
    """Test fetching all blogs."""
    print("=" * 50)
    print("Fetching Blogs")
    print("=" * 50)
    
    try:
        blogs = fetch_published_blogs()
        print(f"✅ Fetched {len(blogs)} blogs\n")
        
        # Show blog titles
        for i, blog in enumerate(blogs, 1):
            title = blog.get('title', 'Untitled')
            slug = blog.get('slug', 'no-slug')
            tags = blog.get('tags', [])
            print(f"  {i}. {title}")
            print(f"     Slug: {slug}")
            print(f"     Tags: {', '.join(tags) if tags else 'None'}")
            print()
        
        return blogs
    except Exception as e:
        print(f"❌ Failed to fetch blogs: {e}")
        return []


def test_preprocessing(blogs):
    """Test preprocessing on fetched blogs."""
    print("=" * 50)
    print("Testing Preprocessing")
    print("=" * 50)
    
    if not blogs:
        print("⚠️ No blogs to preprocess")
        return []
    
    try:
        processed = preprocess_blogs(blogs)
        print(f"✅ Preprocessed {len(processed)} blogs\n")
        
        # Show sample of processed content
        for blog in processed[:2]:  # Show first 2
            print(f"  📄 {blog['title']}")
            print(f"     Slug: {blog['slug']}")
            print(f"     Text length: {len(blog['processed_text'])} chars")
            
            # Show preview of processed text
            preview = blog['processed_text'][:150].replace('\n', ' ')
            print(f"     Preview: {preview}...")
            print()
        
        return processed
    except Exception as e:
        print(f"❌ Preprocessing failed: {e}")
        return []


def main():
    """Run all tests."""
    print("\n🚀 Blog Recommendation System - Pipeline Test\n")
    
    # Test 1: MongoDB connection
    if not test_mongodb_connection():
        print("\n❌ Cannot proceed without MongoDB connection")
        return
    
    # Test 2: Fetch blogs
    blogs = test_fetch_blogs()
    if not blogs:
        print("\n⚠️ No blogs found. Add some blogs to MongoDB first.")
        return
    
    # Test 3: Preprocessing
    processed = test_preprocessing(blogs)
    
    # Summary
    print("=" * 50)
    print("Summary")
    print("=" * 50)
    print(f"✅ MongoDB: Connected")
    print(f"✅ Blogs fetched: {len(blogs)}")
    print(f"✅ Blogs preprocessed: {len(processed)}")
    print(f"\n🎉 Pipeline test completed successfully!")
    print(f"\nNext step: Set up embedding generation with Google AI")


if __name__ == "__main__":
    main()
