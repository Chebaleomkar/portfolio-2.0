"""
Incremental update script for the blog recommendation system.
Only generates embeddings for NEW blogs, not existing ones.

Usage:
    python scripts/update.py              # Process only new blogs
    python scripts/update.py --force      # Force re-index all blogs
    python scripts/update.py --slug my-blog-slug  # Process specific blog
"""

import sys
import json
import argparse
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Any, Set

# Add parent directory to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

from utils.database import fetch_published_blogs
from utils.preprocessing import preprocess_blog, preprocess_blogs
from utils.embeddings import generate_embedding, embed_preprocessed_blogs
from utils.vector_store import (
    get_index_stats,
    get_existing_slugs,
    check_slug_exists,
    upsert_blog_embedding,
    upsert_blogs_batch,
    find_similar_blogs,
    delete_all_vectors,
)
from utils.config import PINECONE_INDEX_NAME


def log(message: str, level: str = "INFO"):
    """Print a timestamped log message."""
    timestamp = datetime.now().strftime("%H:%M:%S")
    prefix = {"INFO": "ℹ️", "SUCCESS": "✅", "WARNING": "⚠️", "ERROR": "❌", "NEW": "🆕"}.get(level, "")
    print(f"[{timestamp}] {prefix} {message}")


def get_new_blogs(all_blogs: List[Dict], existing_slugs: Set[str]) -> List[Dict]:
    """
    Filter blogs to get only those not in Pinecone.
    
    Args:
        all_blogs: All blogs from MongoDB
        existing_slugs: Set of slugs already in Pinecone
    
    Returns:
        List of new blogs that need embedding
    """
    new_blogs = []
    for blog in all_blogs:
        if blog['slug'] not in existing_slugs:
            new_blogs.append(blog)
    return new_blogs


def process_single_blog(blog: Dict) -> Dict:
    """
    Process a single blog: preprocess and generate embedding.
    
    Args:
        blog: Raw blog document from MongoDB
    
    Returns:
        Blog dict with embedding attached
    """
    # Preprocess
    processed = preprocess_blog(blog)
    
    # Generate embedding
    embedding = generate_embedding(processed['processed_text'])
    
    # Return with embedding attached
    return {
        **processed,
        'embedding': embedding
    }


def update_recommendations_for_all(all_slugs: List[str], top_k: int = 3) -> Dict:
    """
    Recompute recommendations for ALL blogs.
    This is necessary because new blogs might be similar to existing ones.
    
    Args:
        all_slugs: All blog slugs in the system
        top_k: Number of recommendations per blog
    
    Returns:
        Dict of slug -> recommendations
    """
    log(f"Recomputing recommendations for {len(all_slugs)} blogs...")
    
    recommendations = {}
    
    for i, slug in enumerate(all_slugs):
        similar = find_similar_blogs(slug, top_k=top_k)
        
        recommendations[slug] = [
            {
                "slug": rec["slug"],
                "title": rec["metadata"].get("title", ""),
                "description": rec["metadata"].get("description", ""),
                "score": round(rec["score"], 4)
            }
            for rec in similar
        ]
        
        if (i + 1) % 10 == 0 or i == len(all_slugs) - 1:
            log(f"  Computed {i + 1}/{len(all_slugs)} recommendations")
    
    return recommendations


def export_recommendations(recommendations: dict, output_dir: Path):
    """Export recommendations to JSON file."""
    output_dir.mkdir(parents=True, exist_ok=True)
    
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
    
    # Lookup file
    lookup_file = output_dir / "recommendations_lookup.json"
    with open(lookup_file, "w", encoding="utf-8") as f:
        json.dump(recommendations, f, indent=2, ensure_ascii=False)
    
    return output_file


