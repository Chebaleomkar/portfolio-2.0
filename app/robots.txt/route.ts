const BASE_URL = 'https://omkarchebale.vercel.app'

export function GET() {
    const body = `# Standard crawlers
User-Agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

# AI Crawlers — explicitly allowed
User-Agent: GPTBot
Allow: /

User-Agent: ChatGPT-User
Allow: /

User-Agent: Google-Extended
Allow: /

User-Agent: PerplexityBot
Allow: /

User-Agent: Amazonbot
Allow: /

User-Agent: ClaudeBot
Allow: /

User-Agent: Applebot-Extended
Allow: /

User-Agent: cohere-ai
Allow: /

User-Agent: anthropic-ai
Allow: /

User-Agent: Meta-ExternalAgent
Allow: /

# Sitemaps & Feeds
Sitemap: ${BASE_URL}/sitemap.xml

# LLM-specific discovery (llms.txt standard)
# See https://llmstxt.org for specification
# llms.txt: ${BASE_URL}/llms.txt
# llms-full.txt: ${BASE_URL}/llms-full.txt
`

    return new Response(body, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
        },
    })
}
