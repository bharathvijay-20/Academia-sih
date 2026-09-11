import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  X, 
  FileText, 
  Briefcase, 
  Compass, 
  Search, 
  CheckCircle2, 
  ArrowRight, 
  Cpu, 
  Bot, 
  Layers,
  Copy,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AIAssistantModal = () => {
  const { 
    activeModal, 
    setActiveModal, 
    studentProfile, 
    skills, 
    setSkills, 
    opportunities, 
    addNotification 
  } = useApp();

  const [activeTab, setActiveTab] = useState('resume-parser'); // 'resume-parser' | 'jd-extractor' | 'counselor' | 'nl-search'
  
  // State for Resume Parser
  const [resumeText, setResumeText] = useState(
`RAHUL SHARMA
B.Tech in Computer Science & Engineering (2023 - 2027) | CGPA: 8.84
Apex Institute of Technology, Bangalore

SKILLS:
• Languages & Frameworks: Java, Spring Boot, REST APIs, Python, React.js
• Databases: PostgreSQL, Redis, MySQL
• Tools: Git, Maven, Docker (Basics), Postman

PROJECTS:
1. Distributed E-Commerce Backend (Java 17, Spring Boot, PostgreSQL)
   - Architected 4 decoupled microservices with JWT authentication and Redis caching.
2. Hospital Bed & Queue Telemetry (Spring Boot, React, SQL)
   - Real-time websocket notifications for patient queue triage.`);

  const [parsedSkills, setParsedSkills] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // State for JD Extractor
  const [jdText, setJdText] = useState(
`Senior Backend Engineering Intern (Spring Boot & Cloud)
We are seeking an ambitious engineer to design and maintain high-scale REST APIs in Java and Spring Boot. You will interact with PostgreSQL databases, containerize services using Docker, and configure AWS ECS clusters for automated deployment.`);

  const [extractedJd, setExtractedJd] = useState(null);

  // State for Counselor
  const [counselorQuery, setCounselorQuery] = useState('How can I close my skill gap in Docker and AWS to reach 95% readiness for Apex Digital Labs?');
  const [counselorResponse, setCounselorResponse] = useState(null);

  // State for Natural Language Search
  const [nlQuery, setNlQuery] = useState('Find 3rd-year students with Java > 75%, Spring Boot experience, and verified backend projects');
  const [searchResults, setSearchResults] = useState(null);

  if (activeModal !== 'ai-parser') return null;

  // Run Resume Analysis
  const handleAnalyzeResume = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setParsedSkills({
        candidate: 'Rahul Sharma',
        extractedCgpa: '8.84 / 10',
        degree: 'B.Tech CSE (Class of 2027)',
        skills: [
          { name: 'Java', proficiency: 85, evidenceType: 'Code Projects + Syntax' },
          { name: 'Spring Boot', proficiency: 75, evidenceType: 'Microservices Project' },
          { name: 'REST API & Microservices', proficiency: 82, evidenceType: 'JWT + REST Spec' },
          { name: 'PostgreSQL & SQL', proficiency: 78, evidenceType: 'Database Schema Project' },
          { name: 'Docker & Containers', proficiency: 40, evidenceType: 'Basics Mentioned' },
          { name: 'React.js', proficiency: 60, evidenceType: 'Frontend Interface' }
        ],
        careerFit: 'Backend Distributed Systems Engineer (86% Target Match)',
        recommendedAdditions: ['Add Docker Compose project evidence', 'Complete AWS Cloud Practitioner certification']
      });
      setIsAnalyzing(false);
    }, 800);
  };

  // Sync Extracted Skills to Profile
  const handleSyncSkills = () => {
    if (!parsedSkills) return;
    setSkills(prev => prev.map(sk => {
      const match = parsedSkills.skills.find(p => p.name.toLowerCase() === sk.name.toLowerCase());
      if (match) {
        return {
          ...sk,
          proficiency: Math.max(sk.proficiency, match.proficiency),
          status: 'AI Resume Verified',
          lastUpdated: 'Just now (Resume Extracted)'
        };
      }
      return sk;
    }));

    addNotification({
      roleTarget: 'student',
      title: 'Skills Synced from Resume AI Parser',
      message: 'Your Skill Passport has been updated with newly parsed evidence!',
      type: 'success'
    });

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setActiveModal(null);
  };

  // Run JD Extraction
  const handleExtractJD = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setExtractedJd({
        detectedRole: 'Backend Cloud Engineering Intern',
        experienceRequired: 'Fresher / Pre-final Year',
        requiredSkills: [
          { skill: 'Java', weight: '30%', importance: 'Core Mandatory' },
          { skill: 'Spring Boot', weight: '25%', importance: 'Core Mandatory' },
          { skill: 'PostgreSQL & SQL', weight: '20%', importance: 'Core Mandatory' },
          { skill: 'Docker & Containers', weight: '15%', importance: 'Preferred / Growing' },
          { skill: 'AWS Cloud Basics', weight: '10%', importance: 'Preferred' }
        ],
        generatedEvaluationRubric: 'Rule-based matching: 75% core programming/DB + 25% containerization & cloud architecture.'
      });
      setIsAnalyzing(false);
    }, 700);
  };

  // Run Counselor Advice
  const handleAskCounselor = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setCounselorResponse({
        headline: 'Personalized 3-Step Acceleration Plan for Apex Digital Labs',
        readinessProjection: 'Current: 84% ➔ Projected: 95% in 2 Weeks',
        steps: [
          {
            title: '1. Build & Containerize a Multi-Stage Spring Boot Project',
            action: 'Take your existing E-Commerce backend and write a multi-stage Dockerfile using eclipse-temurin:17-jre-alpine. Use docker-compose to orchestrate Spring Boot, PostgreSQL, and Redis.',
            timeRequired: '3-4 hours',
            readinessBoost: '+7%'
          },
          {
            title: '2. Take the Academia Docker Practical Assessment',
            action: 'Complete the 4-question interactive assessment on Docker networking and volume mounts to earn a verified evidence badge on your Skill Passport.',
            timeRequired: '15 mins',
            readinessBoost: '+5%'
          },
          {
            title: '3. Attend the Apex Labs Campus Cloud Workshop',
            action: 'Enroll in the upcoming 2-day hands-on masterclass on Oct 12-13 organized through Apex Institute.',
            timeRequired: 'Weekend masterclass',
            readinessBoost: '+4%'
          }
        ]
      });
      setIsAnalyzing(false);
    }, 800);
  };

  // Run Natural Language Candidate Search
  const handleNLSearch = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setSearchResults([
        {
          id: 'stu-001',
          name: 'Rahul Sharma',
          college: 'Apex Institute of Tech',
          cgpa: '8.84',
          year: '3rd Year (2027)',
          matchScore: 94,
          skillsBreakdown: 'Java: 82% (Verified) | Spring Boot: 72% | PostgreSQL: 75% | Projects: 2 Backend Repos',
          status: 'Available for Hybrid / Bangalore'
        },
        {
          id: 'stu-002',
          name: 'Priya Iyer',
          college: 'Apex Institute of Tech',
          cgpa: '9.12',
          year: '3rd Year (2027)',
          matchScore: 88,
          skillsBreakdown: 'Java: 78% | Spring Boot: 70% | React: 90% | Projects: Full-Stack Hospital Portal',
          status: 'Available for Remote / Hybrid'
        },
        {
          id: 'stu-003',
          name: 'Arjun Verma',
          college: 'Apex Institute of Tech',
          cgpa: '9.45',
          year: '4th Year (2026)',
          matchScore: 84,
          skillsBreakdown: 'Java: 80% | Python/ML: 95% | PostgreSQL: 70% | Projects: ML Telemetry',
          status: 'Interviewing'
        }
      ]);
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-dropdown rounded-3xl border border-white/15 overflow-hidden flex flex-col shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-white">Academia AI Intelligence Suite</h3>
              <p className="text-xs text-slate-400">Natural language extraction, skill gap counseling & explainable matching</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 bg-slate-950/60 overflow-x-auto">
          {[
            { id: 'resume-parser', label: '1. Resume Skill Extractor', icon: FileText },
            { id: 'jd-extractor', label: '2. Job Description Parser', icon: Briefcase },
            { id: 'counselor', label: '3. AI Skill Gap Counselor', icon: Compass },
            { id: 'nl-search', label: '4. Natural Language Search', icon: Search }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                  isActive
                    ? 'border-indigo-500 text-indigo-300 bg-indigo-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: RESUME SKILL EXTRACTOR */}
          {activeTab === 'resume-parser' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-indigo-300">Feature 1:</span> Paste raw resume text or candidate markdown. The AI analyzes technical keywords, project evidence, and maps them directly to the student's Evidence-based Skill Passport.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Paste Resume Content (Text / Markdown):
                </label>
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="w-full glass-input rounded-xl p-3.5 text-xs text-slate-100 font-mono focus:ring-2 focus:ring-indigo-500 border border-white/10 resize-none"
                  placeholder="Paste resume text here..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleAnalyzeResume}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" />
                  {isAnalyzing ? 'Extracting Technical Vectors...' : 'Extract Skills with AI'}
                </button>
              </div>

              {parsedSkills && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-white flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        AI Extraction Report: {parsedSkills.candidate}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {parsedSkills.degree} • CGPA: {parsedSkills.extractedCgpa}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {parsedSkills.careerFit}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {parsedSkills.skills.map((sk, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold text-slate-200">{sk.name}</p>
                          <p className="text-[10px] text-slate-400">{sk.evidenceType}</p>
                        </div>
                        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {sk.proficiency}% Conf.
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/10 flex justify-end">
                    <button
                      onClick={handleSyncSkills}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      Sync Extracted Skills to Student Passport
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOB DESCRIPTION EXTRACTOR */}
          {activeTab === 'jd-extractor' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-cyan-300">Feature 2:</span> Recruiters can paste unstructured job postings. The AI parser extracts required vs. preferred skill tokens and computes optimal weighting percentages for the matching engine.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Paste Corporate Job / Internship Description:
                </label>
                <textarea
                  rows={6}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  className="w-full glass-input rounded-xl p-3.5 text-xs text-slate-100 font-mono focus:ring-2 focus:ring-cyan-500 border border-white/10 resize-none"
                  placeholder="Paste job description..."
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleExtractJD}
                  disabled={isAnalyzing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white font-semibold text-xs shadow-lg shadow-cyan-600/30 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  <Cpu className="w-4 h-4" />
                  {isAnalyzing ? 'Extracting Skills & Weights...' : 'Parse Requirements & Generate Match Formula'}
                </button>
              </div>

              {extractedJd && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-white">Parsed Role: {extractedJd.detectedRole}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Eligibility: {extractedJd.experienceRequired}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-300">Extracted Skills & Deterministic Match Weights:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {extractedJd.requiredSkills.map((req, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                          <span className="text-xs text-slate-200 font-medium">{req.skill}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-400">{req.importance}</span>
                            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                              {req.weight}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5 text-[11px] text-slate-300">
                    <span className="font-semibold text-cyan-400">Explainability Formula: </span>
                    {extractedJd.generatedEvaluationRubric}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI SKILL COUNSELOR */}
          {activeTab === 'counselor' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-purple-950/40 border border-purple-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-purple-300">Feature 3:</span> Students & Faculty can ask conversational career questions. The AI references live institutional skill gap matrices and active recruiter requirements to produce hyper-practical action steps.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Ask Career / Skill Gap Counselor:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={counselorQuery}
                    onChange={(e) => setCounselorQuery(e.target.value)}
                    className="flex-1 glass-input rounded-xl px-4 py-3 text-xs text-slate-100 border border-white/10 focus:ring-2 focus:ring-purple-500"
                    placeholder="Ask any skill gap / learning path question..."
                  />
                  <button
                    onClick={handleAskCounselor}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-purple-600/30 hover:scale-[1.02] transition-all disabled:opacity-50 shrink-0"
                  >
                    <Bot className="w-4 h-4" />
                    {isAnalyzing ? 'Counseling...' : 'Get Guidance'}
                  </button>
                </div>
              </div>

              {counselorResponse && (
                <div className="p-5 rounded-2xl bg-slate-900/90 border border-purple-500/30 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h4 className="font-semibold text-sm text-purple-300">{counselorResponse.headline}</h4>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {counselorResponse.readinessProjection}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {counselorResponse.steps.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-white">{step.title}</p>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                            {step.readinessBoost}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{step.action}</p>
                        <span className="text-[10px] text-slate-400 block">Est. Time: {step.timeRequired}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NATURAL LANGUAGE CANDIDATE SEARCH */}
          {activeTab === 'nl-search' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/20 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-amber-300">Feature 4:</span> Recruiters can type queries in plain natural language. The system parses criteria into structured database filters and ranks candidate Skill Passports with transparent breakdown scores.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Recruiter Natural Language Query:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nlQuery}
                    onChange={(e) => setNlQuery(e.target.value)}
                    className="flex-1 glass-input rounded-xl px-4 py-3 text-xs text-slate-100 border border-white/10 focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g. Find students with Java > 75% and backend project evidence graduating 2027"
                  />
                  <button
                    onClick={handleNLSearch}
                    disabled={isAnalyzing}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-semibold text-xs shadow-lg shadow-amber-600/30 hover:scale-[1.02] transition-all disabled:opacity-50 shrink-0"
                  >
                    <Search className="w-4 h-4" />
                    {isAnalyzing ? 'Matching...' : 'Search Candidates'}
                  </button>
                </div>
              </div>

              {searchResults && (
                <div className="space-y-3 animate-in fade-in">
                  <p className="text-xs font-semibold text-slate-300">
                    Found {searchResults.length} Verified Candidate Matches:
                  </p>
                  {searchResults.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-amber-500/40 transition-all">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-white">{c.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">{c.year}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-amber-300">CGPA: {c.cgpa}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">{c.skillsBreakdown}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{c.college} • {c.status}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-lg font-extrabold text-amber-400 font-display">{c.matchScore}%</span>
                          <span className="text-[10px] text-slate-400 block">AI Match</span>
                        </div>
                        <button
                          onClick={() => {
                            setActiveModal(null);
                            addNotification({
                              roleTarget: 'industry',
                              title: `Candidate ${c.name} Profile Inspected`,
                              message: `Shortlisted candidate for technical interview loop.`,
                              type: 'info'
                            });
                          }}
                          className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors"
                        >
                          View Passport
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
