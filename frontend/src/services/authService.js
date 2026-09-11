import { apiRequest } from './api';

export const authService = {
  /**
   * Send Registration OTP to Email
   */
  async sendRegistrationOtp(email, role, name) {
    return await apiRequest('/auth/register/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, role, name })
    });
  },

  /**
   * Verify Registration OTP
   */
  async verifyRegistrationOtp(email, otp) {
    return await apiRequest('/auth/register/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },

  /**
   * Complete Registration with Password & Role Profile
   */
  async completeRegistration({ email, password, role = 'STUDENT', fullName = '', profileData = {} }) {
    return await apiRequest('/auth/register/complete', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        role,
        fullName: fullName || profileData.name || email.split('@')[0],
        profileData: {
          ...profileData,
          name: fullName || profileData.name || email.split('@')[0]
        }
      })
    });
  },

  /**
   * Login with Email & Password
   */
  async login(email, password) {
    return await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  /**
   * Send Forgot Password OTP
   */
  async sendForgotPasswordOtp(email) {
    return await apiRequest('/auth/forgot-password/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  /**
   * Verify Forgot Password OTP
   */
  async verifyForgotPasswordOtp(email, otp) {
    return await apiRequest('/auth/forgot-password/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    });
  },

  /**
   * Reset Password
   */
  async resetPassword(email, otp, newPassword) {
    return await apiRequest('/auth/forgot-password/reset', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword })
    });
  },

  /**
   * Fetch authenticated user & profile
   */
  async getCurrentUser() {
    return await apiRequest('/auth/me');
  }
};
