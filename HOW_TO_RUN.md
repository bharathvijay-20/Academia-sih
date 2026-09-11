# 🚀 HOW TO RUN THIS PROJECT ON ANY LAPTOP / COMPUTER
**Complete Step-by-Step Setup Guide for ACADEMIA (Tech Vaders | SIH26044)**

Follow this step-by-step guide to run this project on **any Windows, Mac, or Linux laptop** from scratch, even if you have never run this project before.

---

## 📋 Table of Contents
1. [⚙️ Step 1: System Prerequisites (What You Need)](#-step-1-system-prerequisites-what-you-need)
2. [⚡ Step 2: Super Fast 2-Minute Quick Start](#-step-2-super-fast-2-minute-quick-start)
3. [💻 Step 3: Detailed Step-by-Step Instructions](#-step-3-detailed-step-by-step-instructions)
4. [🌐 Step 4: Open and Explore the Web Application](#-step-4-open-and-explore-the-web-application)
5. [🔑 Step 5: Test Accounts & Login Credentials](#-step-5-test-accounts--login-credentials)
6. [🛠️ Step 6: Troubleshooting & Common Fixes](#-step-6-troubleshooting--common-fixes)
7. [✅ Step 7: Final Demo Checklist](#-step-7-final-demo-checklist)

---

## ⚙️ Step 1: System Prerequisites (What You Need)

Before running the project, make sure the following software is installed on the laptop:

1. **Node.js (Version 18 or higher — Node.js LTS recommended)**
   - Download for free from: 👉 [https://nodejs.org/](https://nodejs.org/)
   - Download the **"LTS (Recommended For Most Users)"** version and install it with default settings.
2. **Git (Optional / Recommended)**
   - Download from: [https://git-scm.com/](https://git-scm.com/)
3. **Web Browser**
   - Google Chrome, Microsoft Edge, Brave, or Mozilla Firefox.

### 🔍 How to Verify Node.js is Installed:
Open your Terminal (Mac/Linux) or Command Prompt / PowerShell (Windows) and type:

```bash
node -v
npm -v
```

If you see version numbers like `v18.x.x`, `v20.x.x`, or `v22.x.x`, you are good to go!

---

## ⚡ Step 2: Super Fast 2-Minute Quick Start

If you already have Node.js installed, here are the only commands you need:

```bash
# 1. Open your terminal in the project root folder
cd "Hackthon project-Academia"

# 2. Install all dependencies (Root, Backend, and Frontend)
npm run install:all

# 3. Start the entire application (Backend + Frontend together)
npm run dev
```

That's it! Open your browser and go to 👉 **`http://localhost:5173`**.

---

## 💻 Step 3: Detailed Step-by-Step Instructions

If you prefer step-by-step setup or if `npm run install:all` encountered permissions issues:

### 1. Open the Terminal / Command Prompt
- **On Windows**: Press `Win + R`, type `powershell` or `cmd`, and press Enter. Navigate to the project folder:
  ```powershell
  cd "d:\Hackthon project-Academia"
  ```
  *(Or right-click inside the folder in File Explorer and select "Open in Terminal")*

- **On Mac / Linux**: Open `Terminal` and navigate to the project directory:
  ```bash
  cd ~/Downloads/Hackthon\ project-Academia
  ```

---

### 2. Install Dependencies
Run the install command in each directory:

```bash
# A. Install root dependencies
npm install

# B. Install backend dependencies
cd backend
npm install
cd ..

# C. Install frontend dependencies
cd frontend
npm install
cd ..
```

---

### 3. Check / Configure Environment Variables
A sample configuration is already provided. If `backend/.env` is missing, copy `.env.example`:

- **Windows (PowerShell)**:
  ```powershell
  Copy-Item .env.example backend\.env
  ```
- **Mac / Linux**:
  ```bash
  cp .env.example backend/.env
  ```

*(Note: The embedded SQLite database and JWT auth work out of the box with zero external setup needed).*

---

### 4. Seed Default Database (Optional / Already Included)
If you want to reset or seed the database with verified students and recruiter records:

```bash
npm run seed
```

---

### 5. Launch the Application!
Start both backend and frontend servers simultaneously:

```bash
npm run dev
```

You will see output in the terminal indicating:
- `[BACKEND]` 🚀 Server running on **`http://localhost:5000`** (Connected to SQLite database)
- `[FRONTEND]` 💻 Local dev server running at **`http://localhost:5173`**

---

## 🌐 Step 4: Open and Explore the Web Application

1. Open your web browser (Chrome / Edge / Firefox).
2. Type in the address bar:
   👉 **`http://localhost:5173`**
3. You will see the **ACADEMIA Intro & Landing Page**.
4. Click **Login** in the top right corner or click **Get Started / Sign In** in the center hero banner to enter the application!

---

## 🔑 Step 5: Test Accounts & Login Credentials

Use any of these pre-configured verified accounts to test all platform capabilities:

### 🎓 1. Verified Student (Rank #1 — Priya Iyer)
- **Email**: `priya.iyer@apex.edu`
- **Password**: `Student@123`
- **Profile**: 9.12 CGPA • Apex Institute of Technology • Verified in Java (92%), Spring Boot (88%), SQL (85%).

### 🎓 2. Verified Student (Rank #2 — Arun)
- **Email**: `arun@apex.edu`
- **Password**: `Student@123`
- **Profile**: 8.70 CGPA • Apex Tech • Verified in Java (85%), Spring Boot (85%), SQL (85%).

### 🎓 3. Standard Student (Rahul Sharma)
- **Email**: `student@apex.edu`
- **Password**: `Student@123`

### 🏢 4. Industry Recruiter (Vikram Singhania)
- **Email**: `recruiter@apexdigital.io`
- **Password**: `Recruiter@123`
- **Profile**: VP of Engineering, Apex Digital Labs.

### 🆕 5. Create a Brand New Profile (Sign Up)
- On the Login page (`/login`), click **Sign Up**.
- Select **Student** or **Recruiter**, enter your Name, Email, Password, College, and CGPA.
- Click **Create Profile & Sign In** to immediately enter your personalized, fresh workspace!

---

## 🛠️ Step 6: Troubleshooting & Common Fixes

### ❌ Problem 1: "Port 5000 or 5173 is already in use"
**Solution**: Another program is using port 5000 or 5173.
- **On Windows**:
  ```powershell
  # Find and terminate process on port 5000
  netstat -ano | findstr :5000
  taskkill /PID <PID_NUMBER> /F
  ```
- **On Mac / Linux**:
  ```bash
  kill -9 $(lsof -t -i:5000)
  kill -9 $(lsof -t -i:5173)
  ```

---

### ❌ Problem 2: "Script execution is disabled on this system" (Windows PowerShell)
**Solution**: Windows PowerShell blocks scripts by default for security. Allow local scripts by running:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Then rerun `npm run dev`.

---

### ❌ Problem 3: "Cannot find module..." or missing dependencies
**Solution**: Re-run the installation for all packages:
```bash
npm run install:all
```

---

### ❌ Problem 4: Do I need to install MySQL, PostgreSQL, or MongoDB?
**Solution**: **No!** ACADEMIA uses an embedded, high-speed **SQLite database** located in `database/academia.sqlite`. It runs directly inside Node.js with zero database server configuration.

---

## ✅ Step 7: Final Demo Checklist

To verify everything is working 100%:
- [x] Run `npm run dev` in the root folder.
- [x] Open `http://localhost:5173` in browser.
- [x] Click **Login** -> Sign in with `priya.iyer@apex.edu` / `Student@123`.
- [x] Check **Verified Skill Passport**, **Learning Hub**, and **Placement Prep & Tests**.
- [x] Sign out and log in as Recruiter (`recruiter@apexdigital.io` / `Recruiter@123`).
- [x] Check **Candidate Discovery** to see ranked student profiles (Priya Iyer, Arun, etc.).

---

**🎉 Congratulations! The ACADEMIA platform is now running successfully on your laptop!**
*For any questions, refer to [PROJECT_GUIDE.md](PROJECT_GUIDE.md) or [LOGIN_CREDENTIALS.md](LOGIN_CREDENTIALS.md).*