def incremental_update(force: bool = False, specific_slug: str = None, top_k: int = 3):
    """
    Main incremental update pipeline.
    
    Args:
        force: If True, reprocess ALL blogs
        specific_slug: If provided, only process this specific blog
        top_k: Number of recommendations per blog
    """
    start_time = datetime.now()
    
    print("\n" + "=" * 60)
    print("🔄 Blog Recommendation System - Incremental Update")
    print("=" * 60 + "\n")
    
    # Step 1: Get current state
    log("Checking current index state...")
    stats = get_index_stats()
    log(f"Pinecone index has {stats['total_vectors']} vectors")
    
    # Handle force mode
    if force:
        log("Force mode enabled - will reprocess ALL blogs", "WARNING")
        if stats['total_vectors'] > 0:
            delete_all_vectors()
            log("Deleted all existing vectors", "SUCCESS")
        existing_slugs = set()
    else:
        # Get existing slugs from Pinecone
        log("Fetching existing blog slugs from Pinecone...")
        existing_slugs = set(get_existing_slugs())
        log(f"Found {len(existing_slugs)} existing blogs in index")
    
    # Step 2: Fetch all blogs from MongoDB
    log("Fetching blogs from MongoDB...")
    all_blogs = fetch_published_blogs()
    log(f"Found {len(all_blogs)} published blogs in MongoDB", "SUCCESS")
    
    if not all_blogs:
        log("No blogs found. Exiting.", "WARNING")
        return
    
    # Step 3: Determine which blogs to process
    if specific_slug:
        # Process specific blog only
        blogs_to_process = [b for b in all_blogs if b['slug'] == specific_slug]
        if not blogs_to_process:
            log(f"Blog '{specific_slug}' not found in MongoDB", "ERROR")
            return
        log(f"Processing specific blog: {specific_slug}")
    else:
        # Get new blogs only
        blogs_to_process = get_new_blogs(all_blogs, existing_slugs)
    
    # Step 4: Process new blogs
    new_count = len(blogs_to_process)
    
    if new_count == 0:
        log("No new blogs to process!", "SUCCESS")
        log("Recommendations are already up to date.")
    else:
        log(f"Found {new_count} new blog(s) to embed", "NEW")
        
        print("\n" + "-" * 40)
        print("🧠 Generating Embeddings (New Blogs Only)")
        print("-" * 40)
        
        # Preprocess and embed new blogs
        embedded_blogs = []
        for i, blog in enumerate(blogs_to_process):
            log(f"[{i+1}/{new_count}] Processing: {blog['title'][:50]}...")
            embedded = process_single_blog(blog)
            embedded_blogs.append(embedded)
        
        log(f"Generated {len(embedded_blogs)} new embeddings", "SUCCESS")
        
        # Upsert to Pinecone
        print("\n" + "-" * 40)
        print("📤 Upserting to Pinecone")
        print("-" * 40)
        
        upsert_blogs_batch(embedded_blogs, show_progress=True)
        log(f"Upserted {len(embedded_blogs)} new blogs to Pinecone", "SUCCESS")
    
    # Step 5: Recompute recommendations for ALL blogs
    # This is necessary because new blogs might be similar to existing ones
    print("\n" + "-" * 40)
    print("🔍 Updating Recommendations")
    print("-" * 40)
    
    all_slugs = [blog['slug'] for blog in all_blogs]
    recommendations = update_recommendations_for_all(all_slugs, top_k=top_k)
    
    # Step 6: Export
    print("\n" + "-" * 40)
    print("💾 Exporting Results")
    print("-" * 40)
    
    output_dir = Path(__file__).parent.parent / "data"
    export_recommendations(recommendations, output_dir)
    
    # Summary
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    final_stats = get_index_stats()
    
    print("\n" + "=" * 60)
    print("✅ Incremental Update Complete!")
    print("=" * 60)
    print(f"   New blogs processed: {new_count}")
    print(f"   Total vectors in Pinecone: {final_stats['total_vectors']}")
    print(f"   Recommendations updated: {len(recommendations)}")
    print(f"   Time taken: {duration:.1f} seconds")
    print(f"\n   Output: ml/data/recommendations.json")
    print("=" * 60 + "\n")


def main():
    """CLI entry point."""
    parser = argparse.ArgumentParser(
        description="Incremental update for blog recommendation system"
    )
    parser.add_argument(
        "--force", 
        action="store_true", 
        help="Force re-index ALL blogs (not just new ones)"
    )
    parser.add_argument(
        "--slug",
        type=str,
        default=None,
        help="Process a specific blog by slug"
    )
    parser.add_argument(
        "--top-k",
        type=int,
        default=3,
        help="Number of recommendations per blog (default: 3)"
    )
    
    args = parser.parse_args()
    
    try:
        incremental_update(
            force=args.force,
            specific_slug=args.slug,
            top_k=args.top_k
        )
    except Exception as e:
        log(f"Update failed: {e}", "ERROR")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
