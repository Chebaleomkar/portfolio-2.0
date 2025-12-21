import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://omkarchebale.vercel.app'

    // Static pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/work`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/skills`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
    ]

    // Dynamic blog pages
    try {
        await connectDB()
        const posts = await Blog.find({ published: true })
            .select('slug updatedAt createdAt')
            .lean()

        const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
            url: `${baseUrl}/work/${post.slug}`,
            lastModified: post.updatedAt || post.createdAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))

        return [...staticPages, ...blogPages]
    } catch (error) {
        console.error('Error generating sitemap:', error)
        return staticPages
    }
}
