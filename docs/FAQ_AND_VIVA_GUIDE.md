# ACADEMIA AI ECOSYSTEM — Complete FAQ & Interview / Viva Guide
### Both Theoretical & Code-Based Questions with In-Depth Answers

Welcome to the ultimate FAQ and knowledge guide for the **Academia AI Collaboration Ecosystem** (SIH26044). This document covers every fundamental question—from command-line mechanics to core code logic and theoretical architecture.

---

# Table of Contents
1. [Command-Line & Execution FAQs](#1-command-line--execution-faqs)
2. [Architecture & Theoretical Concept FAQs](#2-architecture--theoretical-concept-faqs)
3. [Authentication, Security & RBAC FAQs](#3-authentication-security--rbac-faqs)
4. [3-Stage Skill Assessments & Grading Engine FAQs](#4-3-stage-skill-assessments--grading-engine-faqs)
5. [Frontend & React State Management FAQs](#5-frontend--react-state-management-faqs)
6. [Backend, Database & Dual-Layer Architecture FAQs](#6-backend-database--dual-layer-architecture-faqs)
7. [AI Intelligence Suite & Parsing Algorithms FAQs](#7-ai-intelligence-suite--parsing-algorithms-faqs)
8. [Troubleshooting & Common Errors FAQs](#8-troubleshooting--common-errors-faqs)

---

# 1. Command-Line & Execution FAQs

### Q1.1: Why do we use `npm run dev` in the root folder instead of starting frontend and backend separately?
**Answer:**
In modern full-stack web applications, running frontend and backend in separate terminal tabs is cumbersome and error-prone. 
In our root `package.json`, we use the **`concurrently`** package:
```json
"scripts": {
  "dev": "concurrently -n \"BACKEND,FRONTEND\" -c \"cyan,magenta\" \"npm run dev:backend\" \"npm run dev:frontend\""
}
```
- **What it does**: It spawns two child processes simultaneously under a single master terminal window.
- **Visual Log Stream**: Labels logs with `[BACKEND]` (in cyan) and `[FRONTEND]` (in magenta), allowing real-time debugging in a single view.
- **Unified Lifecycle**: When you press `Ctrl+C` in the terminal, `concurrently` shuts down both servers together.

---

### Q1.2: What does `"dev:backend": "node --watch backend/src/server.js"` do? Why `--watch`?
**Answer:**
- Node.js version 18.11+ includes a built-in `--watch` flag.
- Without `--watch`, whenever you edit a backend file (e.g. `studentService.js`), you would have to manually kill the server and re-run `node backend/src/server.js` for changes to take effect.
- With `--watch`, Node monitors all imported JavaScript files. As soon as you save any file in `backend/src/`, the server hot-restarts automatically within milliseconds without losing port bindings.

---

### Q1.3: What does `"dev:frontend": "npm --prefix frontend run dev"` mean? What is `--prefix`?
**Answer:**
- The `--prefix frontend` argument tells npm to execute the command inside the `frontend/` subdirectory without requiring you to manually run `cd frontend`.
- It executes Vite's development server (`vite`), which starts the Hot Module Replacement (HMR) server on `http://localhost:5173/`.

---

### Q1.4: Why is the Frontend on port `5173` and Backend on port `5000`?
**Answer:**
- **Separation of Concerns**: The Frontend (Vite/React) serves HTML, JavaScript bundles, CSS, and client-side UI assets on port `5173`.
- The Backend (Node/Express) serves raw JSON REST API endpoints on port `5000`.
- This ensures the UI rendering engine and API business logic are completely decoupled.

---

### Q1.5: What was the port closing error (`EADDRINUSE` / unhandled termination), and how did we solve it in code?
**Answer:**
- **Cause**: On Windows, when a terminal is killed abruptly, Node child processes can sometimes remain orphaned in the background holding onto port `5000`.
- **Code Solution**: We added explicit signal handlers in `backend/src/server.js`:
```javascript
const shutdown = () => {
  server.close(() => {
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);  // Triggered on Ctrl+C
process.on('SIGTERM', shutdown); // Triggered on process termination
```
This forces the HTTP socket server to release port `5000` immediately when stopped.

---

# 2. Architecture & Theoretical Concept FAQs

### Q2.1: What is the core problem that the Academia Platform solves?
**Answer:**
- **The Problem**: Traditional hiring relies on **unverified resumes** where anyone can write keywords like "Expert in Java" or "Cloud Architect". Companies spend months conducting repetitive screening rounds, and qualified students with real competency get filtered out by flawed keyword ATS filters.
- **The Solution**: Academia introduces **Evidence-Based Skill Passports**. A student's skills are only certified after passing our rigorous **3-Stage Dynamic Assessment** (MCQs + Coding with Automated Test Cases + Real-World Scenario Problems). Recruiters discover candidates ranked strictly by verified objective scores.

---

### Q2.2: What is the "Career Match Matrix", and how is explainability achieved?
**Answer:**
Traditional job matching algorithms are "black boxes" that give arbitrary percentages without reason.
Our **Career Match Matrix** in `studentService.js` uses **Deterministic Explainable Rule Matching**:
1. It compares the student’s verified skills against the job's mandatory criteria.
2. It assigns **Core Mandatory Skills** a 70% weight and **Preferred Skills** a 30% weight.
3. It generates an exact breakdown:
   - *Why is the candidate 92% ready?* $\rightarrow$ "85% Java (Required: 70%) + 90% Spring Boot (Required: 75%)".
   - *What is missing?* $\rightarrow$ "Docker practical assessment pending (+8% boost upon completion)".

---

# 3. Authentication, Security & RBAC FAQs

### Q3.1: How does Stateless JWT (JSON Web Token) authentication work in this project?
**Answer:**
JWT consists of three Base64URL parts: `Header.Payload.Signature`.
1. **Login**: User enters credentials. `authController.js` validates the password using `bcrypt.compare()`.
2. **Token Generation**: Backend generates a signed JWT containing payload `{ id: user.id, email: user.email, role: user.role }` signed with `JWT_SECRET`:
   ```javascript
   const token = jwt.sign({ id, email, role }, JWT_SECRET, { expiresIn: '24h' });
   ```
3. **Client Storage**: React receives the token and persists it in browser `localStorage`.
4. **Subsequent API Requests**: Axios interceptor in `frontend/src/services/api.js` automatically attaches:
   ```http
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
5. **Backend Verification**: `authenticateToken.js` verifies the cryptographic signature with `jwt.verify()`.

---

### Q3.2: What is Role-Based Access Control (RBAC), and how is it enforced on both Backend & Frontend?
**Answer:**
RBAC ensures users can only access data and routes permitted for their specific account type (`STUDENT`, `INDUSTRY_RECRUITER`, `ACADEMICIAN`, `INSTITUTION`).

- **Backend Enforcement (`backend/src/middleware/authorizeRoles.js`)**:
  ```javascript
  const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Access denied: insufficient permissions' });
      }
      next();
    };
  };
  ```
  *Example*: `router.post('/jobs', authenticateToken, authorizeRoles('INDUSTRY_RECRUITER'), postJobHandler);`

- **Frontend Enforcement (`frontend/src/routes/ProtectedRoute.jsx`)**:
  ```jsx
  export const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, isAuthenticated } = useAuth();
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }
    return children;
  };
  ```

---

### Q3.3: Why do we use `bcrypt.js` for passwords instead of plain text or simple MD5/SHA256?
**Answer:**
- **Plain Text**: If the database is compromised, all user passwords are leaked immediately.
- **MD5/SHA256**: Vulnerable to fast lookup tables called *Rainbow Tables*.
- **Bcrypt (Adaptive Salted Hash)**:
  - Generates a random cryptographic **Salt** (e.g. `$2a$10$...`) combined with the password before hashing.
  - Computationally slow by design, preventing brute-force attacks.
  - Verification uses `bcrypt.compare(candidatePassword, storedHash)`.

---

# 4. 3-Stage Skill Assessments & Grading Engine FAQs

### Q4.1: What are the 3 stages in the Skill Assessment Engine (`questionBankService.js`)?
**Answer:**
To prevent cheating, guessing, and theoretical-only memorization, assessments are split into 3 progressive tiers:

```
[ Stage 1: MCQs (10 Qs) ] ➔ [ Stage 2: Coding & Test Cases (5 Qs) ] ➔ [ Stage 3: System Scenarios (2 Qs) ]
    Weight: 30%                         Weight: 45%                              Weight: 25%
```

1. **Stage 1: Core Conceptual MCQs (30% Weight)**:
   - 10 randomized multiple-choice questions assessing core syntax, memory management, and time complexity.
2. **Stage 2: Algorithmic Programming & Test-Cases (45% Weight)**:
   - 5 programming challenges where student code is tested against hidden and public test cases.
3. **Stage 3: Real-World Architecture & Engineering Scenarios (25% Weight)**:
   - 2 real-world industry challenges (e.g., concurrency deadlocks, microservice state synchronization).

---

### Q4.2: How is the Final Evidence Score calculated mathematically?
**Answer:**
$$\text{Evidence Score} = (\text{Stage 1 \%} \times 0.30) + (\text{Stage 2 \%} \times 0.45) + (\text{Stage 3 \%} \times 0.25)$$

- If $\text{Evidence Score} \ge 70\%$: The skill is marked as **`AI Verified`** and stamped with cryptographic verification on the student's Skill Passport.
- If $\text{Evidence Score} < 70\%$: The student receives a diagnostic weakness breakdown and is placed on a 14-day study plan before re-attempting.

---

# 5. Frontend & React State Management FAQs

### Q5.1: Why do we use React Context API (`AuthContext` & `AppContext`) instead of Redux?
**Answer:**
- **Context API vs Redux**:
  - Redux introduces heavy boilerplate (reducers, actions, dispatchers, store configuration).
  - React Context API provides lightweight, native state distribution without adding bundle overhead.
- **`AuthContext.jsx`**: Handles authentication status, current user profile, and token lifecycle across the entire app.
- **`AppContext.jsx`**: Manages global UI state including open modals (`ai-parser`), dynamic notification toasts, and real-time candidate search queries.

---

### Q5.2: How does the glassmorphism theme work in `frontend/src/index.css`?
**Answer:**
Glassmorphism creates modern, translucent, frosted-glass UI cards using CSS backdrop filters:
```css
.glass-panel {
  background: rgba(13, 21, 39, 0.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}
```
- `rgba(13, 21, 39, 0.7)`: 70% opacity dark slate base.
- `backdrop-filter: blur(16px)`: Blurs whatever content is behind the container.
- `border: 1px solid rgba(255, 255, 255, 0.08)`: Subtle 1px white border to define the card edge against ambient background glows.

---

# 6. Backend, Database & Dual-Layer Architecture FAQs

### Q6.1: What is the "Dual-Layer Resilient Service Architecture" in `frontend/src/services/`?
**Answer:**
- **The Challenge in Hackathons / Demos**: If a reviewer's local PostgreSQL database is not running or the backend port is unreachable, standard web apps throw network errors and crash.
- **Our Solution**: In `studentService.js` and `industryService.js`, every API call is structured as a resilient fallback pipeline:
```javascript
export const studentService = {
  async getDashboard() {
    try {
      const response = await api.get('/student/dashboard');
      return response.data;
    } catch (err) {
      console.warn('Backend API offline — falling back to deterministic mock engine');
      return mockStudentDashboardData;
    }
  }
};
```
- **Benefit**:
  - When backend + database are online $\rightarrow$ live PostgreSQL persistence.
  - When backend is offline $\rightarrow$ client automatically falls back to full interactive mock data with zero crash.

---

### Q6.2: What is the database schema structure in PostgreSQL?
**Answer:**
The schema consists of 7 normalized relational tables:
1. `users`: Authentication credentials (`id`, `email`, `password_hash`, `role`, `created_at`).
2. `students`: Student profile details (`id`, `user_id`, `college`, `department`, `cgpa`, `year`).
3. `recruiters`: Recruiter profiles (`id`, `user_id`, `company_name`, `is_verified`).
4. `skills`: Student skill declarations (`id`, `student_id`, `skill_name`, `proficiency`, `status`).
5. `assessment_attempts`: Test records (`id`, `student_id`, `skill_name`, `score`, `stage_scores`).
6. `jobs`: Recruiter job postings (`id`, `recruiter_id`, `title`, `required_skills`, `stipend`).
7. `applications`: Candidate job applications (`id`, `job_id`, `student_id`, `match_score`, `status`).

---

# 7. AI Intelligence Suite & Parsing Algorithms FAQs

### Q7.1: How does the Resume AI Parser work in `AIAssistantModal.jsx`?
**Answer:**
1. **Input**: Raw unformatted candidate resume text.
2. **Tokenization & Extraction**:
   - Matches keywords against technical skill taxonomies (e.g. *Java*, *Spring Boot*, *PostgreSQL*, *Docker*).
   - Extracts CGPA patterns using Regular Expressions (e.g. `/(?:CGPA|GPA)[:\s]*([0-9]+\.[0-9]+)/i`).
   - Identifies project architecture descriptions.
3. **Evidence Mapping**: Assigns confidence scores based on whether skills are supported by listed project repositories.
4. **One-Click Sync**: Updates the student's Skill Passport with newly parsed evidence.

---

### Q7.2: How does the Natural Language Candidate Search work?
**Answer:**
Recruiters can type natural queries like:
> *"Find 3rd-year students with Java > 75%, Spring Boot experience, and verified backend projects"*

1. **Entity Extraction**:
   - `Target Skill`: Java (threshold $\ge 75\%$).
   - `Secondary Skill`: Spring Boot.
   - `Year`: 3rd Year (Class of 2027).
2. **Query Scoring**: Ranks students by combining their Stage 2 coding pass rate and Stage 3 architectural project evidence.

---

# 8. Troubleshooting & Common Errors FAQs

### Q8.1: How do I fix `Error: listen EADDRINUSE: address already in use :::5000`?
**Answer:**
This means another process is still running on port 5000.
Run this one-line command in Windows PowerShell:
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```
Then start the server again with `npm run dev`.

---

### Q8.2: Where can I find pre-configured credentials to test all roles?
**Answer:**
We have pre-seeded test accounts ready for instant testing:

| Role | Email Address | Password | Workspace URL |
| :--- | :--- | :--- | :--- |
| **Student** | `student@apex.edu` | `student123` | `http://localhost:5173/student/dashboard` |
| **Industry Recruiter** | `recruiter@apex.edu` | `recruiter123` | `http://localhost:5173/industry/dashboard` |

---

### Q8.3: What is the fastest command to test if everything compiles with 0 errors?
**Answer:**
```powershell
npm run build:frontend
```
If this exits with code 0, the entire frontend bundle is 100% syntactically valid and production-ready.

---

*Authored by Tech Vaders (SIH26044) • Academia AI Collaboration Ecosystem*
