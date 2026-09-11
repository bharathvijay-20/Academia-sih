# REST API Documentation

**Base API URL: `http://localhost:5000/api`**

---

## 1. Authentication Endpoints (`/api/auth`)

### `POST /api/auth/register/send-otp`
Sends a 6-digit verification OTP to the applicant's email address.
- **Request Body**:
  ```json
  {
    "email": "student@apex.edu",
    "role": "STUDENT",
    "name": "Rahul Sharma"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "OTP sent successfully to student@apex.edu",
    "expiresMinutes": 10,
    "cooldownSeconds": 60,
    "previewOtp": "583921"
  }
  ```

---

### `POST /api/auth/register/verify-otp`
Verifies the 6-digit OTP code entered by the user.
- **Request Body**:
  ```json
  {
    "email": "student@apex.edu",
    "otp": "583921"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "valid": true,
    "message": "Email successfully verified!"
  }
  ```

---

### `POST /api/auth/register/complete`
Completes account creation after OTP verification and returns JWT auth session.
- **Request Body**:
  ```json
  {
    "email": "student@apex.edu",
    "password": "SecurePassword@123",
    "role": "STUDENT",
    "profileData": {
      "name": "Rahul Sharma",
      "college": "Apex Institute of Technology",
      "department": "Computer Science & Engineering",
      "year": "3rd Year",
      "graduation_year": "2027",
      "cgpa": 8.84,
      "career_goal": "Backend Systems & Cloud Engineer"
    }
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "message": "Account registered successfully!",
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr-stu-12345",
      "email": "student@apex.edu",
      "role": "STUDENT",
      "email_verified": 1
    },
    "profile": { ... }
  }
  ```

---

### `POST /api/auth/login`
Authenticates existing users with email and password.
- **Request Body**:
  ```json
  {
    "email": "student@apex.edu",
    "password": "Student@123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "message": "Login successful!",
    "token": "eyJhbGciOi...",
    "user": {
      "id": "usr-student-001",
      "email": "student@apex.edu",
      "role": "STUDENT",
      "email_verified": 1
    },
    "profile": { ... }
  }
  ```

---

### `POST /api/auth/forgot-password/send-otp`
Dispatches a password reset OTP to a registered account email.

### `POST /api/auth/forgot-password/reset`
Resets the user's password after OTP verification.
- **Request Body**:
  ```json
  {
    "email": "student@apex.edu",
    "otp": "583921",
    "newPassword": "NewSecurePassword@123"
  }
  ```

### `GET /api/auth/me`
Rehydrates the current user's role profile from the JWT Bearer token header.
- **Headers**: `Authorization: Bearer <token>`

---

## 2. Role-Protected Dashboard Endpoints

| Endpoint | Method | Required RBAC Role | Description |
|---|---|---|---|
| `/api/student/dashboard-summary` | `GET` | `STUDENT` | Fetches student readiness, skills & applications |
| `/api/industry/dashboard-summary` | `GET` | `INDUSTRY_RECRUITER` | Fetches candidate pipeline & active listings |
| `/api/academician/dashboard-summary` | `GET` | `ACADEMICIAN` | Fetches mentee progress & industry R&D grants |
| `/api/education/dashboard-summary` | `GET` | `EDUCATIONAL_INSTITUTION` | Fetches Skill Heatmap & placement analytics |
