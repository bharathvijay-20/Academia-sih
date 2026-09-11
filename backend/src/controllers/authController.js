import { otpService } from '../services/otpService.js';
import { authService } from '../services/authService.js';
import db from '../config/db.js';

export const authController = {
  /**
   * POST /api/auth/register/send-otp
   */
  async sendRegistrationOtp(req, res) {
    try {
      const { email, role, name } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
      }

      const validRoles = ['STUDENT', 'INDUSTRY_RECRUITER', 'ACADEMICIAN', 'EDUCATIONAL_INSTITUTION'];
      if (role && !validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid stakeholder role specified.' });
      }

      // Check if email already registered
      const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
      if (existing) {
        return res.status(409).json({ error: 'An account with this email is already registered. Please log in.' });
      }

      const result = await otpService.createAndSendOtp({
        email,
        purpose: 'REGISTRATION',
        recipientName: name || 'Applicant'
      });

      if (!result.success) {
        return res.status(429).json({ error: result.error, cooldownRemaining: result.cooldownRemaining });
      }

      res.status(200).json(result);
    } catch (err) {
      console.error('Error sending registration OTP:', err);
      res.status(500).json({ error: err.message || 'Failed to send verification email.' });
    }
  },

  /**
   * POST /api/auth/register/verify-otp
   */
  async verifyRegistrationOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and 6-digit OTP code are required.' });
      }

      const verification = otpService.verifyOtp({
        email,
        otp,
        purpose: 'REGISTRATION'
      });

      if (!verification.valid) {
        return res.status(400).json({
          error: verification.message,
          remainingAttempts: verification.remainingAttempts
        });
      }

      res.status(200).json(verification);
    } catch (err) {
      console.error('Error verifying registration OTP:', err);
      res.status(500).json({ error: err.message || 'Verification failed.' });
    }
  },

  /**
   * POST /api/auth/register/complete
   */
  async completeRegistration(req, res) {
    try {
      const { email, password, role, fullName, profileData = {} } = req.body;

      if (!email || !password || !role) {
        return res.status(400).json({ error: 'Email, password, and role are required to complete registration.' });
      }

      if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const mergedProfile = {
        ...profileData,
        name: fullName || profileData.name || profileData.fullName || profileData.full_name || profileData.representative_name || profileData.dean_name || 'User',
        full_name: fullName || profileData.full_name || profileData.name || 'User'
      };

      const result = await authService.registerUser({
        email,
        password,
        role,
        profileData: mergedProfile
      });

      res.status(201).json({
        message: 'Account registered successfully!',
        token: result.token,
        user: result.user,
        profile: result.profile
      });
    } catch (err) {
      console.error('Error completing registration:', err);
      res.status(400).json({ error: err.message || 'Registration failed.' });
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Please provide both email and password.' });
      }

      const result = await authService.loginUser({ email, password });

      res.status(200).json({
        message: 'Login successful!',
        token: result.token,
        user: result.user,
        profile: result.profile
      });
    } catch (err) {
      res.status(401).json({ error: err.message || 'Authentication failed.' });
    }
  },

  /**
   * POST /api/auth/forgot-password/send-otp
   */
  async sendForgotPasswordOtp(req, res) {
    try {
      const { email } = req.body;

      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Please enter a valid email address.' });
      }

      const user = db.prepare('SELECT id, email FROM users WHERE email = ?').get(email.trim().toLowerCase());
      if (!user) {
        return res.status(404).json({ error: 'No registered account found with this email address.' });
      }

      const result = await otpService.createAndSendOtp({
        email,
        purpose: 'PASSWORD_RESET',
        recipientName: 'User'
      });

      if (!result.success) {
        return res.status(429).json({ error: result.error, cooldownRemaining: result.cooldownRemaining });
      }

      res.status(200).json(result);
    } catch (err) {
      console.error('Error sending forgot-password OTP:', err);
      res.status(500).json({ error: err.message || 'Failed to send password reset code.' });
    }
  },

  /**
   * POST /api/auth/forgot-password/verify-otp
   */
  async verifyForgotPasswordOtp(req, res) {
    try {
      const { email, otp } = req.body;

      if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required.' });
      }

      const verification = otpService.verifyOtp({
        email,
        otp,
        purpose: 'PASSWORD_RESET'
      });

      if (!verification.valid) {
        return res.status(400).json({ error: verification.message });
      }

      res.status(200).json(verification);
    } catch (err) {
      res.status(500).json({ error: err.message || 'Verification failed.' });
    }
  },

  /**
   * POST /api/auth/forgot-password/reset
   */
  async resetPassword(req, res) {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        return res.status(400).json({ error: 'Email, OTP, and new password are required.' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
      }

      const result = await authService.resetPassword({
        email,
        otp,
        newPassword
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ error: err.message || 'Password reset failed.' });
    }
  },

  /**
   * GET /api/auth/me (Protected)
   */
  async getMe(req, res) {
    try {
      const userProfile = authService.getUserProfile(req.user.id);
      if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found.' });
      }
      res.status(200).json({ user: userProfile });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};
