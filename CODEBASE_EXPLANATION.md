# ACADEMIA AI ECOSYSTEM — Comprehensive Codebase & Architecture Guide

Welcome to the comprehensive code walkthrough for the **Academia AI Ecosystem** (SIH26044). This document explains every folder, file, module, service, algorithm, and data structure across the entire application.

---

## 1. High-Level Architecture Overview

The Academia Ecosystem is designed as a **decoupled, full-stack client-server architecture**:

```
+-------------------------------------------------------------------------+
|                           FRONTEND CLIENT                               |
|   React 19 + Vite + Tailwind CSS (Cyberpunk Glassmorphic Dark Theme)    |
|                                                                         |
|  +----------------+  +-------------------+  +-----------------------+   |
|  |  Landing Page  |  | Student Workspace |  |  Industry Workspace   |   |
|  +----------------+  +-------------------+  +-----------------------+   |
|  +----------------+  +-------------------+  +-----------------------+   |
|  | AI Modal Suite |  | Placement Prep Hub|  | 3-Stage Assessment UI |   |
|  +----------------+  +-------------------+  +-----------------------+   |
|                                                                         |
|       +---------------------------------------------------------+       |
|       | Resilient Service Layer (Axios + Seamless Mock Fallback) |       |
|       +---------------------------------------------------------+       |
+------------------------------------+------------------------------------+
                                     |  HTTP REST / Bearer JWT
+------------------------------------v------------------------------------+
|                           BACKEND SERVER                                |
|             Node.js + Express REST API (Modular Architecture)           |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | Middleware: authenticateToken.js (JWT) + authorizeRoles.js (RBAC) |  |
|  +-------------------------------------------------------------------+  |
|  | Controllers & Routes:                                             |  |
|  |  * authRoutes.js        * studentRoutes.js    * industryRoutes.js |  |
|  |  * academicianRoutes.js * institutionRoutes.js                    |  |
|  +-------------------------------------------------------------------+  |
|  | Core Engines & Services:                                          |  |
|  |  * questionBankService.js (3-Stage Assessment Engine)             |  |
|  |  * studentService.js      (Skill Passport & Matching Logic)       |  |
|  |  * industryService.js     (Candidate Ranking & Scoring)           |  |
|  |  * authService.js         (Bcrypt + JWT Issue)                    |  |
|  |  * otpService.js          (6-Digit Verification Engine)           |  |
|  +-------------------------------------------------------------------+  |
+------------------------------------+------------------------------------+
                                     |
+------------------------------------v------------------------------------+
|                         DATABASE STORAGE                                |
|        PostgreSQL (Neon Cloud / Local) + In-Memory Fallback             |
+-------------------------------------------------------------------------+
```

---

## 2. Directory Structure Tree

