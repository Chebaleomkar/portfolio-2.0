import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Recommendation from '@/models/Recommendation'

// GET /api/recommendations/[slug] - Get blog recommendations from MongoDB
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        await connectDB()

        // Find recommendations for this blog slug
        const doc = await Recommendation.findOne({ blogSlug: slug }).lean()

        if (!doc) {
            // Return empty recommendations if not found
            return NextResponse.json({
                success: true,
                slug,
                recommendations: [],
                message: 'No recommendations found for this blog'
            })
        }

        // Return recommendations
        return NextResponse.json({
            success: true,
            slug,
            recommendations: doc.recommendations,
            updatedAt: doc.updatedAt
        })
    } catch (error) {
        console.error('Error fetching recommendations:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch recommendations',
                recommendations: []
            },
            { status: 500 }
        )
    }
}
