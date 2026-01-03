# Blog Recommendation System (ML)

A custom machine learning pipeline to recommend related blogs based on content similarity.

## Architecture

```
ml/
├── data/                    # Generated embeddings and recommendations
├── scripts/                 # Executable scripts
│   └── test_pipeline.py    # Test MongoDB + preprocessing
├── utils/                   # Reusable utilities
│   ├── config.py           # Environment configuration
│   ├── database.py         # MongoDB operations
│   └── preprocessing.py    # Text preprocessing
└── requirements.txt        # Python dependencies
```

## Setup

1. **Create virtual environment:**
   ```bash
   cd ml
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Required environment variables** (in project root `.env`):
   ```
   MONGODB_URI=your_mongodb_connection_string
   PINECONE_API_KEY=your_pinecone_api_key
   GOOGLE_API_KEY=your_google_ai_api_key
   ```

## Usage

### Test the pipeline:
```bash
python scripts/test_pipeline.py
```

## Tech Stack

- **Embeddings**: Google AI (text-embedding model)
- **Vector DB**: Pinecone (index: `portfolio-blog-embedding`)
- **Database**: MongoDB (source of blog data)
- **Framework**: Pure Python with functional programming

## How It Works

1. **Fetch** blogs from MongoDB
2. **Preprocess** content (clean markdown, extract text)
3. **Generate embeddings** using Google AI
4. **Store** embeddings in Pinecone
5. **Query** for similar blogs using cosine similarity
6. **Export** recommendations as JSON for Next.js API
