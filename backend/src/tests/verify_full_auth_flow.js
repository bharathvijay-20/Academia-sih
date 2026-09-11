import { readFileSync } from 'fs';
import { DatabaseSync } from 'node:sqlite';

const BASE_URL = 'http://localhost:5000/api';
const FRONTEND_URL = 'http://localhost:5173';

async function logStep(title, fn) {
  process.stdout.write(`⏳ ${title}... `);
  try {
    const result = await fn();
    console.log('✅ PASS');
    return result;
  } catch (err) {
    console.log('❌ FAIL');
    console.error(`   Error: ${err.message}`);
    throw err;
  }
}

async function runVerification() {
  console.log('\n======================================================');
  console.log('🚀 RUNNING ACADEMIA FULL-STACK AUTH & RBAC TEST SUITE');
  console.log('======================================================\n');

  // 1. Check Frontend dev server
  await logStep('1. Frontend Dev Server (HTTP 200)', async () => {
    const res = await fetch(FRONTEND_URL);
    if (!res.ok) throw new Error(`Frontend server returned status ${res.status}`);
    const html = await res.text();
    if (!html.includes('Academia') && !html.includes('vite')) {
      throw new Error('Frontend did not return expected index.html');
    }
  });

  // 2. Test Login for all Seeded Roles
  const tokens = {};
  const seedUsers = [
    { role: 'STUDENT', email: 'student@apex.edu', pass: 'Student@123', name: 'Rahul Sharma' },
    { role: 'INDUSTRY_RECRUITER', email: 'recruiter@apexdigital.io', pass: 'Recruiter@123', name: 'Sarah Jenkins' },
    { role: 'ACADEMICIAN', email: 'faculty@apex.edu', pass: 'Faculty@123', name: 'Dr. Ananya Sharma' },
    { role: 'EDUCATIONAL_INSTITUTION', email: 'admin@apex.edu', pass: 'Admin@123', name: 'Apex Institute Admin' },
  ];

  for (const u of seedUsers) {
    await logStep(`2. Login as ${u.role} (${u.email})`, async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: u.email, password: u.pass }),
      });
      const data = await res.json();
      if (!res.ok || !data.token) throw new Error(`Login failed: ${data.message || res.status}`);
      if (data.user.role !== u.role) throw new Error(`Role mismatch: expected ${u.role}, got ${data.user.role}`);
      tokens[u.role] = data.token;
    });
  }

  // 3. Test Invalid Credentials
  await logStep('3. Reject Invalid Credentials (HTTP 401)', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'student@apex.edu', password: 'WrongPassword!999' }),
    });
    if (res.status !== 401) throw new Error(`Expected 401, got ${res.status}`);
  });

  // 4. Test RBAC Enforcement
  await logStep('4. RBAC: Student accessing Student Dashboard (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/student/dashboard`, {
      headers: { Authorization: `Bearer ${tokens['STUDENT']}` },
    });
    if (!res.ok) throw new Error(`Student access failed: ${res.status}`);
    const data = await res.json();
    if (!data.profile) throw new Error('Missing student payload');
  });

  await logStep('4b. RBAC: Student accessing Industry Dashboard (Blocked: HTTP 403 Forbidden)', async () => {
    const res = await fetch(`${BASE_URL}/industry/dashboard`, {
      headers: { Authorization: `Bearer ${tokens['STUDENT']}` },
    });
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
    const data = await res.json();
    if (data.code !== 'FORBIDDEN_ROLE') throw new Error(`Expected FORBIDDEN_ROLE code, got ${data.code}`);
  });

  await logStep('4c. RBAC: Industry Recruiter accessing Industry Dashboard (HTTP 200)', async () => {
    const res = await fetch(`${BASE_URL}/industry/dashboard`, {
      headers: { Authorization: `Bearer ${tokens['INDUSTRY_RECRUITER']}` },
    });
    if (!res.ok) throw new Error(`Industry access failed: ${res.status}`);
  });

  // 5. Test Registration & OTP Security (Real SMTP Error Enforcement)
  const testEmail = `candidate.${Date.now()}@university.edu`;

  await logStep(`5. Request Registration OTP (Enforce strict SMTP & error handling)`, async () => {
    const res = await fetch(`${BASE_URL}/auth/register/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, role: 'STUDENT' }),
    });
    const data = await res.json();
    if (res.ok) {
      if (data.previewOtp || data.otp) {
        throw new Error('SECURITY VIOLATION: Raw OTP was leaked in API response!');
      }
    } else {
      // Must return clear descriptive SMTP error
      if (!data.error || !data.error.includes('SMTP') && !data.error.includes('Email')) {
        throw new Error(`Expected descriptive SMTP error, got: ${JSON.stringify(data)}`);
      }
    }
  });

  // Verify email in database to test subsequent registration completion
  const db = new DatabaseSync('./database/academia.sqlite');
  db.prepare("INSERT INTO email_verification_otps (id, email, otp_hash, purpose, expires_at, verified_at) VALUES (?, ?, ?, ?, datetime('now', '+10 minutes'), datetime('now'))")
    .run(`otp-${Date.now()}`, testEmail.toLowerCase(), 'testhash', 'REGISTRATION');

  let newAuthToken = null;
  await logStep(`5b. Complete Registration for ${testEmail}`, async () => {
    const res = await fetch(`${BASE_URL}/auth/register/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: 'SecurePassword@2026',
        role: 'STUDENT',
        fullName: 'Maya Patel',
        profileData: {
          college_name: 'Apex Institute of Technology',
          degree: 'B.Tech',
          branch: 'Computer Science',
          graduation_year: '2027',
          skills: 'TypeScript, React, Python, Docker',
          cgpa: '9.1',
        },
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.token) throw new Error(`Complete registration failed: ${data.message || data.error}`);
    newAuthToken = data.token;
    if (data.user.email !== testEmail.toLowerCase()) throw new Error('Registered user email mismatch');
  });

  await logStep(`5c. Verify /me endpoint for newly registered user`, async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${newAuthToken}` },
    });
    const data = await res.json();
    if (!res.ok || !data.user) throw new Error(`/me failed: ${data.message || data.error}`);
    if (data.user.profile.name !== 'Maya Patel') throw new Error(`Profile name mismatch, got: ${data.user.profile.name}`);
  });

  console.log('\n======================================================');
  console.log('🎉 ALL FULL-STACK AUTH & RBAC TESTS PASSED SUCCESSFULLY!');
  console.log('======================================================\n');
}

runVerification().catch((err) => {
  console.error('\n❌ TEST SUITE FAILED:', err);
  process.exit(1);
});
