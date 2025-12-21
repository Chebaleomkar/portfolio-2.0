import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://omkarchebale.vercel.app'

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/_next/'],
            },
            // Allow AI crawlers specifically
            {
                userAgent: 'GPTBot',
                allow: '/',
            },
            {
                userAgent: 'ChatGPT-User',
                allow: '/',
            },
            {
                userAgent: 'Google-Extended',
                allow: '/',
            },
            {
                userAgent: 'PerplexityBot',
                allow: '/',
            },
            {
                userAgent: 'Amazonbot',
                allow: '/',
            },
            {
                userAgent: 'ClaudeBot',
                allow: '/',
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
