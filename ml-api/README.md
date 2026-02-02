# Blog Recommendation ML API

FastAPI backend for real-time blog embedding and recommendation updates.

## Deployment on Render

### 1. Create a new Web Service on Render

1. Go to [render.com](https://render.com) and sign up/login
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `portfolio-ml-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `ml-api`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2. Set Environment Variables

Add these in the Render dashboard:

```
MONGODB_URI=your_mongodb_connection_string
PINECONE_API_KEY=your_pinecone_api_key
GOOGLE_API_KEY=your_google_ai_api_key
API_SECRET=your_secret_key_for_webhook_auth
```

### 3. Get your API URL

After deployment, you'll get a URL like:
```
https://portfolio-ml-api.onrender.com
```

## API Endpoints

### Health Check
```bash
GET /health
```

### Embed New Blog (Webhook)
```bash
POST /embed-blog
Headers:
  X-API-Secret: your-secret-key
Body:
  {
    "slug": "my-new-blog",
    "title": "My New Blog",
    "description": "Blog description",
    "content": "Full markdown content...",
    "tags": ["tag1", "tag2"],
    "is_starred": false
  }
```

### Update All Recommendations
```bash
POST /update-all-recommendations
Headers:
  X-API-Secret: your-secret-key
```

### Get Stats
```bash
GET /stats
```

## Local Development

```bash
cd ml-api
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Set environment variables
set MONGODB_URI=...
set PINECONE_API_KEY=...
set GOOGLE_API_KEY=...
set API_SECRET=...

# Run
uvicorn main:app --reload
```

## Integration with Next.js

After deploying, add this to your Next.js `.env`:

```env
ML_API_URL=https://portfolio-ml-api.onrender.com
ML_API_SECRET=your-secret-key
```

Then update your blog POST route to call the ML API.
