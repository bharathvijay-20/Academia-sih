import dotenv from 'dotenv';
dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'academia_ultra_secure_jwt_secret_key_2026_sih26044',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  issuer: 'academia.edu',
  audience: 'academia-users'
};
