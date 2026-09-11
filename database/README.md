# Academia Database Architecture

This directory houses the relational SQLite database architecture for the **Academia** platform (Tech Vaders / SIH26044).

---

## 📁 Directory Structure

```text
database/
├── academia.sqlite           # Active SQLite database file (WAL mode enabled)
├── schemas/
│   └── database.sql          # Primary relational DDL schema with constraints & indexes
├── migrations/
│   └── 001_initial_schema.sql# Initial versioned migration
├── seeders/
│   └── seed_default_users.js # Native Node 24 SQLite seeder for default demo accounts
└── README.md                 # Database setup & reference guide
```

---

## 🗄️ Relational Schema Overview

### 1. `users` Table
Central authentication table storing credentials, status, and stakeholder role.
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `email` (TEXT UNIQUE NOT NULL, lowercase indexed)
- `password_hash` (TEXT NOT NULL, bcrypt 10 rounds)
- `role` (TEXT CHECK `STUDENT`, `INDUSTRY_RECRUITER`, `ACADEMICIAN`, `EDUCATIONAL_INSTITUTION`)
- `status` (TEXT CHECK `ACTIVE`, `PENDING_VERIFICATION`, `SUSPENDED`)
- `email_verified` (INTEGER DEFAULT 0)
- `created_at` / `updated_at` (DATETIME)

### 2. `email_verification_otps` Table
Secure OTP tracking with SHA-256 hashing and expiration safeguards.
- `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
- `email` (TEXT NOT NULL)
- `otp_hash` (TEXT NOT NULL, SHA-256)
- `purpose` (TEXT CHECK `REGISTRATION`, `PASSWORD_RESET`, `EMAIL_CHANGE`)
- `attempts_left` (INTEGER DEFAULT 5)
- `resend_available_at` (DATETIME, 60s cooldown)
- `expires_at` (DATETIME, 10m TTL)
- `consumed` (INTEGER DEFAULT 0)
- `created_at` (DATETIME)

### 3. Role-Specific Profile Tables (1-to-1 Foreign Keys with `ON DELETE CASCADE`)
- **`student_profiles`**: `full_name`, `college_name`, `degree`, `branch`, `graduation_year`, `skills`, `cgpa`, `bio`, `github_url`, `linkedin_url`
- **`industry_profiles`**: `full_name`, `company_name`, `designation`, `industry_domain`, `company_website`, `company_size`, `company_location`, `bio`
- **`academician_profiles`**: `full_name`, `institution_name`, `department`, `designation`, `areas_of_expertise`, `experience_years`, `google_scholar_url`, `bio`
- **`educational_profiles`**: `institution_name`, `institution_code`, `contact_person_name`, `designation`, `official_email`, `nirf_ranking`, `website_url`, `city`, `state`

### 4. `activity_logs` Table
Audit logs for security tracking and compliance.
- `id`, `user_id`, `action`, `ip_address`, `user_agent`, `metadata_json`, `created_at`

---

## 🚀 Running Migrations and Seeders

### Automatic Initialization
When the backend starts (`npm run dev:backend`), it automatically ensures all tables and indexes exist using `database/schemas/database.sql`.

### Manual Seeding
To reset or re-seed the default user credentials:

```bash
# From the project root
npm run seed

# Or directly with Node 24 native SQLite runner
node database/seeders/seed_default_users.js
```

---

## 🔑 Default Seeded Accounts

| Role | Email | Password | Full Name / Entity |
| :--- | :--- | :--- | :--- |
| **Student** | `student@apex.edu` | `Student@123` | Rahul Sharma |
| **Industry Recruiter** | `recruiter@apexdigital.io` | `Recruiter@123` | Sarah Jenkins (Apex Digital Labs) |
| **Academician** | `faculty@apex.edu` | `Faculty@123` | Dr. Ananya Sharma |
| **Educational Admin** | `admin@apex.edu` | `Admin@123` | Apex Institute Admin |
