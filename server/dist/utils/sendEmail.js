"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    // Check if we are using the default placeholder credentials or explicit mock mode
    const isMockMode = process.env.NODE_ENV !== 'production' &&
        (process.env.SMTP_USER === 'your_smtp_user' || !process.env.SMTP_USER);
    if (isMockMode) {
        console.log('\n======================================================');
        console.log('📧 MOCK EMAIL INTERCEPTED (Development Mode)');
        console.log('======================================================');
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log('Message:');
        // Extract just the URL from the HTML string for easier clicking in the terminal
        const urlMatch = options.message.match(/href="([^"]+)"/);
        if (urlMatch && urlMatch[1]) {
            console.log(`👉 RESET LINK: ${urlMatch[1]}`);
        }
        else {
            console.log(options.message);
        }
        console.log('======================================================\n');
        return;
    }
    // Create a transporter
    const transporter = nodemailer_1.default.createTransport({
        host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
        port: Number(process.env.SMTP_PORT) || 2525,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
    // Define email options
    const mailOptions = {
        from: `Lumina Premium <${process.env.SMTP_FROM_EMAIL || 'noreply@lumina.com'}>`,
        to: options.email,
        subject: options.subject,
        html: options.message,
    };
    // Actually send the email
    await transporter.sendMail(mailOptions);
};
exports.default = sendEmail;
