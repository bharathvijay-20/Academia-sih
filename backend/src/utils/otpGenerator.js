import crypto from 'crypto';

/**
 * Generate a cryptographically secure 6-digit numeric OTP
 * @returns {string} 6-digit string, e.g. "482910"
 */
export function generateOtp() {
  // Generate random integer between 100000 and 999999
  const randomInt = crypto.randomInt(100000, 1000000);
  return randomInt.toString();
}

/**
 * Hash an OTP using SHA-256 for secure database storage
 * @param {string} otp 
 * @returns {string} hex hash
 */
export function hashOtp(otp) {
  return crypto.createHash('sha256').update(String(otp).trim()).digest('hex');
}
