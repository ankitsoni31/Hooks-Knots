import nodemailer from 'nodemailer';
import { generateOtpEmailHtml, generateOrderConfirmationEmailHtml } from '../utils/emailTemplates.js';

let transporter: nodemailer.Transporter | null = null;

// Initialize the SMTP transporter
export const initEmailService = () => {
    if (!process.env.EMAIL_USER) {
        console.warn('⚠️ EMAIL_USER is not configured in environment variables.');
        console.warn('📧 Email Service is running in MOCK mode. Emails will be logged to console.');
        return;
    }

    try {
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // Verify the connection configuration
        transporter.verify((error) => {
            if (error) {
                console.error('❌ SMTP Connection Error:', error);
                // Do not crash the app, but disable sending real emails if connection fails
                transporter = null;
                console.warn('📧 Falling back to MOCK mode due to SMTP error.');
            } else {
                console.log('✅ SMTP Connection verified successfully. Email Service is active.');
            }
        });
    } catch (error) {
        console.error('❌ Failed to initialize SMTP Transporter:', error);
        transporter = null;
    }
};

export const sendOTPEmail = async (to: string, otp: string, name: string) => {
    const subject = 'Verify your Hooks & Knots account';
    const htmlContent = generateOtpEmailHtml(name, otp);

    // Development Fallback / Mock Mode
    if (!transporter) {
        console.log(`\n========================================`);
        console.log(`📧 [MOCK EMAIL]`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`[OTP CONTENT]: Hello ${name}, Your OTP is ${otp}`);
        console.log(`========================================\n`);
        return true;
    }

    // Real Email Sending
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Hooks & Knots" <noreply@hooks-knots.com>',
            to,
            subject,
            html: htmlContent,
        });
        
        console.log(`📧 Email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        // Do not expose stack traces to the user/API layer, but log it internally
        console.error('❌ SMTP Send Error:', error);
        throw new Error('Failed to deliver email through SMTP');
    }
};

export const sendOrderConfirmationEmail = async (order: any) => {
    const subject = `Your Hooks & Knots Order #${order.order_number} is Confirmed`;
    const htmlContent = generateOrderConfirmationEmailHtml(order);
    const to = order.email;

    if (!transporter) {
        console.log(`\n========================================`);
        console.log(`📧 [MOCK EMAIL]`);
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`[ORDER CONTENT]: Hello ${order.first_name}, Order ${order.order_number} confirmed for ₹${order.total}.`);
        console.log(`========================================\n`);
        return true;
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Hooks & Knots" <noreply@hooks-knots.com>',
            to,
            subject,
            html: htmlContent,
        });
        
        console.log(`📧 Order confirmation email sent to ${to}: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error('❌ SMTP Send Error (Order Confirmation):', error);
        throw new Error('Failed to deliver order confirmation email through SMTP');
    }
};
