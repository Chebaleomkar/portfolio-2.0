import { NextRequest, NextResponse } from 'next/server'
import { createBlogPost, getAllBlogPosts } from '@/lib/blog'

const BLOG_PASSWORD = process.env.BLOG_PASSWORD

/**
 * GET /api/blog - Get all blog posts
 */
export async function GET() {
    try {
        const posts = getAllBlogPosts()
        return NextResponse.json({ success: true, posts })
    } catch (error) {
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
        const { title, body: content, description, tags } = body

        // Validate required fields
        if (!title || typeof title !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Title is required and must be a string' },
                { status: 400 }
            )
        }

        if (!content || typeof content !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Body is required and must be a string (markdown format)' },
                { status: 400 }
            )
        }

        // Create the blog post
        const result = createBlogPost(title, content, {
            description,
            tags,
        })

        if (!result.success) {
            return NextResponse.json(
                { success: false, error: result.error },
                { status: 500 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: 'Blog post created successfully',
                slug: result.slug,
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
