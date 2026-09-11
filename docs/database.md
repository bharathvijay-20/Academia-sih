# Database Architecture & Entity Relationship Design

**Database Engine: SQLite (Native Node 24 `node:sqlite` / Embedded Relational)**  
**File Location: `database/academia.sqlite`**

---

## 1. Entity-Relationship Overview

```text
       ┌────────────────────────────────────────────────────────┐
       │                         users                          │
       │  • id (PK, TEXT)                                       │
       │  • email (UNIQUE, TEXT)                                │
       │  • password_hash (TEXT)                                │
       │  • role (CHECK: STUDENT/RECRUITER/FACULTY/INSTITUTION) │
       │  • email_verified (INTEGER 0/1)                        │
       │  • created_at (DATETIME)                               │
       └───────┬──────────────┬──────────────┬───────────┬──────┘
               │ 1:1          │ 1:1          │ 1:1       │ 1:1
               ▼              ▼              ▼           ▼
┌──────────────────┐ ┌──────────────────┐ ┌─────────┐ ┌─────────┐
│ student_profiles │ │industry_profiles │ │academic.│ │education│
│ • user_id (FK)   │ │ • user_id (FK)   │ │profiles │ │profiles │
│ • name           │ │ • company_name   │ │• user_id│ │• user_id│
│ • college        │ │ • representative │ │• name   │ │• inst.  │
│ • department     │ │ • designation    │ │• depart.│ │• dean   │
│ • cgpa           │ │ • domain         │ │• special│ │• accred.│
│ • career_goal    │ │ • website        │ │• exp.   │ │• metrics│
└──────────────────┘ └──────────────────┘ └─────────┘ └─────────┘

┌───────────────────────────────────────────────────────────────┐
│                   email_verification_otps                     │
│  • id (PK, TEXT)                                              │
│  • email (INDEXED, TEXT)                                      │
│  • otp_hash (TEXT)                                            │
│  • purpose (CHECK: REGISTRATION / PASSWORD_RESET)             │
│  • expires_at (DATETIME)                                      │
│  • attempts (INTEGER)                                         │
│  • verified_at (DATETIME NULLABLE)                            │
└───────────────────────────────────────────────────────────────┘
```

---

## 2. Table Definitions & Constraints

### `users`
* `id` TEXT PRIMARY KEY
* `email` TEXT UNIQUE NOT NULL COLLATE NOCASE
* `password_hash` TEXT NOT NULL
* `role` TEXT NOT NULL CHECK(role IN ('STUDENT', 'INDUSTRY_RECRUITER', 'ACADEMICIAN', 'EDUCATIONAL_INSTITUTION'))
* `email_verified` INTEGER DEFAULT 0 CHECK(email_verified IN (0, 1))
* `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
* `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### `email_verification_otps`
* `id` TEXT PRIMARY KEY
* `email` TEXT NOT NULL COLLATE NOCASE
* `otp_hash` TEXT NOT NULL
* `purpose` TEXT NOT NULL CHECK(purpose IN ('REGISTRATION', 'PASSWORD_RESET'))
* `expires_at` DATETIME NOT NULL
* `attempts` INTEGER DEFAULT 0
* `verified_at` DATETIME NULL
* `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP

### `student_profiles`
* `id` TEXT PRIMARY KEY
* `user_id` TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
* `name` TEXT NOT NULL
* `avatar` TEXT
* `phone` TEXT
* `college` TEXT NOT NULL
* `department` TEXT NOT NULL
* `year` TEXT NOT NULL
* `graduation_year` TEXT NOT NULL
* `cgpa` REAL NOT NULL DEFAULT 8.5
* `location` TEXT
* `career_goal` TEXT NOT NULL
* `bio` TEXT
* `profile_completion` INTEGER DEFAULT 88
* `skill_readiness` INTEGER DEFAULT 74

---

## 3. Seeded Accounts for Testing

| Role | Email | Password | Representative |
|---|---|---|---|
| **Student** | `student@apex.edu` | `Student@123` | Rahul Sharma (B.Tech CSE) |
| **Industry Recruiter** | `recruiter@apexdigital.io` | `Recruiter@123` | Vikram Singhania (VP Engineering) |
| **Academician** | `faculty@apex.edu` | `Faculty@123` | Dr. Ananya Sharma (Prof. CSE) |
| **Institution Admin** | `admin@apex.edu` | `Admin@123` | Dr. Rajeshwar Rao (Dean & Principal) |
