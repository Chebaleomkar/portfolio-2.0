import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface Recommendation {
    slug: string
    title: string
    description: string
    score: number
}

interface RecommendationsData {
    generated_at: string
    total_blogs: number
    pinecone_index: string
    recommendations: Record<string, Recommendation[]>
}

// GET /api/recommendations/[slug] - Get blog recommendations
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        // Read recommendations from the JSON file
        const dataPath = path.join(process.cwd(), 'ml', 'data', 'recommendations.json')

        // Check if file exists
        if (!fs.existsSync(dataPath)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Recommendations not generated yet. Run the training pipeline first.',
                    recommendations: []
                },
                { status: 404 }
            )
        }

        // Read and parse the JSON file
        const fileContent = fs.readFileSync(dataPath, 'utf-8')
        const data: RecommendationsData = JSON.parse(fileContent)

        // Get recommendations for the specific slug
        const recommendations = data.recommendations[slug] || []

        // Return success response
        return NextResponse.json({
            success: true,
            slug,
            recommendations,
            generated_at: data.generated_at,
            total_blogs: data.total_blogs
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
