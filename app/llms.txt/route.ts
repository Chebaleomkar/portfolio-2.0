import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

const SITE_URL = 'https://omkarchebale.vercel.app'

export const revalidate = 3600

export async function GET() {
    await connectDB()

    const posts = await Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .select('title slug description tags')
        .lean()

    const blogList = posts
        .map((post: any) => {
            const tags = (post.tags || []).join(', ')
            return `- [${post.title}](${SITE_URL}/blogs/${post.slug}): ${post.description || 'No description'}${tags ? ` (${tags})` : ''}`
        })
        .join('\n')

    const content = `# Omkar Chebale — AI/ML Engineer & Full-Stack Developer

> Personal portfolio and technical blog at ${SITE_URL}

## About
Omkar Chebale is an AI/ML Engineer and Full-Stack Developer building production-grade LLM systems, RAG pipelines, and scalable web applications. Currently at AI Planet.

## Pages
- [Home](${SITE_URL}/): Portfolio landing — services, skills, featured work, testimonials
- [About](${SITE_URL}/about): Bio, experience timeline, education
- [Blog](${SITE_URL}/blogs): Technical blog on AI, ML, and software engineering
- [Skills](${SITE_URL}/skills): Full technology stack

## Blog Posts
${blogList}

## APIs
- [Blog Search](${SITE_URL}/api/search?q=YOUR_QUERY): Full-text search across all blog posts
- [Search Suggestions](${SITE_URL}/api/search/suggest?q=YOUR_QUERY): Autocomplete for titles and tags
- [Blog List](${SITE_URL}/api/blog): JSON list of all published blog posts
- [RSS Feed](${SITE_URL}/feed.xml): RSS 2.0 feed of all blog posts
- [Sitemap](${SITE_URL}/sitemap.xml): XML sitemap of all pages

## Contact
- Email: omkarchebale0@gmail.com
- GitHub: https://github.com/Chebaleomkar
- LinkedIn: https://www.linkedin.com/in/omkar-chebale-8b251726b/
- Twitter: https://twitter.com/chebalerushi

## Topics Covered
AI/ML, LLMs, RAG Systems, Agentic Workflows, LangChain, Next.js, React, Node.js, MongoDB, Python, TypeScript, Full-Stack Development, Software Engineering
`

    return new Response(content, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
    })
}
