# 🎓 ACADEMIA — Beginner's Complete Project & Architecture Guide
**AI-Powered Academia–Industry Collaboration Ecosystem (Tech Vaders | SIH26044)**

Welcome to **ACADEMIA**! This guide is written specifically to help beginners, developers, evaluators, and students understand **what this project is, why it was created, how every part works, and how the codebase is constructed from start to finish.**

---

## 📌 Table of Contents
1. [🌟 What is ACADEMIA? (The Big Picture)](#1--what-is-academia-the-big-picture)
2. [💡 The Problem We Solve](#2--the-problem-we-solve)
3. [🚀 Key Features & Modules Explained Simply](#3--key-features--modules-explained-simply)
   - [A. Student Workspace](#a-student-workspace)
   - [B. Recruiter / Industry Workspace](#b-recruiter--industry-workspace)
4. [🛠️ Tech Stack & Architecture](#4--tech-stack--architecture)
5. [🗄️ Database Design Made Easy](#5--database-design-made-easy)
6. [🔄 End-to-End User Journeys (How it Works)](#6--end-to-end-user-journeys-how-it-works)
7. [📂 Codebase Tour (File-by-File Breakdown)](#7--codebase-tour-file-by-file-breakdown)
8. [⚡ Quick Start & How to Run the Project](#8--quick-start--how-to-run-the-project)
9. [🔑 Demo Login Credentials](#9--demo-login-credentials)
10. [❓ Beginner FAQ](#10--beginner-faq)

---

## 1. 🌟 What is ACADEMIA? (The Big Picture)

**ACADEMIA** is an integrated full-stack web application designed to bridge the gap between college education and industry hiring demands.

In simple terms:
- **Students** often graduate with theoretical degrees but struggle to prove their practical coding skills to employers.
- **Recruiters** spend months filtering through thousands of resumes where candidates self-declare skills without verified proof.

ACADEMIA solves this by acting as a **verified competence and skill verification platform**. Instead of relying on claims on a PDF resume, students take dynamic 3-stage assessments, learn from integrated tutorials, and earn an **Evidence-Backed Verified Skill Passport**. Recruiters can then discover and hire candidates ranked purely on objective, verified ability.

---

## 2. 💡 The Problem We Solve

```text
Traditional Hiring:
[Student writes "Expert in Java" on Resume] ──> [Recruiter doubts claim] ──> [Lengthy Screening / Rejections]

ACADEMIA Ecosystem:
[Student Learns on Platform] ──> [Takes 3-Stage Assessment] ──> [Earns Verified Skill Badge] ──> [Recruiter Hires Top Scorer Instantly]
```

### Key Differences:
| Feature | Traditional Platforms | ACADEMIA |
|---|---|---|
| **Skill Claims** | Unverified self-declarations | Verified via 3-stage assessments (MCQ + Code + Real-World) |
| **Skill Improvement** | External third-party searching | Built-in Learning Hub with live sandboxes & practice |
| **Internship Applications** | Anyone applies blindly | Prerequisite lock: Unlocks only when required skills are verified |
| **Candidate Discovery** | Keyword match on text resumes | Objective ranking based on verified test scores |

---

## 3. 🚀 Key Features & Modules Explained Simply

### A. Student Workspace

1. **Verified Skill Passport**:
   - Displays all skills the student possesses.
   - Clearly marks skills as **"Verified"** (with score and date) or **"Self-Declared"**.
   - Shows detailed breakdown: Easy score (MCQs), Medium score (Coding test cases), and Hard score (System architecture).

2. **3-Stage Dynamic Skill Assessments**:
   - **Stage 1 (MCQs & Syntax)**: Tests core syntax, time complexity, and concepts.
   - **Stage 2 (Coding & Algorithms)**: Hands-on code editor where code runs against edge cases.
   - **Stage 3 (Real-World Systems)**: Practical scenarios (e.g. concurrency, database indexing, REST APIs).
   - Once completed, the badge is officially awarded and added to the candidate profile.

3. **Learning Hub**:
   - Curated skill tracks across **Algorithms & DSA, Java, SQL, Python, React.js, C++, Git, MySQL, and AI**.
   - Includes interactive roadmap chapters and live code playground links.
   - Provides personalized recommendations based on the student's identified weak areas.

4. **Placement Prep & Diagnostic Tests**:
   - Offers practice tests in **Aptitude & Logical Reasoning** and **Core Coding Concepts**.
   - Pinpoints strengths and weak topics to boost student confidence before placement drives.

5. **Job Search & Matching + Internship Packages**:
   - Analyzes student verified skills against job requirements.
   - **Smart Prerequisite Locking**: If a job requires Java (80%) and SQL (75%), the "Apply" button is disabled until the student meets the criteria, preventing unqualified rejections.

6. **Application Tracker**:
   - Live dashboard showing all submitted applications, current statuses (`Under Review`, `Shortlisted`, `Interview Scheduled`), and timestamps.

---

### B. Recruiter / Industry Workspace

1. **Candidate Discovery & Skill Ranking**:
   - Search and discover top candidates ranked strictly by their verified test scores.
   - Filter by specific skill (e.g. Java, SQL) or minimum score threshold (e.g. Min 80%).
   - Displays candidate details: Name, College, Department, CGPA, and verified evidence scores.

2. **Post Job / Internship Opening**:
   - Form to publish new listings specifying title, location, stipend, required skills, and minimum cutoff score.
   - Immediately notifies matching qualified students on the platform.

3. **Candidate Applications Pipeline**:
   - Review incoming job applications with verified skill scores attached to each applicant.

---

## 4. 🛠️ Tech Stack & Architecture

The application is built using a modern, decoupled client-server architecture:

```text
┌─────────────────────────────────────────────────────────────┐
│                       REACT 18 SPA (Vite)                   │
│   • Tailwind CSS (Glassmorphic dark design)                 │
│   • React Router 6 (Protected RBAC Routes)                  │
│   • Lucide React (Modern iconography)                       │
│   • AuthContext (JWT session management)                    │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTPS / JSON REST API
┌──────────────────────────────▼──────────────────────────────┐
│                    NODE.JS EXPRESS REST API                 │
│   • Controllers & Services Architecture                     │
│   • JWT Authentication & RBAC Middleware                    │
│   • Bcryptjs Password Hashing (10 Salt Rounds)              │
│   • Dynamic Question Bank Generator                         │
└──────────────────────────────┬──────────────────────────────┘
                               │ Native SQLite Client
┌──────────────────────────────▼──────────────────────────────┐
│                   SQLITE RELATIONAL DATABASE                │
│   • database/academia.sqlite (WAL mode enabled)             │
│   • Structured Schemas, Foreign Keys & Seeders              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Breakdown:
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, React Router v6.
- **Backend**: Node.js, Express.js REST API.
- **Database**: Native SQLite (`academia.sqlite`) with WAL mode for fast concurrent reads and writes.
- **Security**: JSON Web Tokens (JWT), Bcrypt password hashing.

---

## 5. 🗄️ Database Design Made Easy

The database uses relational tables to store all user and platform data:

| Table Name | Purpose | Key Columns |
|---|---|---|
| `users` | Base account for authentication | `id`, `email`, `password_hash`, `role`, `email_verified` |
| `student_profiles` | Student profile information | `user_id`, `name`, `college`, `department`, `cgpa`, `year` |
| `industry_profiles` | Recruiter & company information | `user_id`, `company_name`, `representative_name`, `designation` |
| `student_skills` | Verified and self-declared skills | `user_id`, `skill_name`, `is_verified`, `overall_score`, `strong_areas` |
| `assessment_attempts` | History of tests taken | `user_id`, `skill_name`, `easy_score`, `medium_score`, `overall_score` |
| `job_postings` | Jobs created by recruiters | `id`, `user_id`, `title`, `company_name`, `required_skills`, `stipend` |
| `job_applications` | Applications submitted by students | `id`, `job_id`, `student_user_id`, `status`, `applied_at` |

---

## 6. 🔄 End-to-End User Journeys (How it Works)

### Journey 1: The Student Flow
1. **Sign Up / Login**: Student visits `/login`, enters email & password (or creates a new profile).
2. **Review Skill Passport**: Checks verified vs unverified skills on `/student/dashboard`.
3. **Bridge Skill Gaps**: If missing SQL or Java, opens the **Learning Hub** to review syntax and code sandboxes.
4. **Take 3-Stage Assessment**: Completes the assessment; score is evaluated and verified badge is awarded.
5. **Apply for Internship**: The job prerequisite unlocks; student clicks **Apply Now** with evidence attached.
6. **Track Application**: Monitors application status in the Application Tracker.

### Journey 2: The Recruiter Flow
1. **Sign In**: Recruiter logs in at `/login`.
2. **Discover Talent**: Opens **Candidate Discovery** to view the top-ranked candidates sorted by verified skill scores.
3. **Post Opportunity**: Fills out the job posting form with required skills and minimum score.
4. **Review Candidates**: Inspects incoming applications with verified score breakdowns.

---

## 7. 📂 Codebase Tour (File-by-File Breakdown)

```text
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Native SQLite connection & schema initializer
│   │   │   └── jwt.js             # JWT secret and expiration config
│   │   ├── controllers/
│   │   │   ├── authController.js  # Handles login, registration, and profile endpoints
│   │   │   ├── studentController.js # Handles skill verification, tests, and jobs
│   │   │   └── industryController.js# Handles candidate discovery and job posting
│   │   ├── middleware/
│   │   │   └── authenticateToken.js # JWT verification and RBAC route protection
│   │   ├── routes/
│   │   │   ├── authRoutes.js      # /api/auth/* endpoints
│   │   │   ├── studentRoutes.js   # /api/student/* endpoints
│   │   │   └── industryRoutes.js  # /api/industry/* endpoints
│   │   ├── services/
│   │   │   ├── authService.js     # User registration, password hashing, and login logic
│   │   │   ├── studentService.js  # Student dashboard data, skill evaluations, and jobs
│   │   │   └── industryService.js # Candidate discovery ranking and application pipeline
│   │   └── server.js              # Express app bootstrap & route registration
├── database/
│   ├── schemas/database.sql       # Relational SQL table definitions
│   ├── seeders/seed_default_users.js # Seeds demo students, recruiters, and skills
│   └── academia.sqlite            # Active SQLite database file
├── frontend/
│   ├── src/
│   │   ├── auth/
│   │   │   └── AuthContext.jsx    # React Context for login, register, and JWT token state
│   │   ├── components/
│   │   │   ├── landing/LandingPage.jsx # Clean Intro / Landing page
│   │   │   ├── student/StudentDashboard.jsx # Full Student Portal (Learning Hub, Tests, Passport)
│   │   │   ├── industry/IndustryDashboard.jsx # Full Recruiter Portal (Discovery, Job Posting)
│   │   │   └── layout/Sidebar.jsx # Sidebar navigation drawer
│   │   ├── pages/
│   │   │   └── auth/LoginPage.jsx # Unified Email/Password Sign In & Sign Up page
│   │   ├── routes/
│   │   │   ├── AppRoutes.jsx      # Top-level React Router routes
│   │   │   └── ProtectedRoute.jsx # Role-based route guard
│   │   └── services/
│   │       ├── api.js             # Fetch wrapper with automated JWT Bearer token injection
│   │       ├── authService.js     # Frontend auth API calls
│   │       ├── studentService.js  # Frontend student API calls
│   │       └── industryService.js # Frontend recruiter API calls
├── LOGIN_CREDENTIALS.md           # Login credentials reference sheet
└── README.md                      # Project summary and quick start
```

---

## 8. ⚡ Quick Start & How to Run the Project

### 1. Prerequisites
- **Node.js** (v18 or higher installed on your machine)
- **npm** (included with Node.js)

### 2. Start Both Backend & Frontend Concurrently
From the project root folder (`Hackthon project-Academia`), simply run:

```bash
npm run dev
```

This will automatically start:
- 🚀 **Backend Server**: `http://localhost:5000`
- 💻 **Frontend Web App**: `http://localhost:5173`

Open your browser and navigate to `http://localhost:5173` to explore the application!

---

## 9. 🔑 Demo Login Credentials

You can log in with any of the following pre-configured verified accounts:

### 🎓 Verified Students
| Name | Email | Password | Role / Details |
|---|---|---|---|
| **Priya Iyer** (Rank #1) | `priya.iyer@apex.edu` | `Student@123` | Java: 92%, Spring Boot: 88%, SQL: 85% (CGPA: 9.12) |
| **Arun** (Rank #2) | `arun@apex.edu` | `Student@123` | Java: 85%, Spring Boot: 85%, SQL: 85% (CGPA: 8.70) |
| **Rahul Sharma** | `student@apex.edu` | `Student@123` | Java: 82%, SQL: 80%, Spring Boot: 74% (CGPA: 8.84) |

### 🏢 Industry Recruiter
| Name | Email | Password | Role / Details |
|---|---|---|---|
| **Vikram Singhania** | `recruiter@apexdigital.io` | `Recruiter@123` | VP of Engineering, Apex Digital Labs |

*Tip: You can also create any brand new account by clicking **Sign Up** on the [Login Page](http://localhost:5173/login)!*

---

## 10. ❓ Beginner FAQ

### Q1: Where is data stored? Do I need to install MySQL or MongoDB?
**A**: No! The project uses an embedded, high-performance **SQLite database** (`database/academia.sqlite`). It requires zero external database installation or setup; it runs out-of-the-box on Node.js!

### Q2: How does the application know if I am logged in?
**A**: When you log in, the server generates a signed **JSON Web Token (JWT)**. The frontend stores this token in browser `localStorage` and automatically sends it in the `Authorization: Bearer <token>` header on every subsequent request.

### Q3: How do the skill prerequisite locks work?
**A**: When a student browses internship packages, the system compares the student's verified skill scores in the database with the job's minimum score requirements. If any required skill is missing or below the cutoff, the "Apply" button is disabled and displays the specific missing skill to study.

### Q4: How do I create a new student from scratch?
**A**: Go to `/login`, click **Sign Up**, choose **Student**, enter your name, email, password, college, and CGPA, and click **Create Profile & Sign In**. You will immediately enter your fresh, personalized dashboard!

---

**ACADEMIA — Empowering Future Engineers with Verified Competency.**
*Developed for Smart India Hackathon (SIH26044) by Team Tech Vaders.*
