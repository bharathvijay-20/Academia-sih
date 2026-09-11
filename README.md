# 🎓 ACADEMIA — AI-Powered Academia–Industry Collaboration Platform
**Team Tech Vaders | SIH Problem Statement ID: SIH26044**

An integrated, full-stack, AI-powered collaboration ecosystem connecting **Students**, **Industry Recruiters**, **Academicians**, and **Educational Institutions**.

---

## 🌟 Key Platform Features

1. **4 Role-Specific Portals & Dedicated Dashboards**:
   - 🎓 **Student Portal**: Skill Passport, Gap Simulator, Job & Problem Matcher, Mentorship, Assessment Engine.
   - 🏢 **Industry Portal**: Talent Discovery, Live Project & Problem Posting, Candidate Evaluation, 5-Star Mentor Reviews.
   - 🔬 **Academician Portal**: Industry Connect, FDP Requests, Curriculum Co-Creation, Joint Research & Mentorship.
   - 🏛️ **Educational Institution Portal**: Skill Gap Heatmap, Institutional Analytics, Closed-Loop Bootcamp Generator.
2. **Robust Multi-Role Authentication & Authorization (RBAC)**:
   - Secure email verification with 6-digit cryptographic OTPs (SHA-256 hashed, 10-minute TTL, 60s cooldown).
   - Bcrypt password hashing (10 salt rounds).
   - JWT session management with automated bearer token injection.
   - Strict client & server route guards (HTTP 403 Forbidden on role mismatch).
   - 1-Click Quick Demo Login for instant testing across all 4 stakeholders.
3. **Clean Decoupled Architecture**:
   - `frontend/`: React 18 SPA with React Router 6, Tailwind CSS, Lucide Icons, and responsive design.
   - `backend/`: Node.js Express REST API, native SQLite data access, modular services & controllers.
   - `database/`: Relational SQLite database (`database/academia.sqlite`), versioned migrations, and automated seeders.
   - `docs/`: In-depth API, database schema, and authentication architecture documentation.

---

## 🏛️ Project Directory Structure

```text
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── config/           # Database & JWT configurations
│   │   ├── controllers/      # Request handlers & validation
│   │   ├── middleware/       # JWT auth & RBAC route guards
│   │   ├── routes/           # Role-specific & auth API endpoints
│   │   ├── services/         # Business logic (Auth, OTP, Email)
│   │   ├── utils/            # Crypto OTP generator & bcrypt helpers
│   │   └── server.js         # Server bootstrap
│   └── package.json
├── database/                 # Relational Database Layer
│   ├── schemas/              # SQL schema definition (database.sql)
│   ├── migrations/           # Versioned migrations
│   ├── seeders/              # Native SQLite seed scripts
│   ├── academia.sqlite       # Database file
│   └── README.md
├── docs/                     # Technical Documentation
│   ├── authentication.md     # Auth & OTP flowcharts + security specs
│   ├── database.md           # ER diagram & table definitions
│   └── api.md                # Full REST API endpoint reference
├── frontend/                 # React 18 + Vite SPA
│   ├── src/
│   │   ├── auth/             # AuthContext & Session management
│   │   ├── components/       # UI, Layout (Navbar, Sidebar), Modals
│   │   ├── context/          # Global application state
│   │   ├── data/             # Curated mock data & industry taxonomy
│   │   ├── layouts/          # DashboardLayout shell
│   │   ├── pages/            # Role dashboards & auth pages
│   │   ├── routes/           # React Router & ProtectedRoute guards
│   │   └── services/         # Axios/Fetch API client
│   └── package.json
├── .env.example              # Sample environment configuration
├── package.json              # Root runner (concurrently)
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (Node 24 recommended)
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install all root and workspace dependencies:

```bash
git clone <repository-url>
cd "Hackthon project-Academia"

# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment Variables
Copy `.env.example` to `backend/.env` (and adjust if using custom SMTP settings):

```bash
cp .env.example backend/.env
```

### 3. Seed Default Demo Accounts
Populate the database with default verified users:

```bash
npm run seed
```

### 4. Start Full-Stack Development Servers
Run both backend (`http://localhost:5000`) and frontend (`http://localhost:5173`) concurrently:

```bash
npm run dev
```

---

## 🔑 Default Demo Credentials

| Role | Email | Password | Full Name / Institution |
| :--- | :--- | :--- | :--- |
| 🎓 **Student** | `student@apex.edu` | `Student@123` | Rahul Sharma |
| 🏢 **Industry Recruiter** | `recruiter@apexdigital.io` | `Recruiter@123` | Sarah Jenkins (Apex Digital Labs) |
| 🔬 **Academician** | `faculty@apex.edu` | `Faculty@123` | Dr. Ananya Sharma |
| 🏛️ **Educational Admin** | `admin@apex.edu` | `Admin@123` | Apex Institute Admin |

*Note: You can also use the **"Quick Demo Login"** buttons on the `/login` page for instant 1-click access.*

---

## 🛡️ Authentication & Security Flows

1. **Multi-Step Registration with Email OTP**:
   - **Step 1 (Role Selection)**: Choose between Student, Industry, Academician, or Educational Institution.
   - **Step 2 (Email & OTP)**: Submit email ➔ Receive 6-digit cryptographic OTP (logged to console / email) ➔ Verify OTP with auto-focusing inputs and 60-second cooldown timer.
   - **Step 3 (Password Creation)**: Create strong password with live strength indicator.
   - **Step 4 (Profile Details)**: Fill role-specific profile parameters (e.g. CGPA, domain, institution code).
   - **Step 5 (Confirmation)**: Automatic redirect to role dashboard with JWT token.
2. **Role-Based Access Control (RBAC)**:
   - Server-side middleware verifies JWT and rejects unauthorized role requests with `403 Forbidden`.
   - Client-side `<ProtectedRoute allowedRoles={[...]}>` intercepts unauthorized URL access and redirects to `/unauthorized`.

---

## 📖 Detailed Documentation

- 📄 [Authentication & Security Specs](file:///d:/Hackthon%20project-Academia/docs/authentication.md)
- 🗄️ [Database Schema & ER Diagrams](file:///d:/Hackthon%20project-Academia/docs/database.md)
- 🌐 [REST API Reference](file:///d:/Hackthon%20project-Academia/docs/api.md)
- 💾 [Database Setup & Management](file:///d:/Hackthon%20project-Academia/database/README.md)
