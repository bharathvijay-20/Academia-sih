-- ==========================================================
-- ACADEMIA DATABASE SCHEMA
-- Enterprise Academia–Industry Platform (SIH26044)
-- ==========================================================

PRAGMA foreign_keys = ON;

-- 1. Core Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('STUDENT', 'INDUSTRY_RECRUITER', 'ACADEMICIAN', 'EDUCATIONAL_INSTITUTION')),
  email_verified INTEGER DEFAULT 0 CHECK(email_verified IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. Email Verification OTPs Table
CREATE TABLE IF NOT EXISTS email_verification_otps (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL COLLATE NOCASE,
  otp_hash TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK(purpose IN ('REGISTRATION', 'PASSWORD_RESET')),
  expires_at DATETIME NOT NULL,
  attempts INTEGER DEFAULT 0,
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_otps_email_purpose ON email_verification_otps(email, purpose);

-- 3. Student Profiles Table
CREATE TABLE IF NOT EXISTS student_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  phone TEXT,
  college TEXT NOT NULL,
  department TEXT NOT NULL,
  year TEXT NOT NULL,
  graduation_year TEXT NOT NULL,
  cgpa REAL NOT NULL DEFAULT 8.5,
  location TEXT,
  career_goal TEXT NOT NULL,
  bio TEXT,
  profile_completion INTEGER DEFAULT 88,
  skill_readiness INTEGER DEFAULT 74,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Industry Recruiter Profiles Table
CREATE TABLE IF NOT EXISTS industry_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  email TEXT NOT NULL,
  website TEXT,
  industry_domain TEXT NOT NULL,
  company_size TEXT,
  headquarters TEXT,
  bio TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Student Identity Verification Table (Aadhaar / ID with Duplicate Prevention)
CREATE TABLE IF NOT EXISTS student_identities (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  identity_type TEXT NOT NULL DEFAULT 'AADHAAR',
  identity_number_hash TEXT UNIQUE NOT NULL,
  identity_number_masked TEXT NOT NULL,
  full_name TEXT NOT NULL,
  institution TEXT NOT NULL,
  verification_status TEXT DEFAULT 'VERIFIED' CHECK(verification_status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  verified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_identities_hash ON student_identities(identity_number_hash);

-- 6. Student Skills Table (Self-declared vs Verified via 3-Stage Assessment)
CREATE TABLE IF NOT EXISTS student_skills (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  is_verified INTEGER DEFAULT 0 CHECK(is_verified IN (0, 1)),
  proficiency INTEGER DEFAULT 50,
  overall_score REAL DEFAULT 0,
  easy_score REAL DEFAULT 0,
  medium_score REAL DEFAULT 0,
  hard_score REAL DEFAULT 0,
  strong_areas TEXT,
  weak_areas TEXT,
  improvement_recommendations TEXT,
  proficiency_level TEXT DEFAULT 'Beginner',
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, skill_name),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_student_skills_user ON student_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_student_skills_name ON student_skills(skill_name);

-- 7. Skill Assessment Attempts (Dynamic 3-Stage Assessments)
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  current_stage INTEGER DEFAULT 1 CHECK(current_stage IN (1, 2, 3, 4)),
  questions_data TEXT NOT NULL,
  answers_data TEXT,
  easy_score REAL DEFAULT 0,
  medium_score REAL DEFAULT 0,
  hard_score REAL DEFAULT 0,
  overall_score REAL DEFAULT 0,
  status TEXT DEFAULT 'IN_PROGRESS' CHECK(status IN ('IN_PROGRESS', 'COMPLETED', 'FAILED')),
  analysis_data TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_user ON assessment_attempts(user_id);

-- 8. Jobs Table (Recruiter Job Postings)
CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  posted_by_user_id TEXT,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'Internship',
  location TEXT NOT NULL,
  stipend TEXT,
  duration TEXT,
  required_skills TEXT NOT NULL,
  preferred_skills TEXT,
  description TEXT,
  min_score REAL DEFAULT 60,
  status TEXT DEFAULT 'ACTIVE',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (posted_by_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 9. Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  student_user_id TEXT NOT NULL,
  status TEXT DEFAULT 'APPLIED' CHECK(status IN ('APPLIED', 'SHORTLISTED', 'INTERVIEW', 'HIRED', 'REJECTED')),
  match_score REAL DEFAULT 0,
  qualification_state TEXT NOT NULL CHECK(qualification_state IN ('PERFECTLY_QUALIFIED', 'QUALIFIED', 'NEEDS_IMPROVEMENT')),
  custom_note TEXT,
  applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, student_user_id),
  FOREIGN KEY (student_user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE
);

-- 10. User Notifications Table
CREATE TABLE IF NOT EXISTS user_notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'INFO' CHECK(type IN ('INFO', 'SUCCESS', 'WARNING', 'ALERT')),
  link TEXT,
  is_read INTEGER DEFAULT 0 CHECK(is_read IN (0, 1)),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_user_notifications_user ON user_notifications(user_id);

-- 11. Recruiter Document Verification Table
CREATE TABLE IF NOT EXISTS recruiter_verifications (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  degree_certificate_url TEXT,
  degree_name TEXT,
  experience_certificate_url TEXT,
  years_of_experience INTEGER DEFAULT 5,
  professional_certification_url TEXT,
  certification_name TEXT,
  domain TEXT NOT NULL,
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'VERIFIED', 'REJECTED')),
  verified_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Recruiter Qualification Assessments Table
CREATE TABLE IF NOT EXISTS recruiter_assessments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  domain TEXT NOT NULL,
  questions_data TEXT NOT NULL,
  answers_data TEXT,
  score REAL DEFAULT 0,
  status TEXT DEFAULT 'PENDING' CHECK(status IN ('PENDING', 'PASSED', 'FAILED')),
  completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 13. Legacy Profiles (Preserved for extensibility)
CREATE TABLE IF NOT EXISTS academician_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  institution TEXT NOT NULL,
  department TEXT NOT NULL,
  designation TEXT NOT NULL,
  experience TEXT NOT NULL,
  specialization TEXT NOT NULL,
  phone TEXT,
  publications_count INTEGER DEFAULT 28,
  patents_count INTEGER DEFAULT 3,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS educational_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT UNIQUE NOT NULL,
  institution_name TEXT NOT NULL,
  dean_name TEXT NOT NULL,
  accreditation TEXT NOT NULL,
  website TEXT,
  total_students INTEGER DEFAULT 4280,
  total_faculty INTEGER DEFAULT 186,
  industry_partners INTEGER DEFAULT 74,
  placements_this_year INTEGER DEFAULT 892,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 14. Audit Log / Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  details TEXT,
  ip_address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
