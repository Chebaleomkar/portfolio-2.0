import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { cache } from 'react'
import type { BlogPost, PaginationInfo } from '@/types/blog'

const POSTS_PER_PAGE = 20

export interface BlogListResult {
    posts: BlogPost[]
    curatedPosts: BlogPost[]
    pagination: PaginationInfo
}

/**
 * Get paginated blog posts with optional search
 * Cached using React's cache() for request deduplication
 */
export const getBlogPosts = cache(async (
    page: number = 1,
    search: string = '',
    starredOnly: boolean = false
): Promise<BlogListResult> => {
    await connectDB()

    // Build query
    const query: Record<string, unknown> = { published: true }

    // Add search filter
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { tags: { $in: [new RegExp(search, 'i')] } },
        ]
    }

    // Add starred filter
    if (starredOnly) {
        query.isStarred = true
    }

    // Run all queries in parallel for better performance
    const [totalPosts, posts, starredPosts] = await Promise.all([
        // Count query
        Blog.countDocuments(query),
        // Main posts query
        Blog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * POSTS_PER_PAGE)
            .limit(POSTS_PER_PAGE)
            .select('-__v -content')
            .lean(),
        // Curated posts query (only on first page, no search)
        page === 1 && !search && !starredOnly
            ? Blog.find({ published: true, isStarred: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('-__v -content')
                .lean()
            : Promise.resolve([])
    ])

    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

    const formatPost = (post: any): BlogPost => ({
        _id: post._id.toString(),
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        external: post.external || undefined,
        isStarred: post.isStarred,
        createdAt: post.createdAt.toISOString().split('T')[0],
    })

    return {
        posts: posts.map(formatPost),
        curatedPosts: starredPosts.map(formatPost),
        pagination: {
            currentPage: page,
            totalPages,
            totalPosts,
            postsPerPage: POSTS_PER_PAGE,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
        },
    }
})

/**
 * Get curated posts only - useful for sidebar
 */
export const getCuratedPosts = cache(async (): Promise<BlogPost[]> => {
    await connectDB()

    const posts = await Blog.find({ published: true, isStarred: true })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('-__v -content')
        .lean()

    return posts.map((post: any) => ({
        _id: post._id.toString(),
        slug: post.slug,
        title: post.title,
        description: post.description,
        tags: post.tags,
        external: post.external || undefined,
        isStarred: post.isStarred,
        createdAt: post.createdAt.toISOString().split('T')[0],
    }))
})
