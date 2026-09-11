import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const emailService = {
  /**
   * Send Email OTP for Registration or Password Reset via SMTP
   */
  async sendOtpEmail({ toEmail, otp, purpose = 'REGISTRATION', recipientName = 'User' }) {
    console.log(`\n======================================================`);
    console.log(`📧 [EMAIL SERVICE] OUTGOING VERIFICATION EMAIL DISPATCH`);
    console.log(`📬 Recipient: ${toEmail}`);
    console.log(`🎯 Purpose:   ${purpose}`);
    console.log(`🔒 Hashed in database, dispatching via SMTP transport...`);
    console.log(`======================================================\n`);

    const host = process.env.EMAIL_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.EMAIL_PORT || '587', 10);
    const secure = process.env.EMAIL_SECURE === 'true' || port === 465;
    const user = process.env.EMAIL_USERNAME;
    const pass = process.env.EMAIL_PASSWORD;

    const isSmtpConfigured = Boolean(
      host &&
      user &&
      pass &&
      pass !== 'your_app_password_here'
    );

    if (process.env.NODE_ENV === 'test') {
      console.log(`🧪 [TEST MODE] Simulated SMTP verification dispatch to ${toEmail}`);
      return { success: true, mode: 'TEST_SMTP', messageId: `test-${Date.now()}` };
    }

    if (!isSmtpConfigured) {
      console.error(`❌ [SMTP ERROR] SMTP is not properly configured in .env.`);
      console.error(`   EMAIL_HOST: ${host}, EMAIL_PORT: ${port}, EMAIL_USERNAME: ${user}`);
      console.error(`   Please provide valid SMTP credentials in backend/.env to deliver OTPs to ${toEmail}.`);
      throw new Error(
        `Email delivery failed: SMTP is not configured with valid credentials in .env. Please set EMAIL_USERNAME and EMAIL_PASSWORD (e.g. Gmail App Password).`
      );
    }

    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false
        }
      });

      const subject = purpose === 'REGISTRATION'
        ? 'Academia — Your Registration Email Verification Code'
        : 'Academia — Your Password Reset Verification Code';

      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 540px; margin: auto; padding: 32px 24px; background: #0b0f19; color: #f1f5f9; border-radius: 12px; border: 1px solid #1e293b;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h2 style="color: #6366f1; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">Academia Platform</h2>
            <p style="color: #64748b; font-size: 13px; margin-top: 4px;">AI-Powered Academia–Industry Collaboration Platform</p>
          </div>
          <div style="background: #131b2e; padding: 28px 24px; border-radius: 10px; border: 1px solid #283548; text-align: center;">
            <p style="font-size: 14px; margin-top: 0; color: #cbd5e1;">Hello <strong>${recipientName}</strong>,</p>
            <p style="font-size: 13px; color: #94a3b8; line-height: 1.5;">Please use the following 6-digit One-Time Password (OTP) to verify your account email address:</p>
            <div style="font-size: 32px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; margin: 24px 0; padding: 14px 20px; background: #070c18; border-radius: 8px; border: 1px solid #1e293b; display: inline-block; font-family: monospace;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #64748b; margin-bottom: 0;">This code will expire in <strong>10 minutes</strong>. If you did not request this verification, please disregard this email.</p>
          </div>
          <p style="text-align: center; font-size: 11px; color: #475569; margin-top: 24px;">© 2026 Academia Platform • Secure Role-Based Verification</p>
        </div>
      `;

      const info = await transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Academia Verification'}" <${process.env.EMAIL_FROM_ADDRESS || user}>`,
        to: toEmail,
        subject,
        html: htmlContent
      });

      console.log(`✅ [EMAIL SERVICE] OTP successfully delivered to ${toEmail} (Message ID: ${info.messageId})`);
      return { success: true, mode: 'SMTP', messageId: info.messageId };
    } catch (err) {
      console.error(`❌ [SMTP SEND ERROR] Failed to send verification email to ${toEmail}:`, err.message);
      throw new Error(`SMTP Email Delivery Failed: ${err.message}. Please check your SMTP configuration in .env.`);
    }
  }
};
