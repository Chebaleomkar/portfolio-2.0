"""
Main training script for the blog recommendation system.
Run this script monthly (or when new blogs are added) to update recommendations.

Usage:
    python scripts/train.py
    python scripts/train.py --force  # Force re-index all blogs
"""

import sys
import json
import argparse
from pathlib import Path
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.database import fetch_published_blogs, get_blog_count
from utils.preprocessing import preprocess_blogs
from utils.embeddings import embed_preprocessed_blogs
from utils.vector_store import (
    get_index_stats,
    upsert_blogs_batch,
    find_similar_blogs,
    delete_all_vectors,
)
from utils.config import PINECONE_INDEX_NAME


def log(message: str, level: str = "INFO"):
    """Print a timestamped log message."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    prefix = {"INFO": "ℹ️", "SUCCESS": "✅", "WARNING": "⚠️", "ERROR": "❌"}.get(level, "")
    print(f"[{timestamp}] {prefix} {message}")


def fetch_and_preprocess_blogs():
    """Fetch blogs from MongoDB and preprocess them."""
    log("Fetching blogs from MongoDB...")
    blogs = fetch_published_blogs()
    log(f"Found {len(blogs)} published blogs", "SUCCESS")
    
    if not blogs:
        return []
    
    log("Preprocessing blog content...")
    processed = preprocess_blogs(blogs)
    log(f"Preprocessed {len(processed)} blogs", "SUCCESS")
    
    return processed


def generate_all_embeddings(processed_blogs):
    """Generate embeddings for all preprocessed blogs."""
    log(f"Generating embeddings for {len(processed_blogs)} blogs...")
    log("(This may take a few minutes due to API rate limits)")
    
    embedded = embed_preprocessed_blogs(processed_blogs, show_progress=True)
    log(f"Generated embeddings for {len(embedded)} blogs", "SUCCESS")
    
    return embedded


def update_pinecone_index(embedded_blogs, force: bool = False):
    """Upsert blog embeddings to Pinecone."""
    stats = get_index_stats()
    current_count = stats['total_vectors']
    
    if force and current_count > 0:
        log("Force flag set. Deleting existing vectors...")
        delete_all_vectors()
        log("Existing vectors deleted", "SUCCESS")
    
    log(f"Upserting {len(embedded_blogs)} blogs to Pinecone...")
    count = upsert_blogs_batch(embedded_blogs, show_progress=True)
    log(f"Upserted {count} blogs to Pinecone", "SUCCESS")
    
    return count


def compute_recommendations(slugs: list, top_k: int = 3):
    """Compute recommendations for all blogs."""
    log(f"Computing recommendations for {len(slugs)} blogs...")
    
    recommendations = {}
    
    for i, slug in enumerate(slugs):
        similar = find_similar_blogs(slug, top_k=top_k)
        
        # Store simplified recommendation data
        recommendations[slug] = [
            {
                "slug": rec["slug"],
                "title": rec["metadata"].get("title", ""),
                "description": rec["metadata"].get("description", ""),
                "score": round(rec["score"], 4)
            }
            for rec in similar
        ]
        
        # Progress indicator
        if (i + 1) % 5 == 0 or i == len(slugs) - 1:
            log(f"  Computed {i + 1}/{len(slugs)} recommendations")
    
    log(f"Computed recommendations for {len(recommendations)} blogs", "SUCCESS")
    return recommendations


def export_recommendations(recommendations: dict, output_dir: Path):
    """Export recommendations to JSON file for Next.js API."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Main recommendations file
    output_file = output_dir / "recommendations.json"
    
    export_data = {
        "generated_at": datetime.now().isoformat(),
        "total_blogs": len(recommendations),
        "pinecone_index": PINECONE_INDEX_NAME,
        "recommendations": recommendations
    }
    
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(export_data, f, indent=2, ensure_ascii=False)
    
    log(f"Exported recommendations to {output_file}", "SUCCESS")
    
    # Also create a simple lookup file for faster access
    lookup_file = output_dir / "recommendations_lookup.json"
    with open(lookup_file, "w", encoding="utf-8") as f:
        json.dump(recommendations, f, indent=2, ensure_ascii=False)
    
    log(f"Exported lookup file to {lookup_file}", "SUCCESS")
    
    return output_file


def print_sample_recommendations(recommendations: dict, count: int = 3):
    """Print sample recommendations for verification."""
    print("\n" + "=" * 60)
    print("📋 Sample Recommendations")
    print("=" * 60)
    
    for i, (slug, recs) in enumerate(list(recommendations.items())[:count]):
        print(f"\n📄 {slug[:50]}...")
        for j, rec in enumerate(recs, 1):
            title = rec['title'][:40] if rec['title'] else 'Untitled'
            print(f"   {j}. {title}... (score: {rec['score']})")


def main():
    """Main training pipeline."""
    parser = argparse.ArgumentParser(description="Train blog recommendation system")
    parser.add_argument("--force", action="store_true", help="Force re-index all blogs")
    parser.add_argument("--top-k", type=int, default=3, help="Number of recommendations per blog")
    args = parser.parse_args()
    
    print("\n" + "=" * 60)
    print("🚀 Blog Recommendation System - Training Pipeline")
    print("=" * 60 + "\n")
    
    start_time = datetime.now()
    
    try:
        # Step 1: Fetch and preprocess
        print("\n📥 Step 1: Fetch & Preprocess")
        print("-" * 40)
        processed_blogs = fetch_and_preprocess_blogs()
        
        if not processed_blogs:
            log("No blogs found. Exiting.", "WARNING")
            return
        
        # Step 2: Generate embeddings
        print("\n🧠 Step 2: Generate Embeddings")
        print("-" * 40)
        embedded_blogs = generate_all_embeddings(processed_blogs)
        
        # Step 3: Update Pinecone
        print("\n📤 Step 3: Update Pinecone Index")
        print("-" * 40)
        update_pinecone_index(embedded_blogs, force=args.force)
        
        # Step 4: Compute recommendations
        print("\n🔍 Step 4: Compute Recommendations")
        print("-" * 40)
        slugs = [blog['slug'] for blog in embedded_blogs]
        recommendations = compute_recommendations(slugs, top_k=args.top_k)
        
        # Step 5: Export
        print("\n💾 Step 5: Export Recommendations")
        print("-" * 40)
        output_dir = Path(__file__).parent.parent / "data"
        export_recommendations(recommendations, output_dir)
        
        # Print samples
        print_sample_recommendations(recommendations)
        
        # Summary
        end_time = datetime.now()
        duration = (end_time - start_time).total_seconds()
        
        print("\n" + "=" * 60)
        print("✅ Training Complete!")
        print("=" * 60)
        print(f"   Blogs processed: {len(processed_blogs)}")
        print(f"   Vectors in Pinecone: {get_index_stats()['total_vectors']}")
        print(f"   Recommendations computed: {len(recommendations)}")
        print(f"   Time taken: {duration:.1f} seconds")
        print(f"\n   Output: ml/data/recommendations.json")
        print("=" * 60 + "\n")
        
    except Exception as e:
        log(f"Training failed: {e}", "ERROR")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
