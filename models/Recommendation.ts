import mongoose, { Schema, Document, Model } from 'mongoose'

// Interface for individual recommendation item
export interface IRecommendationItem {
    slug: string
    title: string
    description: string
    score: number
}

// Interface for the recommendation document
export interface IRecommendation extends Document {
    blogSlug: string
    recommendations: IRecommendationItem[]
    createdAt: Date
    updatedAt: Date
}

// Schema for recommendation items (embedded)
const RecommendationItemSchema = new Schema<IRecommendationItem>(
    {
        slug: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 1,
        },
    },
    { _id: false }
)

// Main recommendation schema
const RecommendationSchema = new Schema<IRecommendation>(
    {
        blogSlug: {
            type: String,
            required: [true, 'Blog slug is required'],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        recommendations: {
            type: [RecommendationItemSchema],
            default: [],
            validate: {
                validator: function (v: IRecommendationItem[]) {
                    return v.length <= 10 // Max 10 recommendations per blog
                },
                message: 'A blog can have at most 10 recommendations',
            },
        },
    },
    {
        timestamps: true,
    }
)

// Add index for faster lookups
RecommendationSchema.index({ blogSlug: 1 })

// Prevent model recompilation in development
const Recommendation: Model<IRecommendation> =
    mongoose.models.Recommendation || mongoose.model<IRecommendation>('Recommendation', RecommendationSchema)

export default Recommendation
