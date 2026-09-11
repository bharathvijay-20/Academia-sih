process.env.NODE_ENV = 'test';
import db from '../config/db.js';
import { authService } from '../services/authService.js';
import { studentService } from '../services/studentService.js';
import { industryService } from '../services/industryService.js';
import { otpService } from '../services/otpService.js';
import { questionBankService } from '../services/questionBankService.js';

async function runTests() {
  console.log('🧪 ================================================');
  console.log('🧪 RUNNING COMPREHENSIVE END-TO-END FLOW TESTS');
  console.log('🧪 ================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // Clean up test accounts
    const testUsers = db.prepare("SELECT id FROM users WHERE email IN ('newstudent@apex.edu', 'studentb@apex.edu')").all();
    testUsers.forEach(u => db.prepare('DELETE FROM users WHERE id = ?').run(u.id));
    db.prepare("DELETE FROM email_verification_otps WHERE email IN ('newstudent@apex.edu', 'studentb@apex.edu')").run();

    // TEST 1: OTP Generation & Hashing (No raw OTP exposure)
    console.log('--- TEST 1: OTP Generation & Security ---');
    const otpRes = await otpService.createAndSendOtp({
      email: 'newstudent@apex.edu',
      purpose: 'REGISTRATION',
      recipientName: 'New Student'
    });
    assert(otpRes.success === true, 'OTP generated successfully');
    assert(otpRes.previewOtp === undefined, 'Raw OTP is NOT exposed in return payload');

    // Retrieve hashed OTP from DB to test verification
    const otpRecord = db.prepare('SELECT * FROM email_verification_otps WHERE email = ?').get('newstudent@apex.edu');
    assert(otpRecord !== undefined, 'Hashed OTP stored securely in SQLite database');
    assert(otpRecord.otp_hash.length === 64, 'OTP stored as SHA-256 hash');

    // TEST 2: Independent Account Registration & Data Isolation
    console.log('\n--- TEST 2: Registration & Account Isolation ---');
    // Mark verified directly in DB to simulate email OTP completion
    db.prepare("UPDATE email_verification_otps SET verified_at = datetime('now') WHERE email = ?").run('newstudent@apex.edu');

    const regA = await authService.registerUser({
      email: 'newstudent@apex.edu',
      password: 'Password@123',
      role: 'STUDENT',
      profileData: {
        name: 'Student A',
        college: 'Apex Tech',
        department: 'CSE',
        year: '3rd Year',
        graduation_year: '2027',
        cgpa: 8.7,
        career_goal: 'Cloud Architect'
      }
    });
    assert(regA.user.id.startsWith('usr-stu-'), 'Student A received unique user ID');
    assert(regA.user.email === 'newstudent@apex.edu', 'Student A email stored correctly');

    // Register Student B
    db.prepare("INSERT INTO email_verification_otps (id, email, otp_hash, purpose, expires_at, verified_at) VALUES ('otp-b', 'studentb@apex.edu', 'hashb', 'REGISTRATION', datetime('now', '+10 minutes'), datetime('now'))").run();

    const regB = await authService.registerUser({
      email: 'studentb@apex.edu',
      password: 'Password@123',
      role: 'STUDENT',
      profileData: {
        name: 'Student B',
        college: 'Apex Tech',
        department: 'IT',
        year: '2nd Year',
        graduation_year: '2028',
        cgpa: 9.0,
        career_goal: 'DevOps Engineer'
      }
    });

    assert(regB.user.id !== regA.user.id, 'Student B has a completely distinct user ID from Student A');

    const dashA = studentService.getStudentDashboard(regA.user.id);
    const dashB = studentService.getStudentDashboard(regB.user.id);

    assert(dashA.profile.name === 'Student A', 'Student A dashboard loads only Student A profile');
    assert(dashB.profile.name === 'Student B', 'Student B dashboard loads only Student B profile');
    assert(dashA.skills.length === 0, 'New Student A starts with 0 unverified skills (no demo leakage)');
    assert(dashB.skills.length === 0, 'New Student B starts with 0 unverified skills (no demo leakage)');

    // TEST 3: Student Identity Verification & Duplicate Detection
    console.log('\n--- TEST 3: Aadhaar Identity Verification & Duplicate Prevention ---');
    const idResA = studentService.verifyIdentity({
      userId: regA.user.id,
      identityType: 'AADHAAR',
      identityNumber: '998877665544',
      fullName: 'Student A',
      institution: 'Apex Tech'
    });
    assert(idResA.success === true, 'Student A identity verified');
    assert(idResA.identity.identityNumberMasked === 'XXXX-XXXX-5544', 'Aadhaar displayed with masking');

    // Attempt to register same Aadhaar for Student B -> MUST FAIL
    let duplicateCaught = false;
    try {
      studentService.verifyIdentity({
        userId: regB.user.id,
        identityType: 'AADHAAR',
        identityNumber: '998877665544',
        fullName: 'Student B',
        institution: 'Apex Tech'
      });
    } catch (err) {
      duplicateCaught = true;
      assert(err.message.includes('already registered'), 'Duplicate Aadhaar registration prevented with clear error');
    }
    assert(duplicateCaught, 'Duplicate student identity strictly blocked');

    // TEST 4: Dynamic Question Generation
    console.log('\n--- TEST 4: Dynamic Question Generation & Randomization ---');
    const setA = questionBankService.generateAssessmentSet('Java');
    const setB = questionBankService.generateAssessmentSet('Java');

    assert(setA.stage1_easy.length === 10, 'Stage 1 generated 10 Easy MCQs');
    assert(setA.stage2_medium.length === 5, 'Stage 2 generated 5 Medium programming questions');
    assert(setA.stage3_hard.length === 2, 'Stage 3 generated 2 Hard real-world problems');

    const idsA = setA.stage1_easy.map(q => q.id).join(',');
    const idsB = setB.stage1_easy.map(q => q.id).join(',');
    // With 16 questions and random selection of 10, question sequences will differ
    console.log(`    Set A question sequence: ${idsA.slice(0, 30)}...`);
    console.log(`    Set B question sequence: ${idsB.slice(0, 30)}...`);
    assert(idsA !== idsB || setA.stage1_easy[0].options[0] !== setB.stage1_easy[0].options[0], 'Question sets or option permutations are dynamically randomized');

    // TEST 5: 3-Stage Assessment Submission & Score Analysis
    console.log('\n--- TEST 5: 3-Stage Assessment Submission & Verified Skills ---');
    const startRes = studentService.startAssessment({ userId: regA.user.id, skillName: 'Java' });
    assert(startRes.currentStage === 1, 'Assessment started at Stage 1');
    assert(startRes.questions.length === 10, 'Stage 1 questions delivered to client');

    // Submit Stage 1
    const stage1Answers = {};
    startRes.questions.forEach(q => { stage1Answers[q.id] = 0; });
    const stage1Sub = studentService.submitStage({
      userId: regA.user.id,
      attemptId: startRes.attemptId,
      stage: 1,
      answers: stage1Answers
    });
    assert(stage1Sub.nextStage === 2, 'Stage 1 completed and transitioned to Stage 2');
    assert(stage1Sub.questions.length === 5, 'Stage 2 questions delivered');

    // Submit Stage 2
    const stage2Answers = {};
    stage1Sub.questions.forEach(q => { stage2Answers[q.id] = 'public int solution() { return 12; }'; });
    const stage2Sub = studentService.submitStage({
      userId: regA.user.id,
      attemptId: startRes.attemptId,
      stage: 2,
      answers: stage2Answers
    });
    assert(stage2Sub.nextStage === 3, 'Stage 2 completed and transitioned to Stage 3');
    assert(stage2Sub.questions.length === 2, 'Stage 3 questions delivered');

    // Submit Stage 3
    const stage3Answers = {};
    stage2Sub.questions.forEach(q => { stage3Answers[q.id] = 'public class DistributedPipeline { private final Lock lock = new ReentrantLock(); }'; });
    const stage3Sub = studentService.submitStage({
      userId: regA.user.id,
      attemptId: startRes.attemptId,
      stage: 3,
      answers: stage3Answers
    });
    assert(stage3Sub.completed === true, 'All 3 stages completed');
    assert(stage3Sub.analysis.overallScore > 0, `Overall score computed: ${stage3Sub.analysis.overallScore}%`);
    assert(stage3Sub.analysis.strongAreas.length > 0, 'Strong areas identified');

    // Verify Skill Passport was updated
    const updatedDashA = studentService.getStudentDashboard(regA.user.id);
    const verifiedJava = updatedDashA.skills.find(s => s.name === 'Java');
    assert(verifiedJava !== undefined && verifiedJava.isVerified === true, 'Java verified in Skill Passport');

    // TEST 6: Job Qualification Matching States
    console.log('\n--- TEST 6: Job Qualification Matching States ---');
    // Job requiring Java, Spring Boot, SQL -> Student A currently only has Java verified
    const jobsA = studentService.getMatchedJobs(regA.user.id);
    const backendJob = jobsA.find(j => j.title.includes('Backend Systems'));
    assert(backendJob.qualificationState === 'NEEDS_IMPROVEMENT', 'Student A lacks Spring Boot and SQL -> State: NEEDS_IMPROVEMENT');
    assert(backendJob.missingSkills.includes('Spring Boot'), 'Missing skills clearly identified');

    // TEST 7: Skill Improvement & Automatic Re-Qualification Notification
    console.log('\n--- TEST 7: Skill Improvement & Re-Qualification Notification ---');
    // Add Spring Boot and SQL verified skills for Student A
    studentService.declareSkill({ userId: regA.user.id, skillName: 'Spring Boot', proficiency: 85 });
    studentService.declareSkill({ userId: regA.user.id, skillName: 'SQL', proficiency: 85 });
    db.prepare('UPDATE student_skills SET is_verified = 1, overall_score = 85 WHERE user_id = ?').run(regA.user.id);

    // Trigger re-qualification check
    studentService.triggerJobRequalificationCheck(regA.user.id, 'Spring Boot');

    const dashAAfter = studentService.getStudentDashboard(regA.user.id);
    const readyNotif = dashAAfter.notifications.find(n => n.title.includes('Ready to Apply'));
    assert(readyNotif !== undefined, 'Automated job re-qualification notification generated');

    const updatedJobsA = studentService.getMatchedJobs(regA.user.id);
    const updatedBackendJob = updatedJobsA.find(j => j.title.includes('Backend Systems'));
    assert(updatedBackendJob.qualificationState === 'QUALIFIED' || updatedBackendJob.qualificationState === 'PERFECTLY_QUALIFIED', 'Job qualification status upgraded to QUALIFIED / PERFECTLY_QUALIFIED');

    // TEST 8: Recruiter Verification, Qualification & Talent Discovery
    console.log('\n--- TEST 8: Recruiter Verification & Talent Discovery ---');
    const recruiterDash = industryService.getRecruiterDashboard('usr-industry-001');
    assert(recruiterDash.verification.status === 'VERIFIED', 'Recruiter document verification loaded');

    const candidates = industryService.getCandidates({ userId: 'usr-industry-001', searchSkill: 'Java', sortBy: 'score_desc' });
    assert(candidates.length >= 3, `Discovered ${candidates.length} verified candidates`);
    assert(candidates[0].averageVerifiedScore >= candidates[1].averageVerifiedScore, 'Candidates ranked in descending order of verified skill scores');
    console.log(`    #1 Candidate: ${candidates[0].name} (${candidates[0].averageVerifiedScore}%)`);
    console.log(`    #2 Candidate: ${candidates[1].name} (${candidates[1].averageVerifiedScore}%)`);

    console.log('\n================================================');
    console.log(`🎉 ALL TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log('================================================\n');

    return { passed, failed };
  } catch (err) {
    console.error('Test execution error:', err);
    return { passed, failed: failed + 1 };
  }
}

runTests();