```
Hackthon project-Academia/
|-- backend/                       # Node.js & Express REST Backend
|   |-- src/
|   |   |-- config/                # Database pool & JWT secrets
|   |   |   |-- db.js              # PostgreSQL connection pool with fallback
|   |   |   `-- jwt.js             # Token signature constants
|   |   |-- controllers/           # HTTP Request Controllers
|   |   |   `-- authController.js  # Register, login, OTP & reset handlers
|   |   |-- middleware/            # Security & Access Control
|   |   |   |-- authenticateToken.js # Validates Authorization Bearer header
|   |   |   `-- authorizeRoles.js    # Enforces STUDENT vs RECRUITER permissions
|   |   |-- routes/                # API Endpoints
|   |   |   |-- authRoutes.js        # /api/auth/*
|   |   |   |-- studentRoutes.js     # /api/student/*
|   |   |   |-- industryRoutes.js    # /api/industry/*
|   |   |   |-- academicianRoutes.js # /api/academician/*
|   |   |   `-- institutionRoutes.js # /api/institution/*
|   |   |-- services/              # Core Business & Grading Logic
|   |   |   |-- authService.js         # User password validation & token creation
|   |   |   |-- studentService.js      # Student profile, skills, scoring & matching
|   |   |   |-- industryService.js     # Candidate discovery & ranking algorithms
|   |   |   |-- questionBankService.js # 3-stage question bank & test case evaluator
|   |   |   |-- otpService.js          # Temporary OTP cache & verification
|   |   |   `-- emailService.js        # Simulated email dispatcher
|   |   |-- utils/
|   |   |   |-- passwordHasher.js  # Bcrypt wrapper functions
|   |   |   `-- otpGenerator.js    # 6-digit numeric generator
|   |   `-- server.js              # Express entry point & shutdown handlers
|   `-- package.json
|
|-- frontend/                      # React 19 + Vite Frontend
|   |-- src/
|   |   |-- auth/                  # Authentication Context & Guards
|   |   |   `-- AuthContext.jsx    # User session, JWT in localStorage, login/logout
|   |   |-- context/               # Global Application State
|   |   |   `-- AppContext.jsx     # Modals, live notifications, real-time filters
|   |   |-- routes/                # Client Routing
|   |   |   |-- AppRoutes.jsx      # Route definitions & page tree
|   |   |   `-- ProtectedRoute.jsx # Role-based route guard
|   |   |-- layouts/
|   |   |   `-- DashboardLayout.jsx# Shared header, navigation & footer wrapper
|   |   |-- components/
|   |   |   |-- landing/
|   |   |   |   `-- LandingPage.jsx     # Intro page with 2 workspace doors
|   |   |   |-- layout/
|   |   |   |   |-- Navbar.jsx          # Header with role badge, alerts, user menu
|   |   |   |   `-- Sidebar.jsx         # Collapsible sliding module navigation
|   |   |   |-- student/
|   |   |   |   `-- StudentDashboard.jsx# 3-Stage Assessment, Passport, Placement Hub
|   |   |   |-- industry/
|   |   |   |   `-- IndustryDashboard.jsx# Candidate ranking, job posting, screening
|   |   |   |-- ai/
|   |   |   |   `-- AIAssistantModal.jsx # Resume parser, JD extractor, counselor
|   |   |   |-- faculty/
|   |   |   |   `-- FacultyDashboard.jsx
|   |   |   `-- institution/
|   |   |       `-- InstitutionDashboard.jsx
|   |   |-- pages/auth/
|   |   |   |-- LoginPage.jsx          # Multi-role login + sign-up profile creation
|   |   |   |-- RegisterPage.jsx       # 4-step wizard with email OTP verification
|   |   |   |-- ForgotPasswordPage.jsx # Password recovery flow
|   |   |   `-- UnauthorizedPage.jsx   # 403 Forbidden screen
|   |   |-- services/                  # Dual-Layer API Service Adapters
|   |   |   |-- api.js                 # Axios instance with auth interceptor
|   |   |   |-- authService.js         # Client auth requests
|   |   |   |-- studentService.js      # Student endpoints + offline mock engine
|   |   |   `-- industryService.js     # Recruiter endpoints + offline mock engine
|   |   |-- index.css                  # Tailwind styles & glassmorphism system
|   |   |-- App.jsx                    # Root component
|   |   `-- main.jsx                   # React DOM render entry
|   |-- index.html
|   |-- vite.config.js
|   `-- package.json
|
|-- docs/                          # Comprehensive Documentation Guides
|   |-- PROJECT_GUIDE.md           # Full beginner explanation & feature breakdown
|   |-- HOW_TO_RUN.md              # Setup & troubleshooting on any machine
|   |-- LOGIN_CREDENTIALS.md       # Pre-configured demo logins
|   |-- api.md                     # REST API reference
|   |-- authentication.md          # JWT & RBAC explanation
|   `-- database.md                # PostgreSQL schema & relationships
`-- package.json                   # Root orchestrator scripts (concurrently)
```

---

## 3. Detailed Backend Code Breakdown

