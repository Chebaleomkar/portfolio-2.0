# MCP Server for Portfolio Blog System

This MCP (Model Context Protocol) server exposes your blog recommendation system as tools that can be discovered and used by AI agents like Claude Desktop, Cursor, etc.

## Features

### Available Tools

| Tool | Type | Description |
|------|------|-------------|
| `health_check` | Minimal | Check if ML API is running |
| `list_blogs` | Minimal | List all published blogs |
| `search_blogs_by_text` | Minimal | Semantic search using raw text query |
| `create_blog` | Full | Post a new blog (auto-triggers ML embedding) |
| `get_blog_recommendations` | Full | Get AI-powered recommendations for a blog |
| `get_system_stats` | Full | Get ML system statistics |
| `embed_single_blog` | Full | Manually trigger embedding for a blog |
| `update_all_recommendations` | Full | Recompute all recommendations |
| `rerun_failed_embeddings` | Full | Fix missing embeddings in Pinecone |

## Setup

1. **Install dependencies:**
   ```bash
   cd ml-api
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   ```bash
   cp mcp_config.example.env .env
   # Edit .env with your actual passwords
   ```

3. **Get your passwords:**
   - `NEXTJS_PASSWORD` → Check your `BLOG_PASSWORD` env var in Next.js
   - `ML_API_SECRET` → Check your `API_SECRET` env var in ML API (Render)
   - `NEXTJS_URL` → Your Next.js server URL (default: `http://localhost:3000`)
   - `ML_API_URL` → Your ML API URL (default: `http://localhost:8000`)

## Running

### Option 1: STDIO (Local — for Claude Desktop, Cursor)

```bash
python mcp_server.py
```

### Option 2: HTTP (Remote connections / testing with MCP Inspector)

```bash
python mcp_server.py --transport streamable-http --port 8001
```

Then connect to `http://localhost:8001/mcp` from the MCP Inspector or any client.

## Testing with MCP Inspector

The easiest way to test your server:

```bash
# Terminal 1: Start MCP server in HTTP mode
python mcp_server.py --transport streamable-http --port 8001

# Terminal 2: Start MCP Inspector
npx -y @modelcontextprotocol/inspector
```

Then in the Inspector UI, connect to: `http://localhost:8001/mcp`

## Connecting to Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "portfolio-blog": {
      "command": "python",
      "args": ["E:/NEXT JS/portfolio2.0/ml-api/mcp_server.py"],
      "env": {
        "NEXTJS_PASSWORD": "your-password",
        "ML_API_SECRET": "your-secret",
        "NEXTJS_URL": "http://localhost:3000",
        "ML_API_URL": "http://localhost:8000"
      }
    }
  }
}
```

## Connecting to Cursor

Add to your `.cursor/mcp.json` (or workspace settings):

```json
{
  "mcpServers": {
    "portfolio-blog": {
      "command": "python",
      "args": ["E:/NEXT JS/portfolio2.0/ml-api/mcp_server.py"],
      "env": {
        "NEXTJS_PASSWORD": "your-password",
        "ML_API_SECRET": "your-secret",
        "NEXTJS_URL": "http://localhost:3000",
        "ML_API_URL": "http://localhost:8000"
      }
    }
  }
}
```

## Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────┐
│  MCP Client     │────►│  mcp_server.py   │────►│  Next.js    │
│ (Claude/Cursor) │     │  (FastMCP)       │     │  (Port 3000)│
└─────────────────┘     └────────┬─────────┘     └─────────────┘
                                 │
                                 ▼
                        ┌──────────────────┐
                        │   ML API         │
                        │ (Render/FastAPI) │
                        │  - /health       │
                        │  - /search       │
                        │  - /embed-blog   │
                        │  - /stats        │
                        └────────┬─────────┘
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
              ┌──────────┐              ┌──────────┐
              │ Pinecone │              │ MongoDB  │
              │(Vectors) │              │(Blogs+   │
              └──────────┘              │ Recs)    │
                                        └──────────┘
```

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `NEXTJS_PASSWORD not set` warning | Add `NEXTJS_PASSWORD` to your `.env` file |
| `ML_API_SECRET not set` warning | Add `ML_API_SECRET` to your `.env` file |
| Cannot connect to ML API | Make sure the ML API (`main.py`) is running |
| Health check fails | Verify `ML_API_URL` points to the correct server |
| Search returns no results | Some blogs may not have embeddings yet. Run `rerun_failed_embeddings` |
