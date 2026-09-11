import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/authenticateToken.js';

const router = express.Router();

// Registration Flow with Email OTP
router.post('/register/send-otp', authController.sendRegistrationOtp);
router.post('/register/verify-otp', authController.verifyRegistrationOtp);
router.post('/register/complete', authController.completeRegistration);

// Standard Login
router.post('/login', authController.login);

// Forgot Password Flow with Email OTP
router.post('/forgot-password/send-otp', authController.sendForgotPasswordOtp);
router.post('/forgot-password/verify-otp', authController.verifyForgotPasswordOtp);
router.post('/forgot-password/reset', authController.resetPassword);

// Rehydrate User Profile
router.get('/me', authenticateToken, authController.getMe);

export default router;
