import { connectDB } from '@/lib/mongodb'
import Blog, { IBlog } from '@/models/Blog'

export interface BlogPost {
    _id: string
    slug: string
    title: string
    description: string
    content: string
    tags: string[]
    external?: string
    createdAt: string
}

/**
 * Get all published blog posts
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
    await connectDB()

    const posts = await Blog.find({ published: true })
        .sort({ createdAt: -1 })
        .select('-__v')
        .lean()

    return posts.map((post) => ({
        _id: post._id.toString(),
        slug: post.slug,
        title: post.title,
        description: post.description,
        content: post.content,
        tags: post.tags,
        external: post.external || undefined,
        createdAt: post.createdAt.toISOString().split('T')[0],
    }))
}

/**
 * Get a single blog post by slug
 */
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
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
        createdAt: post.createdAt.toISOString().split('T')[0],
    }
}