### 3.1 `backend/src/server.js` — Server Entry Point
- **Purpose**: Initializes the Express application, applies security middlewares, mounts all API routes, and binds the HTTP server to port `5000`.
- **Key Mechanics**:
  - `cors({ origin: '*' })`: Enables cross-origin requests from the Vite frontend on port `5173`.
  - `express.json()`: Parses incoming JSON request payloads.
  - **Graceful Shutdown**: Listens for `SIGINT` (Ctrl+C) and `SIGTERM` signals, cleanly terminating ongoing socket connections before shutting down the process to prevent port locking.

---

### 3.2 `backend/src/middleware/` — Security & RBAC
1. **`authenticateToken.js`**:
   - Inspects the incoming HTTP `Authorization` header for `Bearer <JWT_TOKEN>`.
   - Uses `jwt.verify()` with the secret key to decode user identity `{ id, email, role }`.
   - Attaches `req.user` to the request object for downstream controllers.
   - If missing or invalid, immediately halts execution with HTTP `401 Unauthorized` or `403 Forbidden`.

2. **`authorizeRoles.js`**:
   - Higher-order middleware taking an array of allowed roles (e.g. `authorizeRoles('STUDENT')` or `authorizeRoles('INDUSTRY_RECRUITER')`).
   - Checks if `req.user.role` matches the required permission, rejecting unauthorized requests with a `403 Access Denied` JSON error.

---

### 3.3 `backend/src/services/questionBankService.js` — 3-Stage Assessment Engine
- **Purpose**: Houses the adaptive question bank and grading algorithms for dynamic skill certification.
- **The 3 Stages of Assessment**:
  1. **Stage 1: Foundational MCQs (10 Questions)**
     - Tests syntax, algorithmic complexity, language internals, and theoretical mastery.
     - Automatically graded via exact key match.
  2. **Stage 2: Algorithmic Programming & Test-Cases (5 Questions)**
     - Provides function signatures and automated test cases (e.g. `input: [2, 7, 11, 15], target: 9` ➔ `output: [0, 1]`).
     - Includes sample code templates and evaluates test case pass rates.
  3. **Stage 3: Real-World Architectural Challenges (2 Questions)**
     - Scenario-based architecture problems (e.g., Designing distributed caching with Redis & Spring Boot, SQL query optimization for million-row tables).
     - Graded against a comprehensive rubric checking code modularity, edge cases, and performance.
- **Evidence Score Calculation**:
  $$\text{Final Score} = (\text{Stage 1 Score} \times 0.30) + (\text{Stage 2 Score} \times 0.45) + (\text{Stage 3 Score} \times 0.25)$$

---

### 3.4 `backend/src/services/studentService.js` — Skill Passport & Job Matching
- **Purpose**: Powers student portfolio management and the **Career Match Matrix**.
- **Key Logic**:
  - `getStudentDashboard(userId)`: Aggregates student personal profile, declared skills, verified assessment history, active job postings, applied jobs, and unread notifications.
  - `declareSkill(userId, skillName)`: Adds a new candidate skill in `Self-Declared` status awaiting 3-stage assessment verification.
  - `submitAssessmentAttempt(...)`: Evaluates submitted user answers against `questionBankService`, calculates stage scores, and automatically promotes the skill status to `AI Verified` if the score exceeds 70%.
  - `calculateJobMatch(studentSkills, jobRequiredSkills)`: Compares verified skill percentages against job requirements with weighted importance (Core vs Preferred), computing an explainable readiness percentage (e.g. `94% Ready`).

---

### 3.5 `backend/src/services/industryService.js` — Recruiter Discovery Engine
- **Purpose**: Powers candidate search, qualification scoring, job postings, and applicant tracking.
- **Key Logic**:
  - `getCandidates(filters)`: Queries candidates and dynamically ranks them using their **verified assessment scores** rather than self-proclaimed resume claims.
  - `postJob(recruiterId, jobData)`: Creates a new job posting with mandatory and preferred skill criteria, salary/stipend details, and role descriptions.
  - `updateApplicationStatus(applicationId, status)`: Moves candidates across the recruitment pipeline (`APPLIED` ➔ `SHORTLISTED` ➔ `INTERVIEW_SCHEDULED` ➔ `OFFERED`), triggering automated real-time notifications to the student.

