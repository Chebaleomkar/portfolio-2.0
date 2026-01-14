import { connectDB } from '@/lib/mongodb'
import { sendWelcomeEmail, sendWelcomeBackEmail, sendNewSubscriberNotification, calculateDashboardStats } from '@/lib/email'
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

        const subscriberEmail = email.toLowerCase().trim()
        const subscriberName = name?.trim() || ''
        const subscriberTopics = Array.isArray(topics) ? topics : []

        // Check if already subscribed
        const existingSubscriber = await Subscriber.findOne({ email: subscriberEmail })

        if (existingSubscriber) {
            // If inactive, reactivate
            if (!existingSubscriber.isActive) {
                existingSubscriber.isActive = true
                existingSubscriber.topics = subscriberTopics.length > 0 ? subscriberTopics : existingSubscriber.topics
                existingSubscriber.name = subscriberName || existingSubscriber.name
                await existingSubscriber.save()

                // Send welcome back email
                try {
                    await sendWelcomeBackEmail({
                        email: subscriberEmail,
                        name: existingSubscriber.name,
                        topics: existingSubscriber.topics,
                    })
                } catch (emailError) {
                    console.error('Failed to send welcome back email:', emailError)
                    // Don't fail the subscription if email fails
                }

                // Send admin notification for reactivation
                try {
                    const stats = await calculateDashboardStats(Subscriber)
                    await sendNewSubscriberNotification({
                        newSubscriber: {
                            email: subscriberEmail,
                            name: existingSubscriber.name,
                            topics: existingSubscriber.topics,
                        },
                        stats,
                        isReactivation: true,
                    })
                } catch (notificationError) {
                    console.error('Failed to send admin notification:', notificationError)
                    // Don't fail if admin notification fails
                }

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
            email: subscriberEmail,
            name: subscriberName,
            topics: subscriberTopics,
            isActive: true,
        })

        // Send welcome email
        try {
            await sendWelcomeEmail({
                email: subscriberEmail,
                name: subscriberName,
                topics: subscriberTopics,
            })
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError)
            // Don't fail the subscription if email fails
        }

        // Send admin notification for new subscription
        try {
            const stats = await calculateDashboardStats(Subscriber)
            await sendNewSubscriberNotification({
                newSubscriber: {
                    email: subscriberEmail,
                    name: subscriberName,
                    topics: subscriberTopics,
                },
                stats,
                isReactivation: false,
            })
        } catch (notificationError) {
            console.error('Failed to send admin notification:', notificationError)
            // Don't fail if admin notification fails
        }

        return NextResponse.json({
            success: true,
            message: 'You\'re in! Check your inbox for a welcome message.',
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
