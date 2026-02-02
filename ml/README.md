# Blog Recommendation System (ML)

A custom machine learning pipeline that recommends related blogs based on semantic content similarity using embeddings.

## 🌟 Features

- **Semantic Understanding**: Uses Google AI embeddings to understand blog content meaning
- **Vector Search**: Powered by Pinecone for fast similarity search
- **Pre-computed Results**: Recommendations are computed offline for instant loading
- **Monthly Retraining**: Simple script to update recommendations when new blogs are added

## 📁 Project Structure

```
ml/
├── data/                        # Generated data (gitignored)
│   ├── recommendations.json     # Full export with metadata
│   └── recommendations_lookup.json
├── scripts/
│   ├── train.py                 # Full training pipeline
│   ├── update.py                # Incremental update (new blogs only) ⭐
│   ├── test_embeddings.py       # Test embedding generation
│   └── test_pinecone.py         # Test Pinecone connection
├── utils/
│   ├── config.py                # Environment configuration
│   ├── database.py              # MongoDB operations
│   ├── preprocessing.py         # Text cleaning & preparation
│   ├── embeddings.py            # Google AI embedding generation
│   └── vector_store.py          # Pinecone operations
├── requirements.txt             # Python dependencies
└── README.md                    # This file
```

## 🚀 Quick Start

### 1. Setup Virtual Environment

```bash
cd ml
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Add these to your project root `.env` file:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key

# Google AI (for embeddings)
GOOGLE_API_KEY=your_google_ai_api_key
# or
GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run Training Pipeline

```bash
python scripts/train.py
```

This will:
1. Fetch all published blogs from MongoDB
2. Preprocess blog content (clean markdown, extract text)
3. Generate embeddings using Google AI
4. Store vectors in Pinecone
5. Compute recommendations for each blog
6. Export results to `data/recommendations.json`

## 📋 Training Commands

### Full Training (All Blogs)
```bash
python scripts/train.py
```

### Force Re-index (delete existing vectors)
```bash
python scripts/train.py --force
```

### Custom Number of Recommendations
```bash
python scripts/train.py --top-k 5
```

## 🔄 Incremental Updates (Recommended)

Use the **incremental update** script when adding new blogs. This only generates embeddings for new blogs, saving time and API costs.

### Update with New Blogs Only
```bash
python scripts/update.py
```
This will:
1. ✅ Skip blogs that already have embeddings
2. 🆕 Generate embeddings only for NEW blogs
3. 🔄 Update recommendations for ALL blogs

### Update a Specific Blog
```bash
python scripts/update.py --slug my-new-blog-slug
```

### Force Full Re-index
```bash
python scripts/update.py --force
```


## 🔧 Utility Scripts

### Test MongoDB + Preprocessing
```bash
python scripts/test_pipeline.py
```

### Test Embedding Generation
```bash
python scripts/test_embeddings.py
```

### Test Pinecone Connection
```bash
python scripts/test_pinecone.py
```

## 📊 How It Works

### 1. Data Flow

```
MongoDB Blogs → Preprocessing → Google AI Embeddings → Pinecone → Recommendations JSON
```

### 2. Preprocessing Steps

- Parse markdown to plain text
- Remove code blocks (keep context markers)
- Clean URLs, special characters
- Combine: Title + Description + Tags + Content
- Weight important fields (title, description first)

### 3. Embedding Generation

Uses Google's `text-embedding-004` model:
- 768-dimensional vectors
- Semantic understanding
- Rate-limited to avoid API throttling

### 4. Similarity Search

- Cosine similarity between blog embeddings
- Top-K most similar blogs (excluding self)
- Stored in Pinecone for fast retrieval

## 🔄 Monthly Workflow

When you add new blogs, run the training pipeline:

```bash
cd ml
.\venv\Scripts\activate
python scripts/train.py
```

The Next.js API will automatically serve the updated recommendations.

## 🌐 API Integration

The training pipeline generates `data/recommendations.json` which is read by:

```
/api/recommendations/[slug]
```

Returns:
```json
{
  "success": true,
  "slug": "your-blog-slug",
  "recommendations": [
    {
      "slug": "related-blog-slug",
      "title": "Related Blog Title",
      "description": "Blog description...",
      "score": 0.6614
    }
  ]
}
```

## 🛠 Tech Stack

| Component | Technology |
|-----------|------------|
| Embeddings | Google AI (text-embedding-004) |
| Vector DB | Pinecone |
| Database | MongoDB |
| Language | Python 3.10+ |

## 📝 Notes

- The `data/` directory is gitignored (contains generated files)
- Pinecone index name: `portfolio-blog-embedding`
- Embedding dimension: 768
- Rate limit: ~0.5s delay between embedding requests

## 🐛 Troubleshooting

### "GOOGLE_API_KEY not found"
Add your API key to the project `.env` file.

### "Pinecone index not found"
The training script automatically creates the index on first run.

### "No blogs found"
Ensure you have published blogs in MongoDB with `published: true`.

### Embeddings are slow
This is expected due to API rate limits. ~6 blogs takes ~15 seconds.
