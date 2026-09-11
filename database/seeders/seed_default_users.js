import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../academia.sqlite');
const schemaPath = path.resolve(__dirname, '../schemas/database.sql');

console.log('📦 Initializing SQLite Database at:', dbPath);
const db = new DatabaseSync(dbPath);

// Execute schema
const schemaSql = fs.readFileSync(schemaPath, 'utf8');
db.exec(schemaSql);
console.log('✅ Schema executed successfully.');

async function seedDefaultUsers() {
  console.log('🌱 Seeding verified stakeholder accounts & database records...');

  const passwordHashStudent = await bcrypt.hash('Student@123', 10);
  const passwordHashRecruiter = await bcrypt.hash('Recruiter@123', 10);
  const passwordHashCandidate2 = await bcrypt.hash('Student@123', 10);
  const passwordHashCandidate3 = await bcrypt.hash('Student@123', 10);
  const passwordHashCandidate4 = await bcrypt.hash('Student@123', 10);

  // 1. Core Users
  const users = [
    {
      id: 'usr-student-001',
      email: 'student@apex.edu',
      password_hash: passwordHashStudent,
      role: 'STUDENT',
      email_verified: 1,
      profile: {
        id: 'prof-stu-001',
        name: 'Rahul Sharma',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98765 43210',
        college: 'Apex Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '3rd Year (6th Sem)',
        graduation_year: '2027',
        cgpa: 8.84,
        location: 'Bangalore, India',
        career_goal: 'Backend Systems & Cloud Engineer',
        bio: 'Passionate 3rd-year CS student focusing on high-concurrency microservices, Spring Boot, distributed databases, and cloud infrastructure.',
        profile_completion: 92,
        skill_readiness: 85
      },
      identity: {
        type: 'AADHAAR',
        rawNumber: '548912349876',
        masked: 'XXXX-XXXX-9876',
        institution: 'Apex Institute of Technology'
      },
      skills: [
        {
          name: 'Java',
          isVerified: 1,
          proficiency: 82,
          overallScore: 82,
          easyScore: 90,
          mediumScore: 80,
          hardScore: 75,
          strongAreas: ['OOP', 'Classes and Objects', 'Exception Handling', 'Memory Management'],
          weakAreas: ['Multithreading', 'Advanced Concurrency'],
          recommendations: ['Practice synchronized locks and ReentrantReadWriteLock pipelines.'],
          proficiencyLevel: 'Proficient (Industry Ready)'
        },
        {
          name: 'SQL',
          isVerified: 1,
          proficiency: 80,
          overallScore: 80,
          easyScore: 85,
          mediumScore: 80,
          hardScore: 75,
          strongAreas: ['Joins', 'Aggregations', 'Indexes'],
          weakAreas: ['Window Functions', 'Query Optimization'],
          recommendations: ['Study CTE recursion and query execution plan indexing.'],
          proficiencyLevel: 'Proficient (Industry Ready)'
        },
        {
          name: 'Spring Boot',
          isVerified: 1,
          proficiency: 74,
          overallScore: 74,
          easyScore: 80,
          mediumScore: 75,
          hardScore: 65,
          strongAreas: ['REST Controllers', 'Dependency Injection', 'JPA'],
          weakAreas: ['Circuit Breakers', 'Security Filter Chains'],
          recommendations: ['Build resilience pipelines using Resilience4j.'],
          proficiencyLevel: 'Proficient (Industry Ready)'
        },
        {
          name: 'Docker',
          isVerified: 0,
          proficiency: 55,
          overallScore: 0,
          easyScore: 0,
          mediumScore: 0,
          hardScore: 0,
          strongAreas: [],
          weakAreas: [],
          recommendations: ['Take the 3-stage verification assessment to verify Docker skills.'],
          proficiencyLevel: 'Self-Declared'
        }
      ]
    },
    {
      id: 'usr-student-002',
      email: 'priya.iyer@apex.edu',
      password_hash: passwordHashCandidate2,
      role: 'STUDENT',
      email_verified: 1,
      profile: {
        id: 'prof-stu-002',
        name: 'Priya Iyer',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        phone: '+91 98111 22334',
        college: 'Apex Institute of Technology',
        department: 'Computer Science & Engineering',
        year: '3rd Year (6th Sem)',
        graduation_year: '2027',
        cgpa: 9.12,
        location: 'Bangalore, India',
        career_goal: 'Full Stack & Cloud Developer',
        bio: 'Full stack developer passionate about React, Spring Boot, and cloud databases.',
        profile_completion: 95,
        skill_readiness: 90
      },
      identity: {
        type: 'AADHAAR',
        rawNumber: '678912345678',
        masked: 'XXXX-XXXX-5678',
        institution: 'Apex Institute of Technology'
      },
      skills: [
        {
          name: 'Java',
          isVerified: 1,
          proficiency: 92,
          overallScore: 92,
          easyScore: 100,
          mediumScore: 90,
          hardScore: 85,
          strongAreas: ['OOP', 'Streams & Lambdas', 'Collections', 'Threading'],
          weakAreas: [],
          recommendations: ['Maintain expert level code challenge practice.'],
          proficiencyLevel: 'Advanced (Production Ready)'
        },
        {
          name: 'Spring Boot',
          isVerified: 1,
          proficiency: 88,
          overallScore: 88,
          easyScore: 90,
          mediumScore: 90,
          hardScore: 85,
          strongAreas: ['REST APIs', 'Spring Security', 'JPA'],
          weakAreas: [],
          recommendations: ['Ready for production microservices architecture.'],
          proficiencyLevel: 'Advanced (Production Ready)'
        },
        {
          name: 'SQL',
          isVerified: 1,
          proficiency: 85,
          overallScore: 85,
          easyScore: 90,
          mediumScore: 85,
          hardScore: 80,
          strongAreas: ['Complex Joins', 'Window Functions'],
          weakAreas: [],
          recommendations: ['Database query tuning complete.'],
          proficiencyLevel: 'Advanced (Production Ready)'
        }
      ]
    },
    {
      id: 'usr-student-003',
      email: 'arjun.verma@apex.edu',
      password_hash: passwordHashCandidate3,
      role: 'STUDENT',
      email_verified: 1,
      profile: {
        id: 'prof-stu-003',
        name: 'Arjun Verma',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        phone: '+91 97222 33445',
        college: 'Apex Institute of Technology',
        department: 'Information Technology',
        year: '4th Year (8th Sem)',
        graduation_year: '2026',
        cgpa: 8.50,
        location: 'Hyderabad, India',
        career_goal: 'Distributed Systems & Cloud Engineer',
        bio: 'Final year IT student building high-throughput microservices.',
        profile_completion: 88,
        skill_readiness: 80
      },
      identity: {
        type: 'AADHAAR',
        rawNumber: '789012341234',
        masked: 'XXXX-XXXX-1234',
        institution: 'Apex Institute of Technology'
      },
      skills: [
        {
          name: 'Java',
          isVerified: 1,
          proficiency: 86,
          overallScore: 86,
          easyScore: 90,
          mediumScore: 85,
          hardScore: 80,
          strongAreas: ['OOP', 'Memory Management', 'Collections'],
          weakAreas: ['Streams'],
          recommendations: ['Refine functional stream pipeline patterns.'],
          proficiencyLevel: 'Advanced (Production Ready)'
        },
        {
          name: 'SQL',
          isVerified: 1,
          proficiency: 78,
          overallScore: 78,
          easyScore: 80,
          mediumScore: 80,
          hardScore: 70,
          strongAreas: ['DDL', 'DML', 'Joins'],
          weakAreas: ['Transactions'],
          recommendations: ['Review ACID isolation levels.'],
          proficiencyLevel: 'Proficient (Industry Ready)'
        }
      ]
    },
    {
      id: 'usr-student-004',
      email: 'sneha.patel@apex.edu',
      password_hash: passwordHashCandidate4,
      role: 'STUDENT',
      email_verified: 1,
      profile: {
        id: 'prof-stu-004',
        name: 'Sneha Patel',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
        phone: '+91 96333 44556',
        college: 'Apex Institute of Technology',
        department: 'Computer Science',
        year: '3rd Year (6th Sem)',
        graduation_year: '2027',
        cgpa: 7.95,
        location: 'Bangalore, India',
        career_goal: 'Junior Backend Developer',
        bio: 'Aspiring backend engineer learning Spring Boot and REST APIs.',
        profile_completion: 82,
        skill_readiness: 72
      },
      identity: {
        type: 'AADHAAR',
        rawNumber: '890112345555',
        masked: 'XXXX-XXXX-5555',
        institution: 'Apex Institute of Technology'
      },
      skills: [
        {
          name: 'Java',
          isVerified: 1,
          proficiency: 76,
          overallScore: 76,
          easyScore: 80,
          mediumScore: 75,
          hardScore: 70,
          strongAreas: ['OOP', 'Syntax'],
          weakAreas: ['Threading', 'Generics'],
          recommendations: ['Study concurrency locks and thread safety.'],
          proficiencyLevel: 'Proficient (Industry Ready)'
        }
      ]
    },
    {
      id: 'usr-industry-001',
      email: 'recruiter@apexdigital.io',
      password_hash: passwordHashRecruiter,
      role: 'INDUSTRY_RECRUITER',
      email_verified: 1,
      profile: {
        id: 'prof-ind-001',
        company_name: 'Apex Digital Labs',
        representative_name: 'Vikram Singhania',
        designation: 'VP of Engineering & University Relations',
        email: 'partnerships@apexdigital.io',
        website: 'https://apexdigital.io',
        industry_domain: 'Full Stack Development',
        company_size: '500–1,000 Employees',
        headquarters: 'Bangalore, India (Hubs: Hyderabad, San Francisco)',
        bio: 'Apex Digital Labs is a premier enterprise digital engineering partner building mission-critical cloud backends and AI accelerators.'
      },
      verification: {
        degreeName: 'Master of Technology in Computer Engineering',
        yearsOfExperience: 14,
        certificationName: 'Certified Talent Acquisition Lead & Technical Screener',
        domain: 'Full Stack Development',
        status: 'VERIFIED'
      },
      assessment: {
        domain: 'Full Stack Development',
        score: 95,
        status: 'PASSED'
      }
    }
  ];

  // Insert statements
  const insertUserStmt = db.prepare(`
    INSERT INTO users (id, email, password_hash, role, email_verified)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      password_hash = excluded.password_hash,
      role = excluded.role,
      email_verified = excluded.email_verified,
      updated_at = CURRENT_TIMESTAMP
  `);

  const insertStudentStmt = db.prepare(`
    INSERT INTO student_profiles (id, user_id, name, avatar, phone, college, department, year, graduation_year, cgpa, location, career_goal, bio, profile_completion, skill_readiness)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      name = excluded.name,
      college = excluded.college,
      department = excluded.department,
      career_goal = excluded.career_goal,
      skill_readiness = excluded.skill_readiness
  `);

  const insertIndustryStmt = db.prepare(`
    INSERT INTO industry_profiles (id, user_id, company_name, representative_name, designation, email, website, industry_domain, company_size, headquarters, bio)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      company_name = excluded.company_name,
      representative_name = excluded.representative_name,
      designation = excluded.designation,
      industry_domain = excluded.industry_domain
  `);

  const insertIdentityStmt = db.prepare(`
    INSERT INTO student_identities (id, user_id, identity_type, identity_number_hash, identity_number_masked, full_name, institution, verification_status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'VERIFIED')
    ON CONFLICT(user_id) DO UPDATE SET
      identity_number_hash = excluded.identity_number_hash,
      identity_number_masked = excluded.identity_number_masked,
      verification_status = 'VERIFIED'
  `);

  const insertSkillStmt = db.prepare(`
    INSERT INTO student_skills (
      id, user_id, skill_name, is_verified, proficiency, overall_score, easy_score, medium_score, hard_score,
      strong_areas, weak_areas, improvement_recommendations, proficiency_level, verified_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, skill_name) DO UPDATE SET
      is_verified = excluded.is_verified,
      proficiency = excluded.proficiency,
      overall_score = excluded.overall_score,
      easy_score = excluded.easy_score,
      medium_score = excluded.medium_score,
      hard_score = excluded.hard_score,
      strong_areas = excluded.strong_areas,
      weak_areas = excluded.weak_areas,
      improvement_recommendations = excluded.improvement_recommendations,
      proficiency_level = excluded.proficiency_level,
      verified_at = CURRENT_TIMESTAMP
  `);

  for (const u of users) {
    insertUserStmt.run(u.id, u.email, u.password_hash, u.role, u.email_verified);

    if (u.role === 'STUDENT') {
      const p = u.profile;
      insertStudentStmt.run(p.id, u.id, p.name, p.avatar, p.phone, p.college, p.department, p.year, p.graduation_year, p.cgpa, p.location, p.career_goal, p.bio, p.profile_completion, p.skill_readiness);

      if (u.identity) {
        const hash = crypto.createHash('sha256').update(u.identity.rawNumber).digest('hex');
        insertIdentityStmt.run(`id-ver-${u.id}`, u.id, u.identity.type, hash, u.identity.masked, p.name, u.identity.institution);
      }

      if (u.skills) {
        for (const s of u.skills) {
          const skId = `sk-${u.id}-${s.name.toLowerCase().replace(/\s+/g, '-')}`;
          insertSkillStmt.run(
            skId,
            u.id,
            s.name,
            s.isVerified,
            s.proficiency,
            s.overallScore,
            s.easyScore,
            s.mediumScore,
            s.hardScore,
            JSON.stringify(s.strongAreas),
            JSON.stringify(s.weakAreas),
            JSON.stringify(s.recommendations),
            s.proficiencyLevel
          );
        }
      }
    } else if (u.role === 'INDUSTRY_RECRUITER') {
      const p = u.profile;
      insertIndustryStmt.run(p.id, u.id, p.company_name, p.representative_name, p.designation, p.email, p.website, p.industry_domain, p.company_size, p.headquarters, p.bio);

      if (u.verification) {
        db.prepare(`
          INSERT INTO recruiter_verifications (
            id, user_id, degree_name, years_of_experience, certification_name, domain, status, verified_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id) DO UPDATE SET
            status = 'VERIFIED',
            verified_at = CURRENT_TIMESTAMP
        `).run(
          `rec-ver-${u.id}`,
          u.id,
          u.verification.degreeName,
          u.verification.yearsOfExperience,
          u.verification.certificationName,
          u.verification.domain,
          u.verification.status
        );
      }

      if (u.assessment) {
        db.prepare(`
          INSERT OR REPLACE INTO recruiter_assessments (
            id, user_id, domain, questions_data, answers_data, score, status, completed_at
          ) VALUES (?, ?, ?, '[]', '{}', ?, ?, CURRENT_TIMESTAMP)
        `).run(
          `rec-test-${u.id}`,
          u.id,
          u.assessment.domain,
          u.assessment.score,
          u.assessment.status
        );
      }
    }
  }

  // 2. Seed Jobs
  const jobs = [
    {
      id: 'job-001',
      posted_by_user_id: 'usr-industry-001',
      title: 'Backend Systems Engineer (Java & Cloud)',
      company: 'Apex Digital Labs',
      type: 'Internship',
      location: 'Bangalore, India (Hybrid)',
      stipend: '₹40,000 / month',
      duration: '6 Months (PPO: ₹16–22 LPA)',
      required_skills: JSON.stringify(['Java', 'Spring Boot', 'SQL']),
      preferred_skills: JSON.stringify(['Docker', 'AWS', 'Redis']),
      description: 'Join our Enterprise Cloud engineering unit developing high-throughput microservices. Requires strong verified Java, Spring Boot, and SQL fundamentals.',
      min_score: 70
    },
    {
      id: 'job-002',
      posted_by_user_id: 'usr-industry-001',
      title: 'Cloud Distributed Microservices Developer',
      company: 'Apex Digital Labs',
      type: 'Full-Time',
      location: 'Hyderabad, India (Hybrid)',
      stipend: '₹14.5 LPA Fixed',
      duration: 'Full-Time Employment',
      required_skills: JSON.stringify(['Java', 'Spring Boot', 'SQL', 'Docker']),
      preferred_skills: JSON.stringify(['Kubernetes', 'Kafka']),
      description: 'Architect mission-critical distributed systems. Requires verified Java, Spring Boot, SQL, and Docker container orchestration skills.',
      min_score: 75
    },
    {
      id: 'job-003',
      posted_by_user_id: 'usr-industry-001',
      title: 'Database & Data Infrastructure Intern',
      company: 'Apex Digital Labs',
      type: 'Internship',
      location: 'Bangalore, India',
      stipend: '₹35,000 / month',
      duration: '6 Months',
      required_skills: JSON.stringify(['SQL', 'Java']),
      preferred_skills: JSON.stringify(['PostgreSQL', 'Redis']),
      description: 'Optimize high-concurrency relational databases, index performance, and transaction execution pipelines.',
      min_score: 70
    }
  ];

  const insertJobStmt = db.prepare(`
    INSERT INTO jobs (
      id, posted_by_user_id, title, company, type, location, stipend, duration,
      required_skills, preferred_skills, description, min_score, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE')
    ON CONFLICT(id) DO UPDATE SET
      title = excluded.title,
      company = excluded.company,
      required_skills = excluded.required_skills,
      min_score = excluded.min_score
  `);

  for (const j of jobs) {
    insertJobStmt.run(
      j.id,
      j.posted_by_user_id,
      j.title,
      j.company,
      j.type,
      j.location,
      j.stipend,
      j.duration,
      j.required_skills,
      j.preferred_skills,
      j.description,
      j.min_score
    );
  }

  // 3. Seed Notifications for Student
  const insertNotifStmt = db.prepare(`
    INSERT OR REPLACE INTO user_notifications (id, user_id, title, message, type, link)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertNotifStmt.run(
    'notif-001',
    'usr-student-001',
    '⭐ Java Skill Verified (82%)',
    'Your 3-stage Java skill assessment was evaluated and verified on your Skill Passport.',
    'SUCCESS',
    '/student?tab=passport'
  );

  insertNotifStmt.run(
    'notif-002',
    'usr-student-001',
    '🎯 Ready to Apply: Backend Systems Engineer',
    'Your verified skills (Java, Spring Boot, SQL) match all stated requirements for Apex Digital Labs.',
    'SUCCESS',
    '/student?tab=opportunities&jobId=job-001'
  );

  console.log('🎉 Default accounts and database seed complete:');
  console.log('   👨‍🎓 Student Demo:    student@apex.edu (Pass: Student@123)');
  console.log('   🏢 Recruiter Demo:  recruiter@apexdigital.io (Pass: Recruiter@123)');
  console.log('   ✨ Candidate Discover Pool: Priya Iyer (Java 92%), Arjun Verma (Java 86%), Sneha Patel (Java 76%)');
}

seedDefaultUsers().catch(err => {
  console.error('❌ Error seeding database:', err);
  process.exit(1);
});
