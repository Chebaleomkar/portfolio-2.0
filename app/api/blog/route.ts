import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

const BLOG_PASSWORD = process.env.BLOG_PASSWORD

/**
 * GET /api/blog - Get all published blog posts
 */
export async function GET() {
    try {
        await connectDB()

        const posts = await Blog.find({ published: true })
            .sort({ createdAt: -1 })
            .select('-__v')
            .lean()

        return NextResponse.json({ success: true, posts })
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
 *   external?: string (external link if any)
 */
export async function POST(request: NextRequest) {
    try {
        // Check password authentication
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

        // Parse request body
        const body = await request.json()
        const { title, body: content, description, tags, external } = body

        // Validate required fields
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

        // Connect to database
        await connectDB()

        // Generate slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        // Check if slug already exists
        const existingPost = await Blog.findOne({ slug })
        if (existingPost) {
            return NextResponse.json(
                { success: false, error: 'A post with this title already exists' },
                { status: 409 }
            )
        }

        // Create the blog post
        const newPost = await Blog.create({
            title,
            slug,
            description: description || '',
            content,
            tags: tags || [],
            external: external || null,
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
