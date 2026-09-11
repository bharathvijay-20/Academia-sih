# Authentication & Authorization Architecture

**Platform: Academia (AI-Powered Academia–Industry Collaboration Platform)**  
**Team: Tech Vaders | Problem Statement: SIH26044**

---

## 1. Overview & Security Principles

The Academia platform implements a multi-stakeholder **Role-Based Access Control (RBAC)** architecture with mandatory **Email OTP Verification** during registration and password reset.

### Supported Stakeholder Roles:
1. `STUDENT`: Candidate portal, Evidence-based Skill Passport, Assessments, Internship Tracker.
2. `INDUSTRY_RECRUITER`: Employer portal, Candidate discovery, Problem Bank challenges, Mentor evaluations.
3. `ACADEMICIAN`: Faculty portal, Student mentoring, Faculty ↔ Industry matchmaking, Research grants.
4. `EDUCATIONAL_INSTITUTION`: Institutional admin, Skill Demand Heatmap, Closed-loop campus bootcamps, Placement analytics.

---

## 2. Authentication Flows

### A. New User Registration with Email OTP Verification

```text
Select Stakeholder Role
        ↓
   Enter Email
        ↓
  Generate OTP (Crypto 6-digit)
        ↓
  Hash & Store OTP (10 min expiry)
        ↓
  Send Email (SMTP / Test Preview)
        ↓
  User Enters 6-digit OTP
        ↓
  Verify OTP Hash & Attempts (< 5)
     ↙         ↘
 [Invalid]   [Valid]
     ↓           ↓
 Show Error   Create Password (Min 8 chars, Strength Meter)
                 ↓
              Complete Role Profile (College/Company details)
                 ↓
              Atomic Database User & Profile Creation
                 ↓
              Generate Signed JWT Token
                 ↓
              Redirect to Role Dashboard
```

### B. Returning User Login

```text
Enter Email + Password
        ↓
Lookup User in DB
        ↓
Verify Password Hash (bcryptjs)
        ↓
Check Email Verified Flag (email_verified = 1)
        ↓
Generate JWT Token ({ id, email, role })
        ↓
Identify User Role
        ↓
Redirect to Role-Specific Dashboard:
  • STUDENT              ➔ /student/dashboard
  • INDUSTRY_RECRUITER   ➔ /industry/dashboard
  • ACADEMICIAN          ➔ /academician/dashboard
  • EDUCATIONAL_INSTITUTION ➔ /education/dashboard
```

### C. Forgot Password Flow

```text
Enter Registered Email
        ↓
Validate User Existence in DB
        ↓
Generate & Send Password-Reset OTP
        ↓
User Enters OTP + New Password
        ↓
Verify OTP Hash
        ↓
Hash New Password & Update DB
        ↓
Consume Reset OTP
        ↓
Redirect to Login Page with Success Alert
```

---

## 3. Role-Based Access Control (RBAC) & Route Guards

### Frontend Route Guards (`ProtectedRoute.jsx`):
- All dashboard paths are protected by `<ProtectedRoute allowedRoles={['...']}>`.
- If an unauthenticated user attempts to access `/student/dashboard`, they are redirected to `/login?redirect=...`.
- If a `STUDENT` user manually types `/industry/dashboard` in the browser URL bar, they are blocked and routed to `/unauthorized` with an explanatory HTTP 403 screen and a 1-click button to return to `/student/dashboard`.

### Backend Authorization Middleware (`authorizeRoles.js`):
- Every protected API route validates the decoded JWT token and verifies `allowedRoles.includes(req.user.role)`.
- If unauthorized, returns `HTTP 403 Forbidden` with `{ error: "Access denied. Required roles: [...]", code: "FORBIDDEN_ROLE" }`.

---

## 4. OTP Security Specifications

1. **Generation**: Cryptographically secure 6-digit random integer (`crypto.randomInt(100000, 1000000)`).
2. **Storage**: Stored as a **SHA-256 hash** (`otp_hash`) in the `email_verification_otps` table. Raw OTPs are never stored in plaintext.
3. **Expiration**: Hard timeout after **10 minutes**.
4. **Brute-Force Protection**: Max **5 verification attempts** allowed per OTP session before invalidation.
5. **Resend Cooldown**: Enforces a strict **60-second cooldown** between consecutive OTP requests for the same email.
6. **Replay Prevention**: OTP records are immediately invalidated and marked consumed upon account creation or password reset.
