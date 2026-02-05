import nodemailer from 'nodemailer'

// Create reusable transporter
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        family: 4, // Force IPv4 for stable connection on local networks
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    } as any) // Type cast as any because service: 'gmail' types are strict in some versions
}

interface WelcomeEmailParams {
    email: string
    name?: string
    topics: string[]
}

export async function sendWelcomeEmail({ email, name, topics }: WelcomeEmailParams) {
    const transporter = getTransporter()

    const firstName = name?.split(' ')[0] || 'there'
    const topicsHtml = topics.length > 0
        ? `<div style="margin-top: 24px; padding: 16px; background: #f8f9fa; border-radius: 8px;">
             <p style="margin: 0 0 12px 0; font-size: 13px; color: #666; text-transform: uppercase; letter-spacing: 0.5px;">Your Interests</p>
             <div style="display: flex; flex-wrap: wrap; gap: 8px;">
               ${topics.map(t => `<span style="display: inline-block; padding: 6px 12px; background: #e8f5e9; color: #2e7d32; border-radius: 20px; font-size: 13px; font-weight: 500;">${t}</span>`).join('')}
             </div>
           </div>`
        : ''

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: #f5f5f5; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 24px 32px 32px 32px;">
                            <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #1a1a1a;">
                                Hey ${firstName} 👋!
                            </h1>
                            
                            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #444;">
                                Thank you for subscribing — it genuinely means a lot to me.
                            </p>
                            
                            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #444;">
                                I'm Omkar, and I write about the things I'm building, breaking, and figuring out along the way. 
                                Whether it's AI experiments, backend deep-dives, or just lessons from shipping real projects — 
                                I try to keep it honest and useful.
                            </p>
                            
                            <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #444;">
                                I won't flood your inbox. Only the good stuff, when there's something worth sharing.
                            </p>
                            
                            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #444;">
                                If you ever want to reply to any email, just hit reply — I read every one of them.
                            </p>
                            
                            ${topicsHtml}
                            
                            <!-- Sign off -->
                            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #eee;">
                                <p style="margin: 0 0 4px 0; font-size: 15px; color: #444;">
                                    Talk soon,
                                </p>
                                <p style="margin: 0; font-size: 15px; font-weight: 600; color: #1a1a1a;">
                                    Omkar
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 20px 32px; background: #fafafa; border-top: 1px solid #eee;">
                            <p style="margin: 0; font-size: 12px; color: #888; text-align: center;">
                                <a href="https://omkarchebale.vercel.app" style="color: #10b981; text-decoration: none;">omkarchebale.vercel.app</a>
                                &nbsp;•&nbsp;
                                <a href="https://github.com/Chebaleomkar" style="color: #888; text-decoration: none;">GitHub</a>
                                &nbsp;•&nbsp;
                                <a href="https://twitter.com/chebalerushi" style="color: #888; text-decoration: none;">Twitter</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

    const textContent = `
Hey ${firstName}!

Thank you for subscribing — it genuinely means a lot to me.

I'm Omkar, and I write about the things I'm building, breaking, and figuring out along the way. Whether it's AI experiments, backend deep-dives, or just lessons from shipping real projects — I try to keep it honest and useful.

I won't flood your inbox. Only the good stuff, when there's something worth sharing.

If you ever want to reply to any email, just hit reply — I read every one of them.

${topics.length > 0 ? `Your Interests: ${topics.join(', ')}` : ''}

Talk soon,
Omkar

---
https://omkarchebale.vercel.app
`

    const mailOptions = {
        from: `"Omkar Chebale" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "You're in! 🎉",
        text: textContent,
        html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
}

// Welcome back email for reactivated subscribers
export async function sendWelcomeBackEmail({ email, name, topics }: WelcomeEmailParams) {
    const transporter = getTransporter()
    const firstName = name?.split(' ')[0] || 'there'

    const topicsHtml = topics.length > 0
        ? `<div style="margin-top: 20px; padding: 12px; background: #f0f9ff; border-radius: 8px;">
             <p style="margin: 0; font-size: 13px; color: #666;">Updated interests: ${topics.map(t => `<strong>${t}</strong>`).join(', ')}</p>
           </div>`
        : ''

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; margin: 0; padding: 40px 20px;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px;">
        <tr>
            <td>
                <p style="font-size: 24px; margin: 0 0 16px 0;">👋</p>
                <h1 style="margin: 0 0 16px 0; font-size: 20px; color: #1a1a1a;">Welcome back, ${firstName}!</h1>
                <p style="margin: 0 0 12px 0; font-size: 15px; color: #444; line-height: 1.6;">
                    Good to see you again. Your subscription is back on, and you'll start receiving curated posts that match what you care about.
                </p>
                <p style="margin: 0; font-size: 15px; color: #444; line-height: 1.6;">
                    Same promise as before — no spam, just the good stuff.
                </p>
                ${topicsHtml}
                <p style="margin: 24px 0 0 0; font-size: 15px; color: #444;">— Omkar</p>
            </td>
        </tr>
    </table>
</body>
</html>
`

    const mailOptions = {
        from: `"Omkar Chebale" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Welcome back! 👋",
        text: `Welcome back, ${firstName}! Your subscription is reactivated. ${topics.length > 0 ? `Updated interests: ${topics.join(', ')}` : ''} — Omkar`,
        html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
}

// Dashboard stats interface
interface DashboardStats {
    totalSubscribers: number
    activeSubscribers: number
    todaySubscribers: number
    weekSubscribers: number
    monthSubscribers: number
    topTopics: { topic: string; count: number }[]
    recentSubscribers: { name: string; email: string; subscribedAt: Date }[]
    growthRate: number // Percentage growth this week vs last week
}

interface NewSubscriberNotificationParams {
    newSubscriber: {
        email: string
        name?: string
        topics: string[]
    }
    stats: DashboardStats
    isReactivation?: boolean
}

export async function sendNewSubscriberNotification({
    newSubscriber,
    stats,
    isReactivation = false,
}: NewSubscriberNotificationParams) {
    const transporter = getTransporter()
    const adminEmail = process.env.GMAIL_USER

    if (!adminEmail) {
        console.error('GMAIL_USER not set, cannot send admin notification')
        return
    }

    const subscriberName = newSubscriber.name || 'Anonymous'
    const subscriberTopics = newSubscriber.topics.length > 0
        ? newSubscriber.topics.join(', ')
        : 'No specific topics'

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const growthIndicator = stats.growthRate >= 0
        ? `<span style="color: #10b981;">↑ ${stats.growthRate.toFixed(1)}%</span>`
        : `<span style="color: #ef4444;">↓ ${Math.abs(stats.growthRate).toFixed(1)}%</span>`

    const topTopicsHtml = stats.topTopics.slice(0, 5).map((t, idx) => `
        <tr style="background: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
            <td style="padding: 8px 12px; font-size: 13px; color: #374151;">${t.topic}</td>
            <td style="padding: 8px 12px; font-size: 13px; color: #6b7280; text-align: right;">${t.count} subscribers</td>
        </tr>
    `).join('')

    const recentSubscribersHtml = stats.recentSubscribers.slice(0, 5).map((s, idx) => `
        <tr style="background: ${idx % 2 === 0 ? '#f8fafc' : '#ffffff'};">
            <td style="padding: 8px 12px; font-size: 13px; color: #374151;">${s.name || 'Anonymous'}</td>
            <td style="padding: 8px 12px; font-size: 13px; color: #6b7280;">${s.email}</td>
            <td style="padding: 8px 12px; font-size: 12px; color: #9ca3af; text-align: right;">${formatDate(s.subscribedAt)}</td>
        </tr>
    `).join('')

    const actionType = isReactivation ? 'reactivated' : 'subscribed'
    const emoji = isReactivation ? '🔄' : '🎉'

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                    
                    <!-- Header Banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px 16px 0 0; padding: 32px 24px; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 40px;">${emoji}</p>
                            <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700; color: #ffffff;">
                                New Subscriber Alert!
                            </h1>
                            <p style="margin: 0; font-size: 14px; color: #94a3b8;">
                                Someone just ${actionType} to your newsletter
                            </p>
                        </td>
                    </tr>
                    
                    <!-- New Subscriber Card -->
                    <tr>
                        <td style="background: #ffffff; padding: 0 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: -24px 0 24px 0; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 12px; box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <p style="margin: 0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: rgba(255,255,255,0.8);">New Subscriber</p>
                                        <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 600; color: #ffffff;">${subscriberName}</h2>
                                        <table cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding-right: 8px;">
                                                    <span style="display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.2); border-radius: 20px; font-size: 12px; color: #ffffff;">📧 ${newSubscriber.email}</span>
                                                </td>
                                            </tr>
                                        </table>
                                        <p style="margin: 12px 0 0 0; font-size: 13px; color: rgba(255,255,255,0.9);">
                                            <strong>Interests:</strong> ${subscriberTopics}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Stats Dashboard -->
                    <tr>
                        <td style="background: #ffffff; padding: 0 24px 24px 24px;">
                            <h3 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 600; color: #1a1a2e; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px;">
                                📊 Newsletter Dashboard
                            </h3>
                            
                            <!-- Stats Grid -->
                            <table width="100%" cellpadding="0" cellspacing="8">
                                <tr>
                                    <td style="width: 50%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); border-radius: 12px; padding: 16px; text-align: center;">
                                        <p style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; color: #ffffff;">${stats.totalSubscribers}</p>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.8);">Total Subscribers</p>
                                    </td>
                                    <td style="width: 50%; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); border-radius: 12px; padding: 16px; text-align: center;">
                                        <p style="margin: 0 0 4px 0; font-size: 28px; font-weight: 700; color: #ffffff;">${stats.activeSubscribers}</p>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.8);">Active Subscribers</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="width: 50%; background: #f8fafc; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 4px 0; font-size: 24px; font-weight: 700; color: #1a1a2e;">${stats.todaySubscribers}</p>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">Today</p>
                                    </td>
                                    <td style="width: 50%; background: #f8fafc; border-radius: 12px; padding: 16px; text-align: center; border: 1px solid #e2e8f0;">
                                        <p style="margin: 0 0 4px 0; font-size: 24px; font-weight: 700; color: #1a1a2e;">${stats.weekSubscribers}</p>
                                        <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748b;">This Week</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); border-radius: 12px; padding: 16px; text-align: center;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="text-align: left;">
                                                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.8);">This Month</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 700; color: #ffffff;">${stats.monthSubscribers}</p>
                                                </td>
                                                <td style="text-align: right;">
                                                    <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: rgba(255,255,255,0.8);">Weekly Growth</p>
                                                    <p style="margin: 4px 0 0 0; font-size: 20px; font-weight: 700; color: #ffffff;">${growthIndicator}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Top Topics Section -->
                    ${stats.topTopics.length > 0 ? `
                    <tr>
                        <td style="background: #ffffff; padding: 0 24px 24px 24px;">
                            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1a1a2e;">
                                🔥 Top Interests
                            </h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                                <thead>
                                    <tr style="background: #1a1a2e;">
                                        <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; text-align: left;">Topic</th>
                                        <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; text-align: right;">Count</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${topTopicsHtml}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Recent Subscribers Section -->
                    ${stats.recentSubscribers.length > 0 ? `
                    <tr>
                        <td style="background: #ffffff; padding: 0 24px 24px 24px;">
                            <h3 style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1a1a2e;">
                                👥 Recent Subscribers
                            </h3>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0;">
                                <thead>
                                    <tr style="background: #1a1a2e;">
                                        <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; text-align: left;">Name</th>
                                        <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; text-align: left;">Email</th>
                                        <th style="padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; text-align: right;">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${recentSubscribersHtml}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    ` : ''}
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background: #1a1a2e; border-radius: 0 0 16px 16px; padding: 24px; text-align: center;">
                            <p style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8;">
                                📬 Newsletter Admin Notification
                            </p>
                            <p style="margin: 0; font-size: 11px; color: #64748b;">
                                Sent at ${formatDate(new Date())} • 
                                <a href="https://omkarchebale.vercel.app" style="color: #10b981; text-decoration: none;">omkarchebale.vercel.app</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

    const textContent = `
🎉 New Subscriber Alert!

Someone just ${actionType} to your newsletter.

NEW SUBSCRIBER:
- Name: ${subscriberName}
- Email: ${newSubscriber.email}
- Interests: ${subscriberTopics}

📊 DASHBOARD STATS:
- Total Subscribers: ${stats.totalSubscribers}
- Active Subscribers: ${stats.activeSubscribers}
- Today: ${stats.todaySubscribers}
- This Week: ${stats.weekSubscribers}
- This Month: ${stats.monthSubscribers}
- Weekly Growth: ${stats.growthRate >= 0 ? '+' : ''}${stats.growthRate.toFixed(1)}%

TOP INTERESTS:
${stats.topTopics.slice(0, 5).map(t => `- ${t.topic}: ${t.count} subscribers`).join('\n')}

RECENT SUBSCRIBERS:
${stats.recentSubscribers.slice(0, 5).map(s => `- ${s.name || 'Anonymous'} (${s.email})`).join('\n')}

---
Newsletter Admin Notification
omkarchebale.vercel.app
`

    const mailOptions = {
        from: `"Portfolio Newsletter" <${process.env.GMAIL_USER}>`,
        to: adminEmail,
        subject: `${emoji} New Subscriber: ${subscriberName} just ${actionType}!`,
        text: textContent,
        html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
}

// Helper function to calculate dashboard stats
export async function calculateDashboardStats(SubscriberModel: any): Promise<DashboardStats> {
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const lastWeekStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    // Get counts
    const [
        totalSubscribers,
        activeSubscribers,
        todaySubscribers,
        weekSubscribers,
        lastWeekSubscribers,
        monthSubscribers,
        topTopicsAgg,
        recentSubscribers,
    ] = await Promise.all([
        SubscriberModel.countDocuments({}),
        SubscriberModel.countDocuments({ isActive: true }),
        SubscriberModel.countDocuments({ subscribedAt: { $gte: todayStart } }),
        SubscriberModel.countDocuments({ subscribedAt: { $gte: weekStart } }),
        SubscriberModel.countDocuments({
            subscribedAt: { $gte: lastWeekStart, $lt: weekStart }
        }),
        SubscriberModel.countDocuments({ subscribedAt: { $gte: monthStart } }),
        SubscriberModel.aggregate([
            { $match: { isActive: true } },
            { $unwind: '$topics' },
            { $group: { _id: '$topics', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            { $project: { topic: '$_id', count: 1, _id: 0 } },
        ]),
        SubscriberModel.find({ isActive: true })
            .sort({ subscribedAt: -1 })
            .limit(5)
            .select('name email subscribedAt'),
    ])

    // Calculate growth rate
    const growthRate = lastWeekSubscribers > 0
        ? ((weekSubscribers - lastWeekSubscribers) / lastWeekSubscribers) * 100
        : weekSubscribers > 0 ? 100 : 0

    return {
        totalSubscribers,
        activeSubscribers,
        todaySubscribers,
        weekSubscribers,
        monthSubscribers,
        topTopics: topTopicsAgg,
        recentSubscribers: recentSubscribers.map((s: any) => ({
            name: s.name,
            email: s.email,
            subscribedAt: s.subscribedAt,
        })),
        growthRate,
    }
}

// Curated Blog Notification Types
interface CuratedBlogNotificationParams {
    blog: {
        title: string
        slug: string
        description: string
        tags: string[]
    }
    subscriber: {
        email: string
        name?: string
    }
}

interface BulkCuratedBlogNotificationParams {
    blog: {
        title: string
        slug: string
        description: string
        tags: string[]
    }
    subscribers: {
        email: string
        name?: string
    }[]
}

const BASE_URL = 'https://omkarchebale.vercel.app'

// Dynamic subject line generator for curated blogs
function generateCuratedBlogSubject(title: string): string {
    const subjectTemplates = [
        `🌟 Just Published: "${title}" — A Must Read!`,
        `📖 Fresh from Omkar: ${title}`,
        `✨ New Curated Post: ${title}`,
        `🔥 Don't Miss This: ${title}`,
        `💡 Just Dropped: ${title} — Check It Out!`,
    ]
    return subjectTemplates[Math.floor(Math.random() * subjectTemplates.length)]
}

// Send curated blog notification to a single subscriber
export async function sendCuratedBlogNotification({
    blog,
    subscriber,
}: CuratedBlogNotificationParams) {
    const transporter = getTransporter()
    const firstName = subscriber.name?.split(' ')[0] || 'there'
    const blogUrl = `${BASE_URL}/blog/${blog.slug}`

    const tagsHtml = blog.tags.length > 0
        ? `<div style="margin-top: 16px;">
             ${blog.tags.map(tag => `<span style="display: inline-block; margin: 2px 4px 2px 0; padding: 4px 10px; background: rgba(99, 102, 241, 0.1); color: #6366f1; border-radius: 20px; font-size: 11px; font-weight: 500;">#${tag}</span>`).join('')}
           </div>`
        : ''

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0f0f23;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(180deg, #0f0f23 0%, #1a1a3e 100%); padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px;">
                    
                    <!-- Decorative Top -->
                    <tr>
                        <td style="text-align: center; padding-bottom: 24px;">
                            <div style="display: inline-block; padding: 8px 16px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: white; font-weight: 600;">
                                ✨ Curated for You
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Main Card -->
                    <tr>
                        <td style="background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                            
                            <!-- Header Gradient -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%); height: 8px;"></td>
                                </tr>
                            </table>
                            
                            <!-- Content -->
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 40px 32px;">
                                        
                                        <!-- Greeting -->
                                        <p style="margin: 0 0 24px 0; font-size: 16px; color: #374151; line-height: 1.6;">
                                            Hey ${firstName} 👋
                                        </p>
                                        
                                        <p style="margin: 0 0 28px 0; font-size: 15px; color: #6b7280; line-height: 1.7;">
                                            I just published something I think you'll really enjoy. This one's special — a curated piece I put extra thought into.
                                        </p>
                                        
                                        <!-- Blog Card -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 16px; border-left: 4px solid #6366f1;">
                                            <tr>
                                                <td style="padding: 24px;">
                                                    <h2 style="margin: 0 0 12px 0; font-size: 22px; font-weight: 700; color: #1a1a2e; line-height: 1.3;">
                                                        ${blog.title}
                                                    </h2>
                                                    <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.6;">
                                                        ${blog.description || 'A new post worth your time.'}
                                                    </p>
                                                    ${tagsHtml}
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- CTA Button -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 32px;">
                                            <tr>
                                                <td align="center">
                                                    <a href="${blogUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 15px; font-weight: 600; box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.4);">
                                                        Read the Full Post →
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Sign off -->
                                        <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 40px; border-top: 1px solid #e5e7eb;">
                                            <tr>
                                                <td style="padding-top: 24px;">
                                                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                                                        Happy reading,
                                                    </p>
                                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1a1a2e;">
                                                        Omkar ✌️
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                    </td>
                                </tr>
                            </table>
                            
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 20px; text-align: center;">
                            <p style="margin: 0 0 12px 0; font-size: 12px; color: #64748b;">
                                You're receiving this because you subscribed to my newsletter.
                            </p>
                            <p style="margin: 0; font-size: 12px; color: #475569;">
                                <a href="${BASE_URL}" style="color: #10b981; text-decoration: none;">omkarchebale.vercel.app</a>
                                &nbsp;•&nbsp;
                                <a href="https://github.com/Chebaleomkar" style="color: #64748b; text-decoration: none;">GitHub</a>
                                &nbsp;•&nbsp;
                                <a href="https://twitter.com/chebalerushi" style="color: #64748b; text-decoration: none;">Twitter</a>
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`

    const textContent = `
Hey ${firstName}!

I just published something I think you'll really enjoy. This one's special — a curated piece I put extra thought into.

📖 ${blog.title}

${blog.description || 'A new post worth your time.'}

${blog.tags.length > 0 ? `Tags: ${blog.tags.map(t => `#${t}`).join(' ')}` : ''}

Read it here: ${blogUrl}

Happy reading,
Omkar ✌️

---
You're receiving this because you subscribed to my newsletter.
https://omkarchebale.vercel.app
`

    const mailOptions = {
        from: `"Omkar Chebale" <${process.env.GMAIL_USER}>`,
        to: subscriber.email,
        subject: generateCuratedBlogSubject(blog.title),
        text: textContent,
        html: htmlContent,
    }

    await transporter.sendMail(mailOptions)
}

// Send curated blog notification to all active subscribers
export async function sendCuratedBlogToAllSubscribers({
    blog,
    subscribers,
}: BulkCuratedBlogNotificationParams): Promise<{ sent: number; failed: number; errors: string[] }> {
    const results = {
        sent: 0,
        failed: 0,
        errors: [] as string[],
    }

    // Process in batches to avoid overwhelming the email server
    const BATCH_SIZE = 10
    const BATCH_DELAY = 1000 // 1 second between batches

    for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
        const batch = subscribers.slice(i, i + BATCH_SIZE)

        const batchPromises = batch.map(async (subscriber) => {
            try {
                await sendCuratedBlogNotification({ blog, subscriber })
                results.sent++
            } catch (error) {
                results.failed++
                results.errors.push(`Failed to send to ${subscriber.email}: ${error instanceof Error ? error.message : 'Unknown error'}`)
                console.error(`Failed to send curated blog notification to ${subscriber.email}:`, error)
            }
        })

        await Promise.all(batchPromises)

        // Add delay between batches (except for the last batch)
        if (i + BATCH_SIZE < subscribers.length) {
            await new Promise(resolve => setTimeout(resolve, BATCH_DELAY))
        }
    }

    console.log(`Curated blog notification sent: ${results.sent} successful, ${results.failed} failed`)
    return results
}
