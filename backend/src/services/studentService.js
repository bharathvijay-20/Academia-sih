import db from '../config/db.js';
import crypto from 'crypto';
import { questionBankService } from './questionBankService.js';

export const studentService = {
  /**
   * Fetch complete, isolated dashboard data for a student
   */
  getStudentDashboard(userId) {
    // 1. Student Profile
    const profile = db.prepare('SELECT * FROM student_profiles WHERE user_id = ?').get(userId);

    // 2. Identity Verification Record
    const identity = db.prepare('SELECT * FROM student_identities WHERE user_id = ?').get(userId);

    // 3. Skills (Verified & Self-declared)
    const skillsRows = db.prepare(`
      SELECT * FROM student_skills WHERE user_id = ? ORDER BY is_verified DESC, overall_score DESC, skill_name ASC
    `).all(userId);

    const skills = skillsRows.map(s => ({
      id: s.id,
      name: s.skill_name,
      isVerified: Boolean(s.is_verified),
      proficiency: s.proficiency || 50,
      overallScore: s.overall_score || 0,
      easyScore: s.easy_score || 0,
      mediumScore: s.medium_score || 0,
      hardScore: s.hard_score || 0,
      strongAreas: s.strong_areas ? JSON.parse(s.strong_areas) : [],
      weakAreas: s.weak_areas ? JSON.parse(s.weak_areas) : [],
      improvementRecommendations: s.improvement_recommendations ? JSON.parse(s.improvement_recommendations) : [],
      proficiencyLevel: s.proficiency_level || 'Beginner',
      verifiedAt: s.verified_at
    }));

    // 4. Assessment History
    const assessmentsRows = db.prepare(`
      SELECT id, skill_name, current_stage, easy_score, medium_score, hard_score, overall_score, status, analysis_data, created_at, completed_at
      FROM assessment_attempts
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).all(userId);

    const assessmentHistory = assessmentsRows.map(a => ({
      id: a.id,
      skillName: a.skill_name,
      currentStage: a.current_stage,
      easyScore: a.easy_score,
      mediumScore: a.medium_score,
      hardScore: a.hard_score,
      overallScore: a.overall_score,
      status: a.status,
      analysis: a.analysis_data ? JSON.parse(a.analysis_data) : null,
      createdAt: a.created_at,
      completedAt: a.completed_at
    }));

    // 5. Jobs & Match Analysis
    const jobsWithMatches = this.getMatchedJobs(userId, skills);

    // 6. Applications
    const applicationsRows = db.prepare(`
      SELECT ja.*, j.title, j.company, j.location, j.type
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      WHERE ja.student_user_id = ?
      ORDER BY ja.applied_at DESC
    `).all(userId);

    // 7. Notifications
    const notifications = db.prepare(`
      SELECT * FROM user_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
    `).all(userId);

    return {
      profile: profile || {},
      identity: identity ? {
        id: identity.id,
        identityType: identity.identity_type,
        identityNumberMasked: identity.identity_number_masked,
        fullName: identity.full_name,
        institution: identity.institution,
        verificationStatus: identity.verification_status,
        verifiedAt: identity.verified_at
      } : null,
      skills,
      assessmentHistory,
      jobs: jobsWithMatches,
      applications: applicationsRows,
      notifications
    };
  },

  /**
   * Verify Student Identity (Aadhaar / Student ID) with duplicate check
   */
  verifyIdentity({ userId, identityType = 'AADHAAR', identityNumber, fullName, institution }) {
    const rawNumber = String(identityNumber || '').replace(/\s+/g, '').trim();
    if (rawNumber.length < 6) {
      throw new Error('Please enter a valid identity number.');
    }

    // Hash the identity number to enforce unique detection without storing raw sensitive numbers
    const hash = crypto.createHash('sha256').update(rawNumber).digest('hex');

    // Duplicate Detection
    const existing = db.prepare('SELECT id, user_id FROM student_identities WHERE identity_number_hash = ?').get(hash);
    if (existing && existing.user_id !== userId) {
      throw new Error('This identity document is already registered with another student account. Duplicate profiles are not permitted.');
    }

    // Mask display: e.g. XXXX-XXXX-1234
    const lastDigits = rawNumber.slice(-4);
    const masked = `XXXX-XXXX-${lastDigits}`;

    const profile = db.prepare('SELECT name, college FROM student_profiles WHERE user_id = ?').get(userId);
    const studentName = fullName || profile?.name || 'Student';
    const studentInstitution = institution || profile?.college || 'Academic Institution';

    const id = `id-ver-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const insertOrUpdate = db.prepare(`
      INSERT INTO student_identities (id, user_id, identity_type, identity_number_hash, identity_number_masked, full_name, institution, verification_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'VERIFIED')
      ON CONFLICT(user_id) DO UPDATE SET
        identity_type = excluded.identity_type,
        identity_number_hash = excluded.identity_number_hash,
        identity_number_masked = excluded.identity_number_masked,
        full_name = excluded.full_name,
        institution = excluded.institution,
        verification_status = 'VERIFIED',
        verified_at = CURRENT_TIMESTAMP
    `);
    insertOrUpdate.run(id, userId, identityType, hash, masked, studentName, studentInstitution);

    // Add activity notification
    this.createNotification({
      userId,
      title: 'Identity Verified Successfully',
      message: `Your ${identityType} identity (${masked}) has been authenticated and linked to your student passport.`,
      type: 'SUCCESS'
    });

    return {
      success: true,
      message: 'Identity successfully verified!',
      identity: {
        identityType,
        identityNumberMasked: masked,
        fullName: studentName,
        institution: studentInstitution,
        verificationStatus: 'VERIFIED'
      }
    };
  },

  /**
   * Add a Self-Declared Skill
   */
  declareSkill({ userId, skillName, proficiency = 50 }) {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) throw new Error('Skill name is required.');

    const id = `sk-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const stmt = db.prepare(`
      INSERT INTO student_skills (id, user_id, skill_name, is_verified, proficiency, overall_score, proficiency_level)
      VALUES (?, ?, ?, 0, ?, 0, 'Self-Declared')
      ON CONFLICT(user_id, skill_name) DO UPDATE SET
        proficiency = excluded.proficiency,
        updated_at = CURRENT_TIMESTAMP
    `);
    stmt.run(id, userId, trimmedSkill, parseInt(proficiency, 10));

    return { success: true, message: `Added self-declared skill: ${trimmedSkill}` };
  },

  /**
   * Start 3-Stage Dynamic Skill Assessment
   */
  startAssessment({ userId, skillName }) {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) throw new Error('Skill name is required.');

    // 1. Generate dynamic randomized question set
    const assessmentSet = questionBankService.generateAssessmentSet(trimmedSkill);

    const attemptId = `att-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;

    // Store in DB
    const insertStmt = db.prepare(`
      INSERT INTO assessment_attempts (id, user_id, skill_name, current_stage, questions_data, status)
      VALUES (?, ?, ?, 1, ?, 'IN_PROGRESS')
    `);
    insertStmt.run(attemptId, userId, trimmedSkill, JSON.stringify(assessmentSet));

    // Return Stage 1 questions sanitized (without exposing correctAnswer)
    const stage1ClientQuestions = assessmentSet.stage1_easy.map(q => ({
      id: q.id,
      stage: 1,
      topic: q.topic,
      question: q.question,
      options: q.options
    }));

    return {
      attemptId,
      skillName: trimmedSkill,
      currentStage: 1,
      stageName: 'Stage 1 — Easy (Fundamental MCQs)',
      totalStages: 3,
      questions: stage1ClientQuestions
    };
  },

  /**
   * Submit Stage Answers (Evaluates Stage 1, 2, or 3)
   */
  submitStage({ userId, attemptId, stage, answers = {} }) {
    const attempt = db.prepare('SELECT * FROM assessment_attempts WHERE id = ? AND user_id = ?').get(attemptId, userId);
    if (!attempt) {
      throw new Error('Assessment session not found or unauthorized.');
    }

    const assessmentSet = JSON.parse(attempt.questions_data);
    const existingAnswers = attempt.answers_data ? JSON.parse(attempt.answers_data) : {};
    existingAnswers[`stage_${stage}`] = answers;

    let targetQuestions = [];
    if (stage === 1) targetQuestions = assessmentSet.stage1_easy;
    else if (stage === 2) targetQuestions = assessmentSet.stage2_medium;
    else if (stage === 3) targetQuestions = assessmentSet.stage3_hard;

    // Evaluate Stage
    const stageResult = questionBankService.evaluateStage({
      stage,
      questions: targetQuestions,
      userAnswers: answers
    });

    if (stage === 1) {
      // Update Stage 1 Score & Move to Stage 2
      db.prepare(`
        UPDATE assessment_attempts
        SET current_stage = 2, answers_data = ?, easy_score = ?
        WHERE id = ?
      `).run(JSON.stringify(existingAnswers), stageResult.score, attemptId);

      // Return Stage 2 questions
      const stage2ClientQuestions = assessmentSet.stage2_medium.map(q => ({
        id: q.id,
        stage: 2,
        topic: q.topic,
        title: q.title,
        description: q.description,
        codeSnippet: q.codeSnippet,
        testCases: q.testCases
      }));

      return {
        completed: false,
        previousStageScore: stageResult,
        nextStage: 2,
        stageName: 'Stage 2 — Medium (Programming & Test Cases)',
        questions: stage2ClientQuestions
      };
    }

    if (stage === 2) {
      // Update Stage 2 Score & Move to Stage 3
      db.prepare(`
        UPDATE assessment_attempts
        SET current_stage = 3, answers_data = ?, medium_score = ?
        WHERE id = ?
      `).run(JSON.stringify(existingAnswers), stageResult.score, attemptId);

      // Return Stage 3 questions
      const stage3ClientQuestions = assessmentSet.stage3_hard.map(q => ({
        id: q.id,
        stage: 3,
        topic: q.topic,
        title: q.title,
        description: q.description,
        requirements: q.requirements,
        testCases: q.testCases
      }));

      return {
        completed: false,
        previousStageScore: stageResult,
        nextStage: 3,
        stageName: 'Stage 3 — Hard (Real-World Problem Solving)',
        questions: stage3ClientQuestions
      };
    }

    if (stage === 3) {
      // Complete Assessment & Compute Comprehensive Analysis
      const easyScore = attempt.easy_score || 0;
      const mediumScore = attempt.medium_score || 0;
      const hardScore = stageResult.score;

      // Combine topic stats from all 3 stages
      const stage1Eval = questionBankService.evaluateStage({ stage: 1, questions: assessmentSet.stage1_easy, userAnswers: existingAnswers.stage_1 || {} });
      const stage2Eval = questionBankService.evaluateStage({ stage: 2, questions: assessmentSet.stage2_medium, userAnswers: existingAnswers.stage_2 || {} });

      const combinedTopicStats = { ...stage1Eval.topicStats, ...stage2Eval.topicStats, ...stageResult.topicStats };

      const analysis = questionBankService.computeComprehensiveAnalysis({
        skillName: attempt.skill_name,
        easyScore,
        mediumScore,
        hardScore,
        allTopicStats: combinedTopicStats
      });

      // Update attempt in DB
      db.prepare(`
        UPDATE assessment_attempts
        SET current_stage = 4,
            answers_data = ?,
            hard_score = ?,
            overall_score = ?,
            status = ?,
            analysis_data = ?,
            completed_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(
        JSON.stringify(existingAnswers),
        hardScore,
        analysis.overallScore,
        analysis.isVerified ? 'COMPLETED' : 'FAILED',
        JSON.stringify(analysis),
        attemptId
      );

      // Store/Update verified skill in student_skills
      const skillId = `sk-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
      const upsertSkill = db.prepare(`
        INSERT INTO student_skills (
          id, user_id, skill_name, is_verified, proficiency, overall_score, easy_score, medium_score, hard_score,
          strong_areas, weak_areas, improvement_recommendations, proficiency_level, verified_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, skill_name) DO UPDATE SET
          is_verified = excluded.is_verified,
          proficiency = excluded.overall_score,
          overall_score = excluded.overall_score,
          easy_score = excluded.easy_score,
          medium_score = excluded.medium_score,
          hard_score = excluded.hard_score,
          strong_areas = excluded.strong_areas,
          weak_areas = excluded.weak_areas,
          improvement_recommendations = excluded.improvement_recommendations,
          proficiency_level = excluded.proficiency_level,
          verified_at = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      `);
      upsertSkill.run(
        skillId,
        userId,
        attempt.skill_name,
        analysis.isVerified,
        analysis.overallScore,
        analysis.overallScore,
        easyScore,
        mediumScore,
        hardScore,
        JSON.stringify(analysis.strongAreas),
        JSON.stringify(analysis.weakAreas),
        JSON.stringify(analysis.improvementRecommendations),
        analysis.proficiencyLevel
      );

      // Notification for skill verification
      this.createNotification({
        userId,
        title: analysis.isVerified ? `⭐ ${attempt.skill_name} Verified (${analysis.overallScore}%)` : `${attempt.skill_name} Assessment Completed`,
        message: `Your skill assessment for ${attempt.skill_name} is complete. Overall Score: ${analysis.overallScore}% (${analysis.proficiencyLevel}).`,
        type: analysis.isVerified ? 'SUCCESS' : 'INFO'
      });

      // Automated Job Re-Qualification Check
      this.triggerJobRequalificationCheck(userId, attempt.skill_name);

      return {
        completed: true,
        analysis
      };
    }
  },

  /**
   * Compare Job Requirements against Student's VERIFIED Skills
   * Computes: PERFECTLY_QUALIFIED, QUALIFIED, NEEDS_IMPROVEMENT
   */
  getMatchedJobs(userId, userSkills = null) {
    const verifiedSkillsList = userSkills 
      ? userSkills.filter(s => s.isVerified) 
      : db.prepare('SELECT * FROM student_skills WHERE user_id = ? AND is_verified = 1').all(userId);

    const verifiedSkillsMap = new Map();
    verifiedSkillsList.forEach(s => {
      verifiedSkillsMap.set(s.skill_name?.toLowerCase() || s.name?.toLowerCase(), s.overall_score || s.overallScore || 75);
    });

    const jobs = db.prepare("SELECT * FROM jobs WHERE status = 'ACTIVE' ORDER BY created_at DESC").all();

    // Check user applications
    const appliedJobs = db.prepare('SELECT job_id, status FROM job_applications WHERE student_user_id = ?').all(userId);
    const appliedMap = new Map(appliedJobs.map(a => [a.job_id, a.status]));

    return jobs.map(job => {
      let required = [];
      try {
        required = JSON.parse(job.required_skills);
      } catch (e) {
        required = job.required_skills.split(',').map(s => s.trim());
      }

      const matchedSkills = [];
      const missingSkills = [];

      required.forEach(skill => {
        const norm = skill.toLowerCase();
        if (verifiedSkillsMap.has(norm)) {
          matchedSkills.push({ skill, score: verifiedSkillsMap.get(norm), verified: true });
        } else {
          missingSkills.push(skill);
        }
      });

      const matchRatio = required.length > 0 ? (matchedSkills.length / required.length) : 0;
      const matchScore = Math.round(matchRatio * 100);

      // Determine Qualification State
      let qualificationState = 'NEEDS_IMPROVEMENT';
      if (missingSkills.length === 0) {
        // All required skills are verified!
        // Check if student has additional verified skills exceeding job requirements
        if (verifiedSkillsMap.size > required.length) {
          qualificationState = 'PERFECTLY_QUALIFIED';
        } else {
          qualificationState = 'QUALIFIED';
        }
      }

      return {
        id: job.id,
        title: job.title,
        company: job.company,
        type: job.type,
        location: job.location,
        stipend: job.stipend,
        duration: job.duration,
        requiredSkills: required,
        matchedSkills,
        missingSkills,
        matchScore,
        qualificationState,
        minScore: job.min_score,
        description: job.description,
        isApplied: appliedMap.has(job.id),
        applicationStatus: appliedMap.get(job.id) || null
      };
    });
  },

  /**
   * Automated Job Re-Qualification Trigger
   * When student passes a new skill, re-evaluates all jobs.
   * If student newly satisfies requirements, sends a direct ready-to-apply alert.
   */
  triggerJobRequalificationCheck(userId, newlyVerifiedSkill) {
    try {
      const matchedJobs = this.getMatchedJobs(userId);

      matchedJobs.forEach(job => {
        if (!job.isApplied && (job.qualificationState === 'QUALIFIED' || job.qualificationState === 'PERFECTLY_QUALIFIED')) {
          // Check if this job requires the newly verified skill
          const requiresSkill = job.requiredSkills.some(
            s => s.toLowerCase() === newlyVerifiedSkill.toLowerCase()
          );

          if (requiresSkill) {
            // Check if alert already sent recently
            const existingNotif = db.prepare(`
              SELECT id FROM user_notifications 
              WHERE user_id = ? AND title LIKE ? AND created_at > datetime('now', '-1 day')
            `).get(userId, `%Ready to apply for ${job.title}%`);

            if (!existingNotif) {
              this.createNotification({
                userId,
                title: `🎯 Ready to Apply: ${job.title}`,
                message: `You now meet all verified skill requirements for ${job.title} at ${job.company}! Your qualification status is now ${job.qualificationState.replace('_', ' ')}.`,
                type: 'SUCCESS',
                link: `/student?tab=opportunities&jobId=${job.id}`
              });
            }
          }
        }
      });
    } catch (err) {
      console.warn('Error during job re-qualification trigger:', err.message);
    }
  },

  /**
   * Apply to Job with Verification Check
   */
  applyToJob({ userId, jobId, customNote = '' }) {
    const job = db.prepare('SELECT * FROM jobs WHERE id = ?').get(jobId);
    if (!job) throw new Error('Job listing not found.');

    const existing = db.prepare('SELECT id FROM job_applications WHERE job_id = ? AND student_user_id = ?').get(jobId, userId);
    if (existing) throw new Error('You have already submitted an application for this position.');

    // Calculate match score
    const matchedJobs = this.getMatchedJobs(userId);
    const targetJob = matchedJobs.find(j => j.id === jobId);
    const matchScore = targetJob ? targetJob.matchScore : 70;
    const qualificationState = targetJob ? targetJob.qualificationState : 'NEEDS_IMPROVEMENT';

    const appId = `app-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO job_applications (id, job_id, student_user_id, status, match_score, qualification_state, custom_note)
      VALUES (?, ?, ?, 'APPLIED', ?, ?, ?)
    `).run(appId, jobId, userId, matchScore, qualificationState, customNote);

    // Notify student
    this.createNotification({
      userId,
      title: `Application Submitted: ${job.title}`,
      message: `Your application to ${job.company} was submitted with verified credentials (${matchScore}% match).`,
      type: 'INFO'
    });

    // Notify recruiter if posted_by_user_id exists
    if (job.posted_by_user_id) {
      const studentProfile = db.prepare('SELECT name FROM student_profiles WHERE user_id = ?').get(userId);
      this.createNotification({
        userId: job.posted_by_user_id,
        title: `New Candidate Application: ${studentProfile?.name || 'Applicant'}`,
        message: `${studentProfile?.name || 'A student'} applied for ${job.title} (Match: ${matchScore}% - ${qualificationState.replace('_', ' ')}).`,
        type: 'SUCCESS'
      });
    }

    return { success: true, message: 'Application submitted successfully!', applicationId: appId };
  },

  /**
   * Helper: Create User Notification
   */
  createNotification({ userId, title, message, type = 'INFO', link = null }) {
    const id = `notif-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    db.prepare(`
      INSERT INTO user_notifications (id, user_id, title, message, type, link)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, userId, title, message, type, link);
  },

  /**
   * Mark Notification Read
   */
  markNotificationRead(userId, notificationId) {
    if (notificationId === 'all') {
      db.prepare('UPDATE user_notifications SET is_read = 1 WHERE user_id = ?').run(userId);
    } else {
      db.prepare('UPDATE user_notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(notificationId, userId);
    }
    return { success: true };
  }
};
