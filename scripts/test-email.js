import dotenv from 'dotenv'
import nodemailer from 'nodemailer'
import path from 'path'

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const GMAIL_USER = process.env.GMAIL_USER
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD

console.log('--- Email Test Script ---')
console.log('GMAIL_USER:', GMAIL_USER)
console.log('GMAIL_APP_PASSWORD:', GMAIL_APP_PASSWORD ? '********' : 'NOT SET')

async function testEmail() {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        console.error('Error: GMAIL_USER or GMAIL_APP_PASSWORD is not set in .env')
        process.exit(1)
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
    })

    const targetEmail = 'reddyrushi427@gmail.com'

    const mailOptions = {
        from: `"Omkar Test" <${GMAIL_USER}>`,
        to: targetEmail,
        subject: "🚀 Portfolio Email Test",
        text: "This is a test email from your Portfolio application. If you received this, the email functionality is working correctly!",
        html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: 0 auto; background: #fafafa;">
                <h1 style="color: #10b981; margin-top: 0;">Email Functionality Test</h1>
                <p>Hello!</p>
                <p>This is a test email from your <strong>Portfolio application</strong>.</p>
                <p style="background: #e8f5e9; padding: 15px; border-radius: 8px; color: #2e7d32; font-weight: 500;">
                    ✅ The email service is configured correctly!
                </p>
                <p>Timestamp: ${new Date().toLocaleString('en-IN')}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #888;">Test sent to: ${targetEmail}</p>
            </div>
        `,
    }

    console.log(`Attempting to send test email to ${targetEmail}...`)

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log('✅ Email sent successfully!')
        console.log('Message ID:', info.messageId)
        console.log('Response:', info.response)
    } catch (error) {
        console.error('❌ Failed to send email:')
        console.error(error)

        if (error instanceof Error && error.message.includes('Invalid login')) {
            console.log('\n--- Troubleshooting ---')
            console.log('1. Make sure GMAIL_APP_PASSWORD is a "Google App Password", NOT your regular password.')
            console.log('2. Check if 2-Step Verification is enabled on your Google account.')
            console.log('3. Ensure the email used in GMAIL_USER is the one that generated the App Password.')
        }
    }
}

testEmail()
