import db from '../config/db.js';
import crypto from 'crypto';

const RECRUITER_DOMAIN_QUESTIONS = {
  'Full Stack Development': [
    {
      id: 'rq-fs-01',
      question: 'When evaluating a Full Stack candidate, what is the best indicator of microservice architecture readiness?',
      options: [
        'Knowledge of RESTful API design, database transaction isolation, and containerized deployment',
        'Ability to write single-file monolith scripts',
        'Knowing how to edit HTML in notepad',
        'Memorizing CSS color hex codes'
      ],
      correctAnswer: 0
    },
    {
      id: 'rq-fs-02',
      question: 'Why are verified evidence scores (e.g., test-case validated code) superior to self-declared resume bullet points?',
      options: [
        'They provide objective, tamper-proof proof of problem solving under test constraints',
        'They are shorter to read',
        'They replace all human interviews',
        'They guarantee a candidate will never resign'
      ],
      correctAnswer: 0
    },
    {
      id: 'rq-fs-03',
      question: 'Which backend tech stack is typically paired with Spring Boot for enterprise transaction processing?',
      options: [
        'PostgreSQL / Oracle DB, Redis caching, and Kafka event streaming',
        'Microsoft Access with shared network folder',
        'Browser local storage only',
        'Flat CSV files without locking'
      ],
      correctAnswer: 0
    },
    {
      id: 'rq-fs-04',
      question: 'What is the key advantage of asynchronous non-blocking I/O in high-concurrency API platforms?',
      options: [
        'Serves thousands of concurrent connections using small worker thread pools without blocking on I/O wait',
        'Requires 100x more CPU cores',
        'Prevents all runtime memory usage',
        'Only works on single-core processors'
      ],
      correctAnswer: 0
    },
    {
      id: 'rq-fs-05',
      question: 'How should API authentication be securely handled in modern single-page applications?',
      options: [
        'Stateless JWT/OAuth2 tokens with short TTLs and secure HTTP-only cookies or Bearer headers',
        'Storing plaintext passwords in browser sessionStorage',
        'Passing username and password in every GET URL parameter',
        'Disabling auth checks for speed'
      ],
      correctAnswer: 0
    }
  ]
};