---

### 3.6 `backend/src/controllers/authController.js` — Authentication & OTP
- **`login`**: Verifies email/password against stored hashes via `bcrypt.compare()`. Returns signed JWT token and user profile.
- **`register`**: Creates new user records for either `STUDENT` or `INDUSTRY_RECRUITER` roles.
- **`sendOtp` / `verifyOtp`**: Generates a secure 6-digit numeric OTP valid for 10 minutes for email verification and password resets.

---

## 4. Detailed Frontend Code Breakdown

### 4.1 `frontend/src/auth/AuthContext.jsx` — Session Management
- **Purpose**: Provides a React Context (`useAuth()`) wrapping the entire component tree.
- **State Managed**:
  - `user`: Currently authenticated user object `{ id, name, email, role, profile }`.
  - `token`: JWT string stored in `localStorage.getItem('token')`.
  - `role`: Role string (`STUDENT` | `INDUSTRY_RECRUITER`).
  - `isAuthenticated`: Boolean flag indicating active session.
- **Methods Exposed**: `login(email, password)`, `register(userData)`, `logout()`.

---

### 4.2 `frontend/src/routes/AppRoutes.jsx` & `ProtectedRoute.jsx` — Routing & Guards
- **Structure**:
  - `/` ➔ `LandingPage` (Intro page accessible to all).
  - `/login` ➔ `LoginPage` (Sign In & Profile Creation).
  - `/register` ➔ `RegisterPage` (Multi-step registration wizard).
  - `/forgot-password` ➔ `ForgotPasswordPage`.
  - `/student/dashboard` ➔ Wrapped in `<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>`.
  - `/industry/dashboard` ➔ Wrapped in `<ProtectedRoute allowedRoles={['INDUSTRY_RECRUITER']}><IndustryDashboard /></ProtectedRoute>`.
- If a student tries to navigate to `/industry/dashboard`, `ProtectedRoute` intercepts the request and redirects them to `/unauthorized`.

---

### 4.3 `frontend/src/components/landing/LandingPage.jsx` — Zero-Friction Entry
- **Key UI Elements**:
  - **Single Top-Right Login Button**: Clean direct access to authentication.
  - **Single Hero CTA**: Prominent *"Get Started / Sign In"* button positioned directly beneath the main heading.
  - **Two Integrated Workspace Doors**: Visual cards for **1. Students Workspace** and **2. Industry / Recruiters Workspace** outlining verified competencies and key capabilities.
  - **Key Platform Features Grid**: 4 cards highlighting Verified Skill Passports, 3-Stage Assessments, Explainable Matching, and Talent Discovery.

---

### 4.4 `frontend/src/components/student/StudentDashboard.jsx` — Student Workspace
Contains 8 distinct, comprehensive tabs:
1. **Overview Tab**: Displays overall placement readiness score, verified skills distribution, pending assessments, and matched jobs.
2. **Learning Hub Tab**: Interactive catalog of industry courses, curated study materials, and skill acquisition paths.
3. **Skill Assessments Tab**: Interactive 3-stage testing terminal with stage progression, code editor, automated test case runner, and result analytics.
4. **Placement Prep & Diagnostic Tests Tab**:
   - Comprehensive test engine featuring **Tier-1 Mock Assessments**, **Timed Coding Challenges**, and **Quantitative Aptitude Tests**.
   - Generates **diagnostic concept mastery reports** classifying topics into *Strong Concepts*, *Developing Concepts*, and *Weak Concepts with Target Impact*.
