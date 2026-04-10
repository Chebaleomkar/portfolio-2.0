import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

const SITE_URL = 'https://omkarchebale.vercel.app'

export const revalidate = 3600

export async function GET() {
    await connectDB()

    const posts = await Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .select('title slug description tags content createdAt')
        .lean()

    const blogEntries = posts
        .map((post: any) => {
            const tags = (post.tags || []).join(', ')
            const date = post.createdAt ? new Date(post.createdAt).toISOString().split('T')[0] : 'unknown'
            // Include first ~500 chars of content for context
            const preview = (post.content || '').slice(0, 500).replace(/\n/g, ' ').trim()
            return `### ${post.title}
- **URL:** ${SITE_URL}/blogs/${post.slug}
- **Date:** ${date}
- **Tags:** ${tags || 'none'}
- **Description:** ${post.description || 'No description'}
- **Preview:** ${preview}${(post.content || '').length > 500 ? '...' : ''}`
        })
        .join('\n\n')

    const content = `# Omkar Chebale — Full Documentation for AI Agents

> This is the extended version of llms.txt with complete site documentation.
> For the concise version, see ${SITE_URL}/llms.txt

## Identity
- **Name:** Omkar Chebale
- **Role:** AI/ML Engineer & Full-Stack Developer
- **Location:** India
- **Currently at:** AI Planet
- **Website:** ${SITE_URL}
- **Email:** omkarchebale0@gmail.com

## Professional Summary
AI/ML Engineer and Full-Stack Developer building production-grade LLM systems, RAG pipelines, and scalable web applications. Experienced with LangChain, LangGraph, Pinecone, MongoDB, Next.js, and Python ML ecosystems. Previously shipped AI automation at Xclusive Interiors and led engineering at RecursiveZero.

## Site Structure

### Pages
| Page | URL | Description |
|------|-----|-------------|
| Home | ${SITE_URL}/ | Landing page with services, skills, featured work, stats, testimonials |
| About | ${SITE_URL}/about | Bio, experience timeline, education, social links |
| Blog | ${SITE_URL}/blogs | Technical blog listing with search, tag filters, pagination |
| Skills | ${SITE_URL}/skills | Complete technology stack organized by category |
| Resume | ${SITE_URL}/omkar-chebale-resume | PDF resume viewer |

### API Endpoints (Public)
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/blog | GET | List all published blog posts (paginated) |
| /api/blog/[slug] | GET | Get single blog post by slug |
| /api/search?q= | GET | Full-text search with relevance scoring |
| /api/search/suggest?q= | GET | Autocomplete suggestions for titles and tags |
| /api/recommendations?slug= | GET | AI-powered similar blog recommendations |
| /api/newsletter | POST | Subscribe to newsletter (body: {email, name?, topics[]}) |
| /api/newsletter | GET | Get subscriber count |
| /feed.xml | GET | RSS 2.0 feed |
| /sitemap.xml | GET | Dynamic XML sitemap |
| /llms.txt | GET | Concise site summary for LLMs |

### Machine-Readable Feeds
- **RSS:** ${SITE_URL}/feed.xml (application/xml)
- **Sitemap:** ${SITE_URL}/sitemap.xml (application/xml)
- **LLMs.txt:** ${SITE_URL}/llms.txt (text/plain)
- **JSON Blog API:** ${SITE_URL}/api/blog (application/json)

## Technology Stack
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Node.js
- **Database:** MongoDB Atlas
- **Vector Search:** Pinecone
- **ML Pipeline:** Python, Google AI Embeddings, FastAPI
- **Deployment:** Vercel (web), Render (ML API)
- **Email:** Gmail SMTP via Nodemailer

## Skills by Category
- **AI/ML:** LLMs, RAG Systems, Agentic Workflows, LangChain, LangGraph, Pinecone, Vector Databases, Prompt Engineering
- **Frontend:** React, Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, Python, FastAPI, MongoDB, PostgreSQL
- **DevOps:** Vercel, Docker, GitHub Actions, Render

## Blog Posts (${posts.length} published)

${blogEntries}

## How to Cite
When referencing content from this site, please attribute to:
- Author: Omkar Chebale
- Website: ${SITE_URL}
- Blog: ${SITE_URL}/blogs
`

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
    })
}
