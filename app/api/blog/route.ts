import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

const BLOG_PASSWORD = process.env.BLOG_PASSWORD
const POSTS_PER_PAGE = 20

/**
 * GET /api/blog - Get paginated blog posts with optional search
 * 
 * Query params:
 *   page?: number (default: 1)
 *   search?: string (search in title, description, content)
 *   starred?: boolean (filter starred posts only)
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
        const search = searchParams.get('search')?.trim() || ''
        const starredOnly = searchParams.get('starred') === 'true'

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

        // Get total count for pagination
        const totalPosts = await Blog.countDocuments(query)
        const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE)

        // Get paginated posts (by date)
        const posts = await Blog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * POSTS_PER_PAGE)
            .limit(POSTS_PER_PAGE)
            .select('-__v -content')
            .lean()

        const formattedPosts = posts.map((post) => ({
            _id: post._id.toString(),
            slug: post.slug,
            title: post.title,
            description: post.description,
            tags: post.tags,
            external: post.external || undefined,
            isStarred: post.isStarred,
            createdAt: post.createdAt.toISOString().split('T')[0],
        }))

        // Get starred/curated posts only on first page and when not searching
        let curatedPosts: typeof formattedPosts = []
        if (page === 1 && !search && !starredOnly) {
            const starred = await Blog.find({ published: true, isStarred: true })
                .sort({ createdAt: -1 })
                .limit(5)
                .select('-__v -content')
                .lean()

            curatedPosts = starred.map((post) => ({
                _id: post._id.toString(),
                slug: post.slug,
                title: post.title,
                description: post.description,
                tags: post.tags,
                external: post.external || undefined,
                isStarred: post.isStarred,
                createdAt: post.createdAt.toISOString().split('T')[0],
            }))
        }

        return NextResponse.json({
            success: true,
            posts: formattedPosts,
            curatedPosts,
            pagination: {
                currentPage: page,
                totalPages,
                totalPosts,
                postsPerPage: POSTS_PER_PAGE,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        })
    } catch (error) {
        console.error('Error fetching posts:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch posts' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/blog - Create a new blog post
 * 
 * Headers:
 *   password: string (must match BLOG_PASSWORD env variable)
 * 
 * Body:
 *   title: string (required)
 *   body: string (markdown content, required)
 *   description?: string
 *   tags?: string[]
 *   external?: string
 *   isStarred?: boolean
 */
export async function POST(request: NextRequest) {
    try {
        const password = request.headers.get('password')

        if (!BLOG_PASSWORD) {
            return NextResponse.json(
                { success: false, error: 'Blog password not configured on server' },
                { status: 500 }
            )
        }

        if (!password || password !== BLOG_PASSWORD) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized: Invalid password' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const { title, body: content, description, tags, external, isStarred } = body

        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Title is required' },
                { status: 400 }
            )
        }

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Body is required (markdown format)' },
                { status: 400 }
            )
        }

        await connectDB()

        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        const existingPost = await Blog.findOne({ slug })
        if (existingPost) {
            return NextResponse.json(
                { success: false, error: 'A post with this title already exists' },
                { status: 409 }
            )
        }

        const newPost = await Blog.create({
            title,
            slug,
            description: description || '',
            content,
            tags: tags || [],
            external: external || null,
            isStarred: isStarred || false,
            published: true,
        })

        return NextResponse.json(
            {
                success: true,
                message: 'Blog post created successfully',
                slug: newPost.slug,
                id: newPost._id,
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error creating blog post:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create blog post' },
            { status: 500 }
        )
    }
}