5. **Verified Skill Passport Tab**: Generates the student's tamper-proof skill passport showing objective proof of competence, stage breakdown scores, and cryptographic verification badges.
6. **Job Search & Matching Tab**: Lists open corporate positions with dynamic match matrix scores (e.g. `92% Match`), skill gap explanations, and one-click application submission.
7. **Internship Packages & Offers Tab**: Corporate internship listings with stipends, duration, and direct application routes.
8. **Application Tracker Tab**: Real-time progress tracker showing status (`Applied` ➔ `Under Review` ➔ `Shortlisted` ➔ `Interview`).

---

### 4.5 `frontend/src/components/industry/IndustryDashboard.jsx` — Recruiter Workspace
Contains 4 powerful recruiter modules:
1. **Candidate Discovery Module**:
   - Lists candidate profiles ranked strictly by **verified skill assessment scores**.
   - Filters by skill score threshold (e.g., `Java > 80%`), department, graduation year, and college.
2. **Post Job Opening Module**:
   - Interactive job creation form setting title, department, stipend/salary, work mode, and mandatory skill weighting.
3. **Candidate Applications Module**:
   - Review submitted student applications with their verified evidence scores and update status (`Shortlist`, `Reject`, `Schedule Interview`).
4. **Recruiter Credential Screening**:
   - Security verification panel for corporate recruiters.

---

### 4.6 `frontend/src/components/ai/AIAssistantModal.jsx` — AI Intelligence Suite
Provides 4 integrated AI tools:
1. **Resume Skill Extractor**: Parses raw candidate resume text, extracts technical skills, projects, and CGPA, and syncs verified evidence to the Skill Passport.
2. **Job Description (JD) Parser**: Analyzes unformatted job descriptions and extracts required skills, weights, and evaluation rubrics.
3. **AI Skill Gap Counselor**: Provides tailored 3-step personalized acceleration plans to bridge specific skill deficits for target employers.
4. **Natural Language Candidate Search**: Allows recruiters to query talent in plain English (e.g., *"Find 3rd-year students with Java > 75% and verified backend projects"*).

---

### 4.7 `frontend/src/services/api.js` & Dual-Layer Architecture
- **Purpose**: Ensures the application remains **100% functional and testable** regardless of whether a live backend database is attached.
- **How It Works**:
  1. Calls the Express backend at `http://localhost:5000/api/*` using Axios.
  2. If the backend is running, it returns live PostgreSQL data.
  3. If the backend is offline or disconnected, the service layer gracefully falls back to the in-memory mock engine without throwing errors, ensuring smooth demonstrations.

---

## 5. Summary Table: Technology Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | **React 19** | Modern UI component rendering and reactive state |
| **Build Tool & Bundler** | **Vite** | Lightning-fast HMR and bundle compilation |
| **Styling & Theme** | **Tailwind CSS v4 + Vanilla CSS** | Cyberpunk dark glassmorphism design system |
| **Icons** | **Lucide React** | Scalable, clean vector icons |
| **Celebrations** | **canvas-confetti** | Interactive gamification visual effects |
| **Routing** | **React Router v7** | Client-side declarative routing and role guards |
| **Backend Runtime** | **Node.js** | Server-side JavaScript runtime |
| **API Framework** | **Express 4.x** | RESTful endpoint routing, middleware, controllers |
| **Authentication** | **JSON Web Tokens (JWT)** | Stateless bearer token session security |
| **Password Security** | **Bcrypt.js** | Salted cryptographic password hashing |
| **Database Driver** | **pg (node-postgres)** | PostgreSQL connection pooling |
| **Process Orchestration**| **Concurrently** | Runs backend and frontend in parallel with one command |

---

## 6. How to Run the Entire Project

```powershell
# In the root directory:
npm run dev
```

- **Frontend Access**: Open `http://localhost:5173/` in your browser.
- **Backend API**: Running at `http://localhost:5000/`.
- **Pre-configured Demo Logins**:
  - **Student**: `student@apex.edu` / `student123`
  - **Recruiter**: `recruiter@apex.edu` / `recruiter123`

---

*Authored by Tech Vaders (SIH26044) • Academia AI Collaboration Ecosystem*
