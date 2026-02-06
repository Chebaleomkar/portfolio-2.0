import { NextRequest, NextResponse, after } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import Subscriber from '@/models/Subscriber'
import { sendCuratedBlogToAllSubscribers } from '@/lib/email'

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

        // Run all queries in parallel for better performance
        const [totalPosts, posts, starred] = await Promise.all([
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

        const formatPost = (post: any) => ({
            _id: post._id.toString(),
            slug: post.slug,
            title: post.title,
            description: post.description,
            tags: post.tags,
            external: post.external || undefined,
            isStarred: post.isStarred,
            createdAt: post.createdAt.toISOString().split('T')[0],
        })

        const formattedPosts = posts.map(formatPost)
        const curatedPosts = starred.map(formatPost)

        const response = NextResponse.json({
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

        // Add cache headers - Cache for 60s on CDN, 30s stale-while-revalidate
        // Skip cache for search queries to ensure fresh results
        if (!search) {
            response.headers.set(
                'Cache-Control',
                'public, s-maxage=60, stale-while-revalidate=30'
            )
        }

        return response
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

        // Use after() to run background tasks without blocking the response
        after(async () => {
            // 1. Send notifications if starred
            if (isStarred) {
                try {
                    // Fetch all active subscribers
                    const activeSubscribers = await Subscriber.find({ isActive: true })
                        .select('email name')
                        .lean()

                    if (activeSubscribers.length > 0) {
                        // Send curated blog notification to all subscribers
                        const emailResults = await sendCuratedBlogToAllSubscribers({
                            blog: {
                                title: newPost.title,
                                slug: newPost.slug,
                                description: newPost.description,
                                tags: newPost.tags,
                            },
                            subscribers: activeSubscribers.map((s: any) => ({
                                email: s.email,
                                name: s.name,
                            })),
                        })

                        console.log(`Curated blog notifications sent: ${emailResults.sent} successful, ${emailResults.failed} failed`)
                    }
                } catch (emailError) {
                    console.error('Failed to send curated blog notifications:', emailError)
                }
            }

            // 2. Trigger ML API
            const ML_API_URL = process.env.ML_API_URL
            const ML_API_SECRET = process.env.ML_API_SECRET

            if (ML_API_URL && ML_API_SECRET) {
                try {
                    const mlResponse = await fetch(`${ML_API_URL}/embed-blog`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-API-Secret': ML_API_SECRET,
                        },
                        body: JSON.stringify({
                            slug: newPost.slug,
                            title: newPost.title,
                            description: newPost.description || '',
                            content: content,
                            tags: newPost.tags || [],
                            is_starred: newPost.isStarred || false,
                        }),
                    })

                    if (mlResponse.ok) {
                        const mlApiResult = await mlResponse.json()
                        console.log(`ML API: Blog embedded, ${mlApiResult.recommendations_updated} recommendations updated`)
                    } else {
                        console.error('ML API error:', await mlResponse.text())
                    }
                } catch (mlError) {
                    console.error('Failed to call ML API:', mlError)
                }
            } else {
                console.log('ML API not configured, skipping embedding generation')
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: isStarred
                    ? 'Blog post created. Notifications are being sent in the background.'
                    : 'Blog post created successfully',
                slug: newPost.slug,
                id: newPost._id,
                backgroundTasks: {
                    emailNotifications: isStarred ? 'processing' : 'skipped',
                    mlApi: 'processing'
                }
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
