import nodemailer from 'nodemailer'

// Create reusable transporter
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    })
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
                    
                    <!-- Header -->
                    <tr>
                        <td style="padding: 32px 32px 0 32px;">
                            <p style="margin: 0; font-size: 24px;">👋</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 24px 32px 32px 32px;">
                            <h1 style="margin: 0 0 16px 0; font-size: 22px; font-weight: 600; color: #1a1a1a;">
                                Hey ${firstName}!
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
