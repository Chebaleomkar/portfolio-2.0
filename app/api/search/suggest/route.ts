import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Blog from '@/models/Blog'

/**
 * GET /api/search/suggest - Autocomplete suggestions
 *
 * Query params:
 *   q: string - Partial query for autocomplete (min 1 char)
 *
 * Returns matching blog titles and tags for typeahead
 */
export async function GET(request: NextRequest) {
    try {
        await connectDB()

        const { searchParams } = new URL(request.url)
        const query = searchParams.get('q')?.trim() || ''

        // Return all tags when no query (for filter chips)
        if (!query) {
            const allTags = await Blog.aggregate([
                { $match: { published: true } },
                { $unwind: '$tags' },
                { $group: { _id: '$tags', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 30 },
            ])

            return NextResponse.json({
                success: true,
                titles: [],
                tags: allTags.map((t: any) => ({ name: t._id, count: t.count })),
            })
        }

        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const regex = new RegExp(escaped, 'i')

        const [matchingPosts, allTags] = await Promise.all([
            Blog.find({ published: true, title: regex })
                .sort({ isStarred: -1, createdAt: -1 })
                .limit(6)
                .select('title slug tags isStarred')
                .lean(),
            Blog.aggregate([
                { $match: { published: true } },
                { $unwind: '$tags' },
                { $group: { _id: '$tags', count: { $sum: 1 } } },
                { $sort: { count: -1 } },
            ]),
        ])

        const matchingTags = allTags
            .filter((t: any) => regex.test(t._id))
            .slice(0, 8)
            .map((t: any) => ({ name: t._id, count: t.count }))

        const response = NextResponse.json({
            success: true,
            titles: matchingPosts.map((p: any) => ({
                title: p.title,
                slug: p.slug,
                isStarred: p.isStarred,
                tags: p.tags?.slice(0, 2) || [],
            })),
            tags: matchingTags,
        })

        response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30')

        return response
    } catch (error) {
        console.error('Suggestions error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to get suggestions' },
            { status: 500 }
        )
    }
}
