import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'
import { NextRequest, NextResponse } from 'next/server'

// PATCH /api/blog/[slug] - Update blog properties
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const { searchParams } = new URL(request.url)

        // Get password from query or body
        const password = searchParams.get('password') || request.headers.get('password')

        // Validate password
        if (password !== process.env.BLOG_PASSWORD) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        await connectDB()

        // Find the blog
        const blog = await Blog.findOne({ slug })
        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Blog not found' },
                { status: 404 }
            )
        }

        // Only allow isStarred and published fields to be updated
        const updates: Record<string, unknown> = {}

        // Handle isStarred
        const isStarred = searchParams.get('isStarred')
        if (isStarred !== null) {
            updates.isStarred = isStarred === 'true'
        }

        // Handle published
        const published = searchParams.get('published')
        if (published !== null) {
            updates.published = published === 'true'
        }

        // If no valid updates provided
        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, error: 'No valid updates provided. Only isStarred and published can be updated.' },
                { status: 400 }
            )
        }

        // Automatically set updatedAt
        updates.updatedAt = new Date()

        // Update the blog
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug },
            { $set: updates },
            { new: true }
        )

        if (!updatedBlog) {
            return NextResponse.json(
                { success: false, error: 'Blog not found after update' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: `Blog updated successfully`,
            blog: {
                slug: updatedBlog.slug,
                isStarred: updatedBlog.isStarred,
                published: updatedBlog.published,
                updatedAt: updatedBlog.updatedAt,
            }
        })
    } catch (error) {
        console.error('Error updating blog:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update blog' },
            { status: 500 }
        )
    }
}

// GET /api/blog/[slug] - Get single blog by slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        await connectDB()
        const blog = await Blog.findOne({ slug, published: true }).lean()

        if (!blog) {
            return NextResponse.json(
                { success: false, error: 'Blog not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            blog,
        })
    } catch (error) {
        console.error('Error fetching blog:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch blog' },
            { status: 500 }
        )
    }
}
