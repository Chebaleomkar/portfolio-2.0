import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

const SITE_URL = 'https://omkarchebale.vercel.app'

export const revalidate = 3600 // revalidate every hour

export async function GET() {
    await connectDB()

    const posts = await Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .select('title slug description tags createdAt')
        .lean()

    const items = posts
        .map((post: any) => {
            const pubDate = new Date(post.createdAt).toUTCString()
            const categories = (post.tags || [])
                .map((tag: string) => `        <category>${escapeXml(tag)}</category>`)
                .join('\n')

            return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/blogs/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/blogs/${post.slug}</guid>
      <description>${escapeXml(post.description || '')}</description>
      <pubDate>${pubDate}</pubDate>
${categories}
    </item>`
        })
        .join('\n')

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Omkar Chebale - Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Thoughts on AI, ML, and software engineering. What I build, break, and learn.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${SITE_URL}/profile.jpg</url>
      <title>Omkar Chebale - Blog</title>
      <link>${SITE_URL}</link>
    </image>
${items}
  </channel>
</rss>`

    return new Response(rss, {
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=600',
        },
    })
}

function escapeXml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;')
}
