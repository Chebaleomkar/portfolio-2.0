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

        console.log('PATCH request for slug:', slug)
        console.log('Query params:', Object.fromEntries(searchParams.entries()))

        // Get password from query, header, or body
        const password = searchParams.get('password') || request.headers.get('password')

        console.log('Password provided:', password ? 'yes' : 'no')
        console.log('Expected password:', process.env.BLOG_PASSWORD ? 'set' : 'not set')

        // Validate password
        if (!password || password !== process.env.BLOG_PASSWORD) {
            console.log('Password mismatch!')
            return NextResponse.json(
                { success: false, error: 'Unauthorized - Invalid password' },
                { status: 401 }
            )
        }

        await connectDB()

        // Find the blog
        const blog = await Blog.findOne({ slug })
        console.log('Blog found:', blog ? blog.title : 'NOT FOUND')

        if (!blog) {
            return NextResponse.json(
                { success: false, error: `Blog not found with slug: ${slug}` },
                { status: 404 }
            )
        }

        // Build updates object
        const updates: Record<string, unknown> = {}

        // Handle isStarred
        const isStarred = searchParams.get('isStarred')
        if (isStarred !== null) {
            updates.isStarred = isStarred === 'true'
            console.log('Setting isStarred to:', updates.isStarred)
        }

        // Handle published
        const published = searchParams.get('published')
        if (published !== null) {
            updates.published = published === 'true'
            console.log('Setting published to:', updates.published)
        }

        // If no valid updates provided
        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { success: false, error: 'No valid updates provided. Use isStarred=true/false or published=true/false' },
                { status: 400 }
            )
        }

        // Automatically set updatedAt
        updates.updatedAt = new Date()

        console.log('Updating blog with:', updates)

        // Update the blog
        const updatedBlog = await Blog.findOneAndUpdate(
            { slug },
            { $set: updates },
            { new: true }
        )

        if (!updatedBlog) {
            return NextResponse.json(
                { success: false, error: 'Failed to update blog' },
                { status: 500 }
            )
        }

        console.log('Blog updated successfully:', updatedBlog.isStarred)

        return NextResponse.json({
            success: true,
            message: `Blog "${updatedBlog.title}" updated successfully`,
            updates: {
                isStarred: updates.isStarred,
                published: updates.published,
            },
            blog: {
                slug: updatedBlog.slug,
                title: updatedBlog.title,
                isStarred: updatedBlog.isStarred,
                published: updatedBlog.published,
                updatedAt: updatedBlog.updatedAt,
            }
        })
    } catch (error) {
        console.error('Error updating blog:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update blog', details: String(error) },
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
        const { searchParams } = new URL(request.url)

        // Check if this is an admin request (with password)
        const password = searchParams.get('password')
        const isAdmin = password === process.env.BLOG_PASSWORD

        await connectDB()

        // If admin, show all blogs including unpublished
        const query = isAdmin ? { slug } : { slug, published: true }
        const blog = await Blog.findOne(query).lean()

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
