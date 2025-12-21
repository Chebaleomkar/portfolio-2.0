import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscriber extends Document {
    email: string
    name?: string
    topics: string[]
    subscribedAt: Date
    isActive: boolean
}

const SubscriberSchema = new Schema<ISubscriber>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
            default: '',
        },
        topics: {
            type: [String],
            default: [],
        },
        subscribedAt: {
            type: Date,
            default: Date.now,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
)

// Index for faster queries
SubscriberSchema.index({ email: 1 })
SubscriberSchema.index({ topics: 1 })
SubscriberSchema.index({ isActive: 1, topics: 1 })

export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema)
