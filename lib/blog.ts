import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

export interface BlogPostDetail {
    _id: string
    slug: string
    title: string
    description: string
    content: string
    tags: string[]
    external?: string
    isStarred: boolean
    createdAt: string
}

/**
 * Get a single blog post by slug (includes content)
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostDetail | null> {
    await connectDB()

    const post = await Blog.findOne({ slug, published: true })
        .select('-__v')
        .lean()

    if (!post) return null

    return {
        _id: post._id.toString(),
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: post.content,
        tags: post.tags,
        external: post.external || undefined,
        isStarred: post.isStarred,
        createdAt: post.createdAt.toISOString().split('T')[0],
    }
}
