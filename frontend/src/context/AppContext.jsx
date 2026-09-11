import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_STUDENT,
  INITIAL_SKILLS,
  INITIAL_OPPORTUNITIES,
  INITIAL_PROBLEM_BANK,
  INITIAL_ASSESSMENTS,
  INITIAL_ACTION_PLAN,
  INITIAL_APPLICATIONS,
  INITIAL_ACTIVE_INTERNSHIP,
  INITIAL_INDUSTRY_PROFILE,
  INITIAL_FACULTY_PROFILE,
  INITIAL_INSTITUTION_DATA,
  INITIAL_NOTIFICATIONS
} from '../data/mockData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current Role: 'landing' | 'student' | 'industry' | 'faculty' | 'institution'
  const [currentRole, setCurrentRole] = useState(() => {
    return localStorage.getItem('academia_role') || 'student';
  });

  const [activeTab, setActiveTab] = useState('overview');

  // Student State
  const [studentProfile, setStudentProfile] = useState(() => {
    const saved = localStorage.getItem('academia_student');
    return saved ? JSON.parse(saved) : INITIAL_STUDENT;
  });

  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('academia_skills');
    return saved ? JSON.parse(saved) : INITIAL_SKILLS;
  });

  const [opportunities, setOpportunities] = useState(() => {
    const saved = localStorage.getItem('academia_opportunities');
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [problemBank, setProblemBank] = useState(() => {
    const saved = localStorage.getItem('academia_problem_bank');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEM_BANK;
  });

  const [assessments, setAssessments] = useState(() => {
    const saved = localStorage.getItem('academia_assessments');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  const [actionPlan, setActionPlan] = useState(() => {
    const saved = localStorage.getItem('academia_action_plan');
    return saved ? JSON.parse(saved) : INITIAL_ACTION_PLAN;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('academia_applications');
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [activeInternship, setActiveInternship] = useState(() => {
    const saved = localStorage.getItem('academia_internship');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_INTERNSHIP;
  });

  // Industry State
  const [industryProfile, setIndustryProfile] = useState(() => {
    const saved = localStorage.getItem('academia_industry');
    return saved ? JSON.parse(saved) : INITIAL_INDUSTRY_PROFILE;
  });

  // Faculty State
  const [facultyProfile, setFacultyProfile] = useState(() => {
    const saved = localStorage.getItem('academia_faculty');
    return saved ? JSON.parse(saved) : INITIAL_FACULTY_PROFILE;
  });

  // Institution State
  const [institutionData, setInstitutionData] = useState(() => {
    const saved = localStorage.getItem('academia_institution');
    return saved ? JSON.parse(saved) : INITIAL_INSTITUTION_DATA;
  });

  // Notifications State
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('academia_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // UI Modals State
  const [activeModal, setActiveModal] = useState(null); // 'assessment' | 'apply' | 'post-opp' | 'post-problem' | 'ai-parser' | 'auth' | 'action-plan-detail'
  const [modalPayload, setModalPayload] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('academia_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('academia_student', JSON.stringify(studentProfile));
    localStorage.setItem('academia_skills', JSON.stringify(skills));
    localStorage.setItem('academia_opportunities', JSON.stringify(opportunities));
    localStorage.setItem('academia_problem_bank', JSON.stringify(problemBank));
    localStorage.setItem('academia_assessments', JSON.stringify(assessments));
    localStorage.setItem('academia_action_plan', JSON.stringify(actionPlan));
    localStorage.setItem('academia_applications', JSON.stringify(applications));
    localStorage.setItem('academia_internship', JSON.stringify(activeInternship));
    localStorage.setItem('academia_industry', JSON.stringify(industryProfile));
    localStorage.setItem('academia_faculty', JSON.stringify(facultyProfile));
    localStorage.setItem('academia_institution', JSON.stringify(institutionData));
    localStorage.setItem('academia_notifications', JSON.stringify(notifications));
  }, [
    studentProfile,
    skills,
    opportunities,
    problemBank,
    assessments,
    actionPlan,
    applications,
    activeInternship,
    industryProfile,
    facultyProfile,
    institutionData,
    notifications
  ]);

  // Trigger role switch
  const switchRole = (role, defaultTab = 'overview') => {
    setCurrentRole(role);
    setActiveTab(defaultTab);
  };

  // Add Notification
  const addNotification = (notif) => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false,
      ...notif
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Mark all notifications read
  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Student Actions: Take Assessment
  const submitAssessmentResult = (assessmentId, userAnswers, score, total, subTopicScores) => {
    const percentage = Math.round((score / total) * 100);

    // Find the skill matching this assessment
    const targetAssessment = assessments.find(a => a.id === assessmentId);
    if (targetAssessment) {
      setSkills(prevSkills => {
        return prevSkills.map(sk => {
          if (sk.id === targetAssessment.skillId || sk.name.toLowerCase().includes(targetAssessment.category.toLowerCase())) {
            const updatedProficiency = Math.round((sk.proficiency * 0.4) + (percentage * 0.6));
            return {
              ...sk,
              proficiency: Math.min(100, updatedProficiency),
              status: 'Verified Evidence',
              lastUpdated: 'Just now',
              evidence: {
                ...sk.evidence,
                assessmentScore: percentage,
                assessmentName: targetAssessment.skillName,
                assessmentDate: 'Sep 2026 (Live Verified)'
              }
            };
          }
          return sk;
        });
      });

      // Boost overall student readiness
      setStudentProfile(prev => ({
        ...prev,
        skillReadiness: Math.min(96, prev.skillReadiness + 3)
      }));

      // Celebration confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addNotification({
        roleTarget: 'student',
        title: `Assessment Completed: ${percentage}%`,
        message: `Your Skill Passport for ${targetAssessment.skillName} has been verified and updated!`,
        type: 'success'
      });
    }
  };

  // Student Actions: Toggle Action Plan Task
  const toggleActionPlanTask = (taskId, skillName, points) => {
    setActionPlan(prevPlan => {
      const updatedMissing = prevPlan.missingSkills.map(skillGroup => {
        if (skillGroup.skillName === skillName) {
          const updatedTasks = skillGroup.tasks.map(t => {
            if (t.id === taskId) {
              return { ...t, completed: !t.completed };
            }
            return t;
          });
          return { ...skillGroup, tasks: updatedTasks };
        }
        return skillGroup;
      });
      return { ...prevPlan, missingSkills: updatedMissing };
    });

    // Check if turning on
    const currentGroup = actionPlan.missingSkills.find(g => g.skillName === skillName);
    const targetTask = currentGroup?.tasks.find(t => t.id === taskId);
    const isNowCompleted = !targetTask?.completed;

    if (isNowCompleted) {
      // Boost skill in passport
      setSkills(prev => prev.map(sk => {
        if (sk.name.toLowerCase().includes(skillName.toLowerCase()) || skillName.toLowerCase().includes(sk.name.toLowerCase())) {
          const newProf = Math.min(95, sk.proficiency + points);
          return {
            ...sk,
            proficiency: newProf,
            lastUpdated: 'Just now (Action Plan Task)'
          };
        }
        return sk;
      }));

      // Boost student readiness
      setStudentProfile(prev => ({
        ...prev,
        skillReadiness: Math.min(95, prev.skillReadiness + 2)
      }));

      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.7 }
      });
    }
  };

  // Student Actions: Apply to Opportunity
  const applyToOpportunity = (opportunity, customNote = '') => {
    const existing = applications.find(a => a.opportunityId === opportunity.id);
    if (existing) return false;

    const newApplication = {
      id: `app-${Date.now()}`,
      opportunityId: opportunity.id,
      title: opportunity.title,
      company: opportunity.company,
      appliedDate: 'Just now',
      status: 'Applied',
      statusStage: 1,
      matchScore: opportunity.matchScore,
      customNote,
      timeline: [
        { stage: 'Applied', date: 'Just now', note: 'Application submitted with Evidence-based Skill Passport.' }
      ]
    };

    setApplications(prev => [newApplication, ...prev]);

    // Recruiter notification
    addNotification({
      roleTarget: 'industry',
      title: `New Candidate Application: ${studentProfile.name}`,
      message: `${studentProfile.name} (Match: ${opportunity.matchScore}%) applied for ${opportunity.title}.`,
      type: 'success'
    });

    // Student notification
    addNotification({
      roleTarget: 'student',
      title: `Application Sent: ${opportunity.title}`,
      message: `Your application to ${opportunity.company} was submitted successfully.`,
      type: 'info'
    });

    return true;
  };

  // Industry Actions: Post New Opportunity
  const postNewOpportunity = (newOpp) => {
    const created = {
      id: `opp-${Date.now()}`,
      postedDate: 'Just now',
      matchScore: 80,
      whyMatch: 'Matches student profile requirements with modern tech stack requirements.',
      ...newOpp
    };
    setOpportunities(prev => [created, ...prev]);

    // Update industry stats
    setIndustryProfile(prev => ({
      ...prev,
      stats: { ...prev.stats, activeListings: prev.stats.activeListings + 1 }
    }));

    addNotification({
      roleTarget: 'student',
      title: `New Opportunity: ${newOpp.title}`,
      message: `${newOpp.company || industryProfile.companyName} just posted a new ${newOpp.type}.`,
      type: 'info'
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Industry Actions: Post Real-World Problem to Problem Bank
  const postProblemStatement = (newProb) => {
    const created = {
      id: `prob-${Date.now()}`,
      status: 'Open for Student & Faculty Teams',
      applicantsCount: 0,
      ...newProb
    };
    setProblemBank(prev => [created, ...prev]);

    setIndustryProfile(prev => ({
      ...prev,
      stats: { ...prev.stats, solvedProblemProjects: prev.stats.solvedProblemProjects + 1 }
    }));

    addNotification({
      roleTarget: 'faculty',
      title: `New Industry Problem Challenge Posted`,
      message: `Industry partner posted: "${newProb.title}". Supervise a student team to participate.`,
      type: 'info'
    });

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // Industry Actions: Submit Mentor Evaluation for Active Intern
  const submitMentorEvaluation = (evalData) => {
    setActiveInternship(prev => ({
      ...prev,
      mentorEvaluation: {
        lastEvaluated: 'Just now',
        evaluator: industryProfile.representativeName,
        scores: evalData.scores,
        overallAverage: evalData.overallAverage,
        summaryRemarks: evalData.summaryRemarks,
        recommendedSkillsForPassport: evalData.recommendedSkills
      }
    }));

    // Update student's skills based on recommendation
    evalData.recommendedSkills.forEach(rec => {
      setSkills(prev => prev.map(sk => {
        if (sk.name.toLowerCase().includes(rec.skill.toLowerCase())) {
          return {
            ...sk,
            proficiency: Math.min(99, sk.proficiency + 4),
            evidence: {
              ...sk.evidence,
              industryMentorRating: Math.round(evalData.overallAverage * 20),
              facultyEvaluation: Math.min(95, sk.evidence.facultyEvaluation + 3)
            }
          };
        }
        return sk;
      }));
    });

    addNotification({
      roleTarget: 'student',
      title: `⭐ Industry Mentor Evaluation Received!`,
      message: `${industryProfile.companyName} submitted your performance evaluation (${evalData.overallAverage}/5.0). Skill Passport updated!`,
      type: 'success'
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Student Actions: Add Weekly Logbook Entry
  const addInternshipWeeklyLog = (logEntry) => {
    setActiveInternship(prev => {
      const nextWeekNumber = prev.weeklyLogs.length + 1;
      const newLog = {
        week: nextWeekNumber,
        title: logEntry.title,
        tasks: logEntry.tasks,
        skillsPracticed: logEntry.skillsPracticed || ['Java', 'Cloud'],
        status: 'Submitted for Mentor Approval',
        mentorFeedback: 'Pending mentor weekly review',
        mentorRating: 5.0
      };
      return {
        ...prev,
        progressPercentage: Math.min(100, Math.round(((nextWeekNumber) / 12) * 100)),
        weeklyLogs: [...prev.weeklyLogs, newLog]
      };
    });

    addNotification({
      roleTarget: 'industry',
      title: `Weekly Log Submitted by Intern Rahul Sharma`,
      message: `Week ${activeInternship.weeklyLogs.length + 1} deliverables submitted for review.`,
      type: 'info'
    });
  };

  // Faculty Actions: Recommend Resource/Action to Mentee
  const recommendToMentee = (studentId, recommendationText) => {
    setFacultyProfile(prev => {
      const updatedList = prev.studentsList.map(st => {
        if (st.id === studentId) {
          return { ...st, recommendedAction: recommendationText };
        }
        return st;
      });
      return { ...prev, studentsList: updatedList };
    });

    addNotification({
      roleTarget: 'student',
      title: `Recommendation from Faculty Mentor Dr. Ananya Sharma`,
      message: recommendationText,
      type: 'info'
    });
  };

  // Institution Administrator: Trigger Closed-Loop Campus Training Program
  const createTrainingProgram = (skillTarget, durationWeeks = 4, trainerPartner = 'Apex Digital Labs') => {
    // Dynamically update the Skill Demand Heatmap
    setInstitutionData(prev => {
      const updatedHeatmap = prev.skillDemandHeatmap.map(row => {
        if (row.skill.toLowerCase().includes(skillTarget.toLowerCase()) || skillTarget.toLowerCase().includes(row.skill.toLowerCase())) {
          const newAvailability = Math.min(88, row.studentAvailability + 28);
          const newGap = Math.max(8, row.industryDemand - newAvailability);
          return {
            ...row,
            studentAvailability: newAvailability,
            gapPercentage: newGap,
            gapLevel: newGap > 35 ? 'High Gap' : newGap > 18 ? 'Medium Gap' : 'Low Gap',
            studentsTrained: row.studentsTrained + 120,
            recommendation: `Bootcamp Active (Partner: ${trainerPartner})`
          };
        }
        return row;
      });

      return {
        ...prev,
        skillDemandHeatmap: updatedHeatmap
      };
    });

    // Also boost student's skill in that category
    setSkills(prev => prev.map(sk => {
      if (skillTarget.toLowerCase().includes(sk.name.toLowerCase()) || sk.name.toLowerCase().includes(skillTarget.toLowerCase())) {
        return {
          ...sk,
          proficiency: Math.min(92, sk.proficiency + 22),
          status: 'Verified Evidence (Campus Immersion Completed)'
        };
      }
      return sk;
    }));

    // Broadcast notifications to all stakeholders
    addNotification({
      roleTarget: 'student',
      title: `🎓 Campus Training Program Launched: ${skillTarget}`,
      message: `Apex Institute partnered with ${trainerPartner} for a ${durationWeeks}-week Immersion Bootcamp. Enroll now!`,
      type: 'success'
    });

    addNotification({
      roleTarget: 'faculty',
      title: `New FDP & Student Immersion: ${skillTarget}`,
      message: `Faculty nomination open for ${trainerPartner}-sponsored technical certification.`,
      type: 'info'
    });

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 }
    });
  };

  // Reset to Demo Data
  const resetToDemoData = () => {
    localStorage.clear();
    setStudentProfile(INITIAL_STUDENT);
    setSkills(INITIAL_SKILLS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setProblemBank(INITIAL_PROBLEM_BANK);
    setAssessments(INITIAL_ASSESSMENTS);
    setActionPlan(INITIAL_ACTION_PLAN);
    setApplications(INITIAL_APPLICATIONS);
    setActiveInternship(INITIAL_ACTIVE_INTERNSHIP);
    setIndustryProfile(INITIAL_INDUSTRY_PROFILE);
    setFacultyProfile(INITIAL_FACULTY_PROFILE);
    setInstitutionData(INITIAL_INSTITUTION_DATA);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCurrentRole('student');
    setActiveTab('overview');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeTab,
        setActiveTab,
        switchRole,
        studentProfile,
        setStudentProfile,
        skills,
        setSkills,
        opportunities,
        setOpportunities,
        problemBank,
        setProblemBank,
        assessments,
        actionPlan,
        applications,
        setApplications,
        activeInternship,
        setActiveInternship,
        industryProfile,
        setIndustryProfile,
        facultyProfile,
        setFacultyProfile,
        institutionData,
        setInstitutionData,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markAllNotificationsRead,
        submitAssessmentResult,
        toggleActionPlanTask,
        applyToOpportunity,
        postNewOpportunity,
        postProblemStatement,
        submitMentorEvaluation,
        addInternshipWeeklyLog,
        recommendToMentee,
        createTrainingProgram,
        resetToDemoData,
        activeModal,
        setActiveModal,
        modalPayload,
        setModalPayload
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