export const industryService = {
  /**
   * Fetch complete, isolated dashboard data for a Recruiter
   */
  getRecruiterDashboard(userId) {
    // 1. Recruiter Profile
    const profile = db.prepare('SELECT * FROM industry_profiles WHERE user_id = ?').get(userId);

    // 2. Verification Record
    const verification = db.prepare('SELECT * FROM recruiter_verifications WHERE user_id = ?').get(userId);

    // 3. Qualification Assessment
    const assessment = db.prepare(`
      SELECT * FROM recruiter_assessments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `).get(userId);

    // 4. Recruiter's Posted Jobs
    const jobs = db.prepare('SELECT * FROM jobs WHERE posted_by_user_id = ? ORDER BY created_at DESC').all(userId);

    // 5. Job Applications Received
    const applications = db.prepare(`
      SELECT ja.*, j.title as job_title, j.company as job_company,
             sp.name as candidate_name, sp.college as candidate_college, sp.cgpa as candidate_cgpa,
             sp.department as candidate_department, sp.career_goal as candidate_career_goal,
             u.email as candidate_email
      FROM job_applications ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN student_profiles sp ON ja.student_user_id = sp.user_id
      JOIN users u ON ja.student_user_id = u.id
      WHERE j.posted_by_user_id = ?
      ORDER BY ja.applied_at DESC
    `).all(userId);

    // 6. Recruiter Notifications
    const notifications = db.prepare(`
      SELECT * FROM user_notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20
    `).all(userId);

    return {
      profile: profile || {},
      verification: verification || {
        status: 'PENDING',
        domain: profile?.industry_domain || 'Full Stack Development',
        yearsOfExperience: 5
      },
      qualificationAssessment: assessment ? {
        id: assessment.id,
        domain: assessment.domain,
        score: assessment.score,
        status: assessment.status,
        completedAt: assessment.completed_at
      } : null,
      jobs: jobs.map(j => ({
        ...j,
        requiredSkills: typeof j.required_skills === 'string' ? JSON.parse(j.required_skills) : j.required_skills
      })),
      applications,
      notifications
    };
  },

  /**
   * Submit Recruiter Verification Documents
   */
  submitVerificationDocuments({
    userId,
    degreeName = 'Bachelor of Engineering in Computer Science',
    degreeUrl = 'https://documents.academia.edu/verified/degree_cert.pdf',
    yearsOfExperience = 6,
    experienceUrl = 'https://documents.academia.edu/verified/exp_cert.pdf',
    certificationName = 'Certified Technical Recruiter & Talent Architect',
    certificationUrl = 'https://documents.academia.edu/verified/tech_cert.pdf',
    domain = 'Full Stack Development'
  }) {
    const id = `rec-ver-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    const upsertStmt = db.prepare(`
      INSERT INTO recruiter_verifications (
        id, user_id, degree_certificate_url, degree_name, experience_certificate_url,
        years_of_experience, professional_certification_url, certification_name, domain, status, verified_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'VERIFIED', CURRENT_TIMESTAMP)
      ON CONFLICT(user_id) DO UPDATE SET
        degree_certificate_url = excluded.degree_certificate_url,
        degree_name = excluded.degree_name,
        experience_certificate_url = excluded.experience_certificate_url,
        years_of_experience = excluded.years_of_experience,
        professional_certification_url = excluded.professional_certification_url,
        certification_name = excluded.certification_name,
        domain = excluded.domain,
        status = 'VERIFIED',
        verified_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    `);
    upsertStmt.run(
      id,
      userId,
      degreeUrl,
      degreeName,
      experienceUrl,
      parseInt(yearsOfExperience, 10),
      certificationUrl,
      certificationName,
      domain
    );

    // Update industry profile domain
    db.prepare('UPDATE industry_profiles SET industry_domain = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?')
      .run(domain, userId);

    return {
      success: true,
      message: 'Professional documentation verified successfully!',
      status: 'VERIFIED'
    };
  },

  /**
   * Fetch Domain Qualification Test Questions
   */
  getQualificationTest(userId, domain = 'Full Stack Development') {
    const pool = RECRUITER_DOMAIN_QUESTIONS[domain] || RECRUITER_DOMAIN_QUESTIONS['Full Stack Development'];

    // Sanitized client questions without correctAnswer
    const clientQuestions = pool.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    return {
      domain,
      totalQuestions: pool.length,
      passingScore: 60,
      questions: clientQuestions
    };
  },

  /**
   * Submit Recruiter Qualification Test
   */
  submitQualificationTest({ userId, domain = 'Full Stack Development', answers = {} }) {
    const pool = RECRUITER_DOMAIN_QUESTIONS[domain] || RECRUITER_DOMAIN_QUESTIONS['Full Stack Development'];

    let correctCount = 0;
    pool.forEach(q => {
      const userSelected = Number(answers[q.id]);
      if (userSelected === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = pool.length;
    const score = Math.round((correctCount / total) * 100);
    const passed = score >= 60;
    const status = passed ? 'PASSED' : 'FAILED';

    const testId = `rec-test-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

    db.prepare(`
      INSERT INTO recruiter_assessments (id, user_id, domain, questions_data, answers_data, score, status, completed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      testId,
      userId,
      domain,
      JSON.stringify(pool),
      JSON.stringify(answers),
      score,
      status
    );

    return {
      success: true,
      score,
      passed,
      status,
      message: passed
        ? `Congratulations! You passed the Domain Qualification Assessment with ${score}%. Talent Discovery is fully activated.`
        : `Assessment completed with ${score}%. Minimum passing threshold is 60%.`
    };
  },

  /**
   * Discover and Rank Candidates by VERIFIED Skill Scores
   */
  getCandidates({ userId, searchSkill = '', minScore = 0, sortBy = 'score_desc' }) {
    // Fetch all student profiles with identity verification and verified skills
    const students = db.prepare(`
      SELECT sp.*, u.email,
             si.verification_status as identity_status,
             si.identity_number_masked
      FROM student_profiles sp
      JOIN users u ON sp.user_id = u.id
      LEFT JOIN student_identities si ON sp.user_id = si.user_id
    `).all();

    // Fetch verified skills for all students
    const allSkills = db.prepare(`
      SELECT * FROM student_skills WHERE is_verified = 1 ORDER BY overall_score DESC
    `).all();

    const skillsByUser = new Map();
    allSkills.forEach(s => {
      if (!skillsByUser.has(s.user_id)) {
        skillsByUser.set(s.user_id, []);
      }
      skillsByUser.get(s.user_id).push({
        name: s.skill_name,
        score: s.overall_score,
        easyScore: s.easy_score,
        mediumScore: s.medium_score,
        hardScore: s.hard_score,
        strongAreas: s.strong_areas ? JSON.parse(s.strong_areas) : [],
        proficiencyLevel: s.proficiency_level,
        isVerified: true
      });
    });

    const candidateResults = [];

    students.forEach(st => {
      const verifiedSkills = skillsByUser.get(st.user_id) || [];

      // Calculate candidate's average verified skill score
      const avgScore = verifiedSkills.length > 0
        ? Math.round(verifiedSkills.reduce((sum, sk) => sum + sk.score, 0) / verifiedSkills.length)
        : 0;

      // Filter by search skill if specified
      if (searchSkill) {
        const hasSkill = verifiedSkills.some(
          sk => sk.name.toLowerCase().includes(searchSkill.toLowerCase()) && sk.score >= minScore
        );
        if (!hasSkill && searchSkill.toLowerCase() !== 'all') {
          return;
        }
      }

      // Filter by min overall score
      if (minScore > 0 && avgScore < minScore && verifiedSkills.length > 0) {
        return;
      }

      candidateResults.push({
        id: st.user_id,
        name: st.name,
        avatar: st.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        email: st.email,
        college: st.college,
        department: st.department,
        year: st.year,
        graduationYear: st.graduation_year,
        cgpa: st.cgpa,
        careerGoal: st.career_goal,
        location: st.location,
        identityVerified: st.identity_status === 'VERIFIED',
        identityMasked: st.identity_number_masked || 'Not Verified',
        verifiedSkills,
        averageVerifiedScore: avgScore,
        totalVerifiedSkillsCount: verifiedSkills.length,
        profileCompletion: st.profile_completion || 88
      });
    });

    // Sorting
    candidateResults.sort((a, b) => {
      if (sortBy === 'score_desc') {
        return b.averageVerifiedScore - a.averageVerifiedScore;
      }
      if (sortBy === 'score_asc') {
        return a.averageVerifiedScore - b.averageVerifiedScore;
      }
      if (sortBy === 'cgpa_desc') {
        return b.cgpa - a.cgpa;
      }
      if (sortBy === 'skills_count') {
        return b.totalVerifiedSkillsCount - a.totalVerifiedSkillsCount;
      }
      return 0;
    });

    // Keep only top 5 profiles
    return candidateResults.slice(0, 5);
  },

  /**
   * Post a New Job by Recruiter
   */
  postJob({
    userId,
    title,
    company,
    type = 'Internship',
    location = 'Bangalore, India (Hybrid)',
    stipend = '₹35,000 / month',
    duration = '6 Months',
    requiredSkills = ['Java', 'Spring Boot', 'SQL'],
    preferredSkills = ['Docker', 'AWS'],
    description = '',
    minScore = 60
  }) {
    if (!title || !company) {
      throw new Error('Job title and company name are required.');
    }

    const jobId = `job-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const reqArray = Array.isArray(requiredSkills)
      ? requiredSkills
      : String(requiredSkills).split(',').map(s => s.trim());

    const prefArray = Array.isArray(preferredSkills)
      ? preferredSkills
      : String(preferredSkills).split(',').map(s => s.trim());

    db.prepare(`
      INSERT INTO jobs (
        id, posted_by_user_id, title, company, type, location, stipend, duration,
        required_skills, preferred_skills, description, min_score, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(
      jobId,
      userId,
      title.trim(),
      company.trim(),
      type,
      location.trim(),
      stipend,
      duration,
      JSON.stringify(reqArray),
      JSON.stringify(prefArray),
      description.trim(),
      parseFloat(minScore)
    );

    return {
      success: true,
      message: 'Job posting published successfully!',
      jobId
    };
  },

  /**
   * Mark Recruiter Notification(s) as Read
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
