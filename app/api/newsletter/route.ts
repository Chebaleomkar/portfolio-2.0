import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { email, name, topics } = body

        // Validate email
        if (!email || typeof email !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Email is required' },
                { status: 400 }
            )
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { success: false, error: 'Please enter a valid email address' },
                { status: 400 }
            )
        }

        await connectDB()

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() })

        if (existingSubscriber) {
            // If inactive, reactivate
            if (!existingSubscriber.isActive) {
                existingSubscriber.isActive = true
                existingSubscriber.topics = topics || existingSubscriber.topics
                existingSubscriber.name = name || existingSubscriber.name
                await existingSubscriber.save()

                return NextResponse.json({
                    success: true,
                    message: 'Welcome back! Your subscription has been reactivated.',
                })
            }

            return NextResponse.json(
                { success: false, error: 'You\'re already subscribed! Check your inbox for curated blogs.' },
                { status: 400 }
            )
        }

        // Create new subscriber
        await Subscriber.create({
            email: email.toLowerCase().trim(),
            name: name?.trim() || '',
            topics: Array.isArray(topics) ? topics : [],
            isActive: true,
        })

        return NextResponse.json({
            success: true,
            message: 'You\'re in! Expect curated blogs that match your interests.',
        })
    } catch (error) {
        console.error('Newsletter subscription error:', error)
        return NextResponse.json(
            { success: false, error: 'Something went wrong. Please try again.' },
            { status: 500 }
        )
    }
}

// Get subscriber count (optional, for showing social proof)
export async function GET() {
    try {
        await connectDB()
        const count = await Subscriber.countDocuments({ isActive: true })

        return NextResponse.json({
            success: true,
            count,
        })
    } catch (error) {
        console.error('Error fetching subscriber count:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch count' },
            { status: 500 }
        )
    }
}
