/**
 * Seed Script: Insert blog recommendations into MongoDB
 * 
 * Usage: node --env-file=.env --import=tsx scripts/seed-recommendations.ts
 * Or:    set MONGODB_URI=your_uri && npx tsx scripts/seed-recommendations.ts
 */

import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'

// Try to load dotenv if available, otherwise use environment variables directly
try {
    const dotenv = await import('dotenv')
    dotenv.config({ path: path.resolve(process.cwd(), '.env') })
} catch {
    console.log('📝 dotenv not found, using environment variables directly')
}

// Interface for recommendation item
interface RecommendationItem {
    slug: string
    title: string
    description: string
    score: number
}

// Interface for the lookup JSON structure
interface RecommendationsLookup {
    [blogSlug: string]: RecommendationItem[]
}

// Recommendation Schema
const RecommendationItemSchema = new mongoose.Schema(
    {
        slug: { type: String, required: true, trim: true },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        score: { type: Number, required: true, min: 0, max: 1 },
    },
    { _id: false }
)

const RecommendationSchema = new mongoose.Schema(
    {
        blogSlug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        recommendations: {
            type: [RecommendationItemSchema],
            default: [],
        },
    },
    { timestamps: true }
)

const Recommendation = mongoose.models.Recommendation || mongoose.model('Recommendation', RecommendationSchema)

async function seedRecommendations() {
    const MONGODB_URI = process.env.MONGODB_URI

    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI environment variable is not set')
        console.error('   Set it before running: set MONGODB_URI=mongodb://...')
        process.exit(1)
    }

    try {
        // Connect to MongoDB
        console.log('🔗 Connecting to MongoDB...')
        await mongoose.connect(MONGODB_URI)
        console.log('✅ Connected to MongoDB')

        // Read the recommendations lookup JSON
        const jsonPath = path.resolve(process.cwd(), 'ml', 'data', 'recommendations_lookup.json')

        if (!fs.existsSync(jsonPath)) {
            console.error(`❌ File not found: ${jsonPath}`)
            process.exit(1)
        }

        const rawData = fs.readFileSync(jsonPath, 'utf-8')
        const recommendationsLookup: RecommendationsLookup = JSON.parse(rawData)

        console.log(`📖 Found ${Object.keys(recommendationsLookup).length} blog entries in JSON`)

        // Clear existing recommendations
        console.log('🗑️  Clearing existing recommendations...')
        await Recommendation.deleteMany({})

        // Insert new recommendations
        const documents = Object.entries(recommendationsLookup).map(([blogSlug, recommendations]) => ({
            blogSlug,
            recommendations,
        }))

        console.log('📥 Inserting recommendations...')
        const result = await Recommendation.insertMany(documents)

        console.log(`✅ Successfully inserted ${result.length} recommendation documents`)

        // Display summary
        console.log('\n📊 Summary:')
        for (const doc of result) {
            console.log(`   • ${doc.blogSlug}: ${doc.recommendations.length} recommendations`)
        }

    } catch (error) {
        console.error('❌ Error seeding recommendations:', error)
        process.exit(1)
    } finally {
        // Disconnect from MongoDB
        await mongoose.disconnect()
        console.log('\n🔌 Disconnected from MongoDB')
    }
}

// Run the seed function
seedRecommendations()
