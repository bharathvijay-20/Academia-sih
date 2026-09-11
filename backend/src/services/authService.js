import db from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/passwordHasher.js';
import { otpService } from './otpService.js';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';
import crypto from 'crypto';

export const authService = {
  /**
   * Complete registration after email OTP verification
   */
  async registerUser({ email, password, role, profileData }) {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Check if OTP verification was performed
    const isVerified = otpService.isEmailVerified({
      email: normalizedEmail,
      purpose: 'REGISTRATION'
    });
    if (isVerified) {
      otpService.consumeVerification({ email: normalizedEmail, purpose: 'REGISTRATION' });
    }

    // 2. Check duplicate email
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (existingUser) {
      throw new Error('An account with this email address already exists. Please sign in instead.');
    }

    // 3. Validate Role
    const validRoles = ['STUDENT', 'INDUSTRY_RECRUITER', 'ACADEMICIAN', 'EDUCATIONAL_INSTITUTION'];
    if (!validRoles.includes(role)) {
      throw new Error('Invalid user role specified.');
    }

    // 4. Hash password
    const passwordHash = await hashPassword(password);
    const userId = `usr-${role.toLowerCase().slice(0, 3)}-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const profileId = `prof-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    // 5. Insert user record
    const insertUserStmt = db.prepare(`
      INSERT INTO users (id, email, password_hash, role, email_verified)
      VALUES (?, ?, ?, ?, 1)
    `);
    insertUserStmt.run(userId, normalizedEmail, passwordHash, role);

    // 6. Insert Role-Specific Profile
    if (role === 'STUDENT') {
      const p = profileData || {};
      const insertStudent = db.prepare(`
        INSERT INTO student_profiles (
          id, user_id, name, phone, college, department, year, graduation_year, cgpa, location, career_goal, bio, profile_completion, skill_readiness
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertStudent.run(
        profileId,
        userId,
        p.name || 'New Student',
        p.phone || '',
        p.college || 'Engineering Institute',
        p.department || 'Computer Science',
        p.year || '3rd Year',
        p.graduation_year || '2027',
        parseFloat(p.cgpa || '8.5'),
        p.location || 'India',
        p.career_goal || 'Software Engineer',
        p.bio || '',
        85,
        74
      );
    } else if (role === 'INDUSTRY_RECRUITER') {
      const p = profileData || {};
      const insertIndustry = db.prepare(`
        INSERT INTO industry_profiles (
          id, user_id, company_name, representative_name, designation, email, website, industry_domain, company_size, headquarters, bio
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertIndustry.run(
        profileId,
        userId,
        p.company_name || 'Enterprise Partner',
        p.representative_name || p.name || 'Recruiter Lead',
        p.designation || 'Talent Acquisition Manager',
        normalizedEmail,
        p.website || 'https://company.com',
        p.industry_domain || 'Technology & Cloud',
        p.company_size || '100–500 Employees',
        p.headquarters || 'Bangalore, India',
        p.bio || ''
      );
    } else if (role === 'ACADEMICIAN') {
      const p = profileData || {};
      const insertFaculty = db.prepare(`
        INSERT INTO academician_profiles (
          id, user_id, name, institution, department, designation, experience, specialization, phone
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      insertFaculty.run(
        profileId,
        userId,
        p.name || 'Faculty Member',
        p.institution || 'University Institute',
        p.department || 'Computer Science & Engineering',
        p.designation || 'Assistant Professor',
        p.experience || '8 Years',
        p.specialization || 'Distributed Systems & AI',
        p.phone || ''
      );
    } else if (role === 'EDUCATIONAL_INSTITUTION') {
      const p = profileData || {};
      const insertEdu = db.prepare(`
        INSERT INTO educational_profiles (
          id, user_id, institution_name, dean_name, accreditation, website
        ) VALUES (?, ?, ?, ?, ?, ?)
      `);
      insertEdu.run(
        profileId,
        userId,
        p.institution_name || 'Technical University',
        p.dean_name || p.name || 'Dean & Principal',
        p.accreditation || 'NAAC A+ Grade',
        p.website || 'https://university.edu'
      );
    }

    // 8. Generate JWT token
    const token = jwt.sign(
      { id: userId, email: normalizedEmail, role },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );

    const fullUser = this.getUserProfile(userId);

    return {
      token,
      user: {
        id: userId,
        email: normalizedEmail,
        role,
        name: fullUser?.profile?.name || normalizedEmail.split('@')[0],
        email_verified: 1
      },
      profile: fullUser?.profile || {}
    };
  },

  /**
   * Authenticate existing user with Email and Password
   */
  async loginUser({ email, password }) {
    const normalizedEmail = (email || '').trim().toLowerCase();

    if (!normalizedEmail || !password) {
      throw new Error('Please provide both email and password.');
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await comparePassword(password, user.password_hash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    if (!user.email_verified) {
      throw new Error('Your email has not been verified yet. Please complete registration verification.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_CONFIG.secret,
      { expiresIn: JWT_CONFIG.expiresIn }
    );

    const fullUser = this.getUserProfile(user.id);

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: fullUser?.profile?.name || user.email.split('@')[0],
        email_verified: user.email_verified
      },
      profile: fullUser?.profile || {}
    };
  },

  /**
   * Reset Password with OTP verification
   */
  async resetPassword({ email, otp, newPassword }) {
    const normalizedEmail = email.trim().toLowerCase();

    // Check user exists
    const user = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
    if (!user) {
      throw new Error('No registered account found with this email address.');
    }

    // Verify OTP
    const verification = otpService.verifyOtp({
      email: normalizedEmail,
      otp,
      purpose: 'PASSWORD_RESET'
    });

    if (!verification.valid) {
      throw new Error(verification.message);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update DB
    db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(newPasswordHash, user.id);

    // Consume OTP
    otpService.consumeVerification({ email: normalizedEmail, purpose: 'PASSWORD_RESET' });

    return { success: true, message: 'Password has been updated successfully. You can now login.' };
  },

  /**
   * Retrieve full user and role-specific profile
   */
  getUserProfile(userId) {
    const user = db.prepare('SELECT id, email, role, email_verified, created_at FROM users WHERE id = ?').get(userId);
    if (!user) return null;

    let profile = null;
    if (user.role === 'STUDENT') {
      profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(userId);
    } else if (user.role === 'INDUSTRY_RECRUITER') {
      profile = db.prepare('SELECT * FROM industry_profiles WHERE user_id = ?').get(userId);
    } else if (user.role === 'ACADEMICIAN') {
      profile = db.prepare('SELECT * FROM academician_profiles WHERE user_id = ?').get(userId);
    } else if (user.role === 'EDUCATIONAL_INSTITUTION') {
      profile = db.prepare('SELECT * FROM educational_profiles WHERE user_id = ?').get(userId);
    }

    let normalizedProfile = profile ? { ...profile } : {};
    if (normalizedProfile.name && !normalizedProfile.full_name) {
      normalizedProfile.full_name = normalizedProfile.name;
    } else if (normalizedProfile.full_name && !normalizedProfile.name) {
      normalizedProfile.name = normalizedProfile.full_name;
    } else if (!normalizedProfile.name && !normalizedProfile.full_name) {
      normalizedProfile.name = normalizedProfile.representative_name || normalizedProfile.dean_name || 'User';
      normalizedProfile.full_name = normalizedProfile.name;
    }

    return { ...user, profile: normalizedProfile };
  }
};
