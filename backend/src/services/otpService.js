import db from '../config/db.js';
import { generateOtp, hashOtp } from '../utils/otpGenerator.js';
import { emailService } from './emailService.js';
import crypto from 'crypto';

const OTP_EXPIRY_MINUTES = 10;
const OTP_COOLDOWN_SECONDS = 60;
const MAX_ATTEMPTS = 5;

function parseDbDate(dateStr) {
  if (!dateStr) return 0;
  const normalized = dateStr.includes('T') || dateStr.endsWith('Z') 
    ? dateStr 
    : dateStr.replace(' ', 'T') + 'Z';
  return new Date(normalized).getTime();
}

export const otpService = {
  /**
   * Generate, securely hash, store, and send email OTP
   */
  async createAndSendOtp({ email, purpose = 'REGISTRATION', recipientName = 'User' }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check recent OTP for 60-second cooldown
    const recentOtpStmt = db.prepare(`
      SELECT * FROM email_verification_otps 
      WHERE email = ? AND purpose = ?
      ORDER BY created_at DESC 
      LIMIT 1
    `);
    const existing = recentOtpStmt.get(normalizedEmail, purpose);

    if (existing) {
      const createdAtTime = parseDbDate(existing.created_at);
      const timeSinceCreated = (Date.now() - createdAtTime) / 1000;
      if (timeSinceCreated < OTP_COOLDOWN_SECONDS) {
        const remainingCooldown = Math.ceil(OTP_COOLDOWN_SECONDS - timeSinceCreated);
        return {
          success: false,
          error: `Please wait ${remainingCooldown}s before requesting a new verification code.`,
          cooldownRemaining: remainingCooldown
        };
      }
    }

    // Generate 6-digit cryptographically secure OTP
    const otp = generateOtp();
    const otpHash = hashOtp(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();
    const otpId = `otp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const nowIso = new Date().toISOString();

    // Clean old unverified OTPs for this email and purpose
    const deleteOldStmt = db.prepare(`
      DELETE FROM email_verification_otps 
      WHERE email = ? AND purpose = ?
    `);
    deleteOldStmt.run(normalizedEmail, purpose);

    // Store hashed OTP in database
    const insertStmt = db.prepare(`
      INSERT INTO email_verification_otps (id, email, otp_hash, purpose, expires_at, attempts, verified_at, created_at)
      VALUES (?, ?, ?, ?, ?, 0, NULL, ?)
    `);
    insertStmt.run(otpId, normalizedEmail, otpHash, purpose, expiresAt, nowIso);

    // Send email via SMTP (logged to backend server console only)
    try {
      await emailService.sendOtpEmail({
        toEmail: normalizedEmail,
        otp,
        purpose,
        recipientName
      });
    } catch (sendErr) {
      // Roll back stored OTP to avoid dangling invalid records
      db.prepare('DELETE FROM email_verification_otps WHERE id = ?').run(otpId);
      throw sendErr;
    }

    return {
      success: true,
      message: `Verification code sent to ${normalizedEmail}`,
      expiresMinutes: OTP_EXPIRY_MINUTES,
      cooldownSeconds: OTP_COOLDOWN_SECONDS
    };
  },

  /**
   * Verify the 6-digit OTP entered by the user
   */
  verifyOtp({ email, otp, purpose = 'REGISTRATION' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const rawOtp = String(otp || '').trim();

    if (!rawOtp || rawOtp.length !== 6) {
      return { valid: false, message: 'Please enter a valid 6-digit verification code.' };
    }

    const getOtpStmt = db.prepare(`
      SELECT * FROM email_verification_otps
      WHERE email = ? AND purpose = ?
      ORDER BY created_at DESC
      LIMIT 1
    `);
    const record = getOtpStmt.get(normalizedEmail, purpose);

    if (!record) {
      return { valid: false, message: 'No active OTP verification session found. Please request a code.' };
    }

    // Check expiry
    const expiresAtTime = parseDbDate(record.expires_at);
    if (Date.now() > expiresAtTime) {
      return { valid: false, message: 'Verification code has expired. Please request a new OTP.' };
    }

    // Check max attempts
    if (record.attempts >= MAX_ATTEMPTS) {
      return { valid: false, message: 'Maximum verification attempts exceeded. Please generate a new OTP.' };
    }

    // Increment attempts
    const updateAttemptsStmt = db.prepare(`
      UPDATE email_verification_otps
      SET attempts = attempts + 1
      WHERE id = ?
    `);
    updateAttemptsStmt.run(record.id);

    // Verify hash
    const inputHash = hashOtp(rawOtp);
    if (inputHash !== record.otp_hash) {
      const remainingAttempts = MAX_ATTEMPTS - (record.attempts + 1);
      return {
        valid: false,
        message: `Invalid verification code. (${remainingAttempts} attempts remaining)`,
        remainingAttempts
      };
    }

    // Mark verified
    const nowIso = new Date().toISOString();
    const markVerifiedStmt = db.prepare(`
      UPDATE email_verification_otps
      SET verified_at = ?
      WHERE id = ?
    `);
    markVerifiedStmt.run(nowIso, record.id);

    return {
      valid: true,
      message: 'Email successfully verified!'
    };
  },

  /**
   * Validate that the email was legitimately verified before allowing password creation
   */
  isEmailVerified({ email, purpose = 'REGISTRATION' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const stmt = db.prepare(`
      SELECT * FROM email_verification_otps
      WHERE email = ? AND purpose = ? AND verified_at IS NOT NULL
      ORDER BY verified_at DESC
      LIMIT 1
    `);
    const record = stmt.get(normalizedEmail, purpose);
    if (!record) return false;

    const verifiedTime = parseDbDate(record.verified_at);
    return (Date.now() - verifiedTime) < 30 * 60 * 1000;
  },

  /**
   * Consume / Invalidate OTP verification after account creation to prevent replay
   */
  consumeVerification({ email, purpose = 'REGISTRATION' }) {
    const normalizedEmail = email.trim().toLowerCase();
    const stmt = db.prepare(`
      DELETE FROM email_verification_otps
      WHERE email = ? AND purpose = ?
    `);
    stmt.run(normalizedEmail, purpose);
  }
};
