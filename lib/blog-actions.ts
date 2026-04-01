import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { cache } from 'react'
import type { BlogPost, PaginationInfo, SearchSortBy } from '@/types/blog'

const POSTS_PER_PAGE = 20

export interface BlogListResult {
    posts: BlogPost[]
    curatedPosts: BlogPost[]
    pagination: PaginationInfo
    availableTags: string[]
}

/**
 * Get paginated blog posts with optional search, tag filter, and sort
 * Cached using React's cache() for request deduplication
 */
export const getBlogPosts = cache(async (
    page: number = 1,
    search: string = '',
    starredOnly: boolean = false,
    tags: string[] = [],
    sortBy: SearchSortBy = 'newest'
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

    // Add tag filter
    if (tags.length > 0) {
        const escapedTags = tags.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        if (query.$or) {
            // Combine search and tags with $and
            const searchOr = query.$or
            delete query.$or
            query.$and = [
                { $or: searchOr as any[] },
                { tags: { $in: escapedTags.map(t => new RegExp(`^${t}$`, 'i')) } },
            ]
        } else {
            query.tags = { $in: escapedTags.map(t => new RegExp(`^${t}$`, 'i')) }
        }
    }

    // Add starred filter
    if (starredOnly) {
        query.isStarred = true
    }

    // Determine sort
    const sortOption: any = sortBy === 'oldest' ? { createdAt: 1 } : { createdAt: -1 }

    // Run all queries in parallel for better performance
    const [totalPosts, posts, starredPosts, allTags] = await Promise.all([
        // Count query
        Blog.countDocuments(query),
        // Main posts query
        Blog.find(query)
            .sort(sortOption)
            .skip((page - 1) * POSTS_PER_PAGE)
            .limit(POSTS_PER_PAGE)
            .select('-__v -content')
            .lean(),
        // Curated posts query (only on first page, no search/filter)
        page === 1 && !search && !starredOnly && tags.length === 0
            ? Blog.find({ published: true, isStarred: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('-__v -content')
                .lean()
            : Promise.resolve([]),
        // Get all available tags with counts
        Blog.aggregate([
            { $match: { published: true } },
            { $unwind: '$tags' },
            { $group: { _id: '$tags', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 30 },
        ]),
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
        availableTags: allTags.map((t: any) => t._id),
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
