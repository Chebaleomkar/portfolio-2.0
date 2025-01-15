import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email, subject, message } = await request.json();

        // Validate the input
        if (!email || !subject || !message) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }

        // Create a Nodemailer transporter using Gmail
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER, // Your Gmail email
                pass: process.env.GMAIL_APP_PASSWORD, // Your Google App Password
            },
        });

        // Define the email options
        const mailOptions = {
            from: process.env.GMAIL_USER, // Sender address
            to: process.env.GMAIL_USER, // Receiver address (your email)
            subject: `New Message: ${subject}`, // Subject line
            text: `You have received a new message from ${email}:\n\n${message}`, // Plain text body
            html: `<p>You have received a new message from <strong>${email}</strong>:</p><p>${message}</p>`, // HTML body
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        return NextResponse.json(
            { message: 'Email sent successfully!' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json(
            { error: 'Failed to send email' },
            { status: 500 }
        );
    }
}