import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IBlog extends Document {
    title: string
    slug: string
    description: string
    content: string
    tags: string[]
    external?: string
    published: boolean
    createdAt: Date
    updatedAt: Date
}

const BlogSchema = new Schema<IBlog>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            default: '',
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
        },
        tags: {
            type: [String],
            default: [],
        },
        external: {
            type: String,
            default: null,
        },
        published: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

// Generate slug from title before saving
BlogSchema.pre('save', function (next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
    }
    next()
})

// Prevent model recompilation in development
const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema)

export default Blog
