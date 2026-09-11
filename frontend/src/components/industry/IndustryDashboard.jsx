import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { industryService } from '../../services/industryService';
import { Navbar } from '../layout/Navbar';
import { Sidebar } from '../layout/Sidebar';
import { 
  Building2, 
  PlusCircle, 
  Users, 
  FileText, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  ArrowRight, 
  Loader2,
  ExternalLink,
  GraduationCap,
  Briefcase,
  TrendingUp,
  Filter,
  Check
} from 'lucide-react';

export const IndustryDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Dashboard Data State
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    profile: {},
    verification: { status: 'PENDING', domain: 'Full Stack Development', yearsOfExperience: 5 },
    qualificationAssessment: null,
    jobs: [],
    applications: [],
    notifications: []
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Professional Verification State
  const [degreeName, setDegreeName] = useState('Master of Technology in Computer Engineering');
  const [yearsOfExperience, setYearsOfExperience] = useState(6);
  const [certificationName, setCertificationName] = useState('Certified Talent Acquisition Lead & Technical Screener');
  const [domain, setDomain] = useState('Full Stack Development');
  const [isVerifyingDocs, setIsVerifyingDocs] = useState(false);

  // Qualification Test State
  const [testQuestions, setTestQuestions] = useState([]);
  const [testAnswers, setTestAnswers] = useState({});
  const [isTakingTest, setIsTakingTest] = useState(false);
  const [testSubmitting, setTestSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Candidate Discovery State
  const [candidates, setCandidates] = useState([]);
  const [searchSkill, setSearchSkill] = useState('');
  const [minScoreFilter, setMinScoreFilter] = useState(0);
  const [sortBy, setSortBy] = useState('score_desc');
  const [candidateLoading, setCandidateLoading] = useState(false);

  // Post Job Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [jobType, setJobType] = useState('Internship');
  const [jobLocation, setJobLocation] = useState('Bangalore, India (Hybrid)');
  const [jobStipend, setJobStipend] = useState('₹40,000 / month');
  const [jobDuration, setJobDuration] = useState('6 Months');
  const [jobRequiredSkills, setJobRequiredSkills] = useState('Java, Spring Boot, SQL');
  const [jobPreferredSkills, setJobPreferredSkills] = useState('Docker, AWS');
  const [jobDescription, setJobDescription] = useState('Looking for backend distributed microservices engineers with verified Java competency.');
  const [jobMinScore, setJobMinScore] = useState(70);
  const [isPostingJob, setIsPostingJob] = useState(false);

  // Load Recruiter Dashboard
  const loadDashboard = async () => {
    try {
      setIsLoading(true);
      const res = await industryService.getDashboard();
      setDashboardData({
        profile: res.profile || {},
        verification: res.verification || { status: 'PENDING', domain: 'Full Stack Development', yearsOfExperience: 5 },
        qualificationAssessment: res.qualificationAssessment || null,
        jobs: res.jobs || [],
        applications: res.applications || [],
        notifications: res.notifications || []
      });

      if (res.profile?.company_name) {
        setJobCompany(res.profile.company_name);
      }
    } catch (err) {
      console.warn('Recruiter dashboard load notice:', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load Candidates for Discovery
  const loadCandidates = async () => {
    try {
      setCandidateLoading(true);
      const res = await industryService.getCandidates({
        searchSkill,
        minScore: minScoreFilter,
        sortBy
      });
      setCandidates(res.candidates || []);
    } catch (err) {
      console.error('Error loading candidates:', err);
    } finally {
      setCandidateLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  useEffect(() => {
    if (activeTab === 'candidates') {
      loadCandidates();
    }
  }, [activeTab, searchSkill, minScoreFilter, sortBy]);

  // Submit Verification Documents
  const handleVerifyDocuments = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsVerifyingDocs(true);

    try {
      const res = await industryService.verifyDocuments({
        degreeName,
        yearsOfExperience,
        certificationName,
        domain
      });
      setSuccessMessage(res.message || 'Professional credentials verified!');
      await loadDashboard();
    } catch (err) {
      setErrorMessage(err.message || 'Document verification failed.');
    } finally {
      setIsVerifyingDocs(false);
    }
  };

  // Start Qualification Test
  const handleStartQualificationTest = async () => {
    setErrorMessage('');
    setTestResult(null);
    setTestAnswers({});
    setIsTakingTest(true);

    try {
      const res = await industryService.getQualificationTest(dashboardData.verification?.domain || 'Full Stack Development');
      setTestQuestions(res.questions || []);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load test questions.');
      setIsTakingTest(false);
    }
  };

  // Submit Qualification Test
  const handleSubmitQualificationTest = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setTestSubmitting(true);

    try {
      const res = await industryService.submitQualificationTest({
        domain: dashboardData.verification?.domain || 'Full Stack Development',
        answers: testAnswers
      });
      setTestResult(res);
      setIsTakingTest(false);
      await loadDashboard();
      if (res.passed) {
        setSuccessMessage(res.message);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Test submission failed.');
    } finally {
      setTestSubmitting(false);
    }
  };

  // Post Job Opportunity
  const handlePostJob = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsPostingJob(true);

    try {
      const res = await industryService.postJob({
        title: jobTitle,
        company: jobCompany || dashboardData.profile?.company_name || 'Apex Digital Labs',
        type: jobType,
        location: jobLocation,
        stipend: jobStipend,
        duration: jobDuration,
        requiredSkills: jobRequiredSkills.split(',').map(s => s.trim()),
        preferredSkills: jobPreferredSkills.split(',').map(s => s.trim()),
        description: jobDescription,
        minScore: jobMinScore
      });

      setSuccessMessage('Job opening published successfully! Matching candidates can now view and apply.');
      setJobTitle('');
      await loadDashboard();
      setActiveTab('overview');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to post job.');
    } finally {
      setIsPostingJob(false);
    }
  };

  // Notifications click navigation & persistent read update
  const handleNotificationClick = async (notif) => {
    try {
      await industryService.markNotificationRead(notif.id);
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => n.id === notif.id ? { ...n, is_read: 1, read: true } : n)
      }));
    } catch (err) {
      console.warn('Failed to mark notification read:', err);
    }

    if (notif.link && notif.link.includes('applications')) {
      setActiveTab('applications');
    } else if (notif.link && notif.link.includes('candidates')) {
      setActiveTab('candidates');
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await industryService.markNotificationRead('all');
      setDashboardData(prev => ({
        ...prev,
        notifications: prev.notifications.map(n => ({ ...n, is_read: 1, read: true }))
      }));
    } catch (err) {
      console.warn('Failed to mark all notifications read:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
          <span className="text-xs font-medium text-slate-400">Loading Recruiter Dashboard...</span>
        </div>
      </div>
    );
  }

  const isVerified = dashboardData.verification?.status === 'VERIFIED';
  const hasPassedQualification = dashboardData.qualificationAssessment?.status === 'PASSED';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Header */}
      <Navbar 
        notifications={dashboardData.notifications}
        onNotificationClick={handleNotificationClick}
        onMarkAllRead={handleMarkAllNotificationsRead}
      />

      {/* Main Layout */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Sidebar */}
          <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Main Content Area */}
          <section className="flex-1 min-w-0 space-y-6">
            
            {/* Alerts */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{errorMessage}</div>
                <button onClick={() => setErrorMessage('')} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
            )}

            {successMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{successMessage}</div>
                <button onClick={() => setSuccessMessage('')} className="text-slate-400 hover:text-white text-xs">✕</button>
              </div>
            )}

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Welcome Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h1 className="text-xl font-bold text-white">
                          {dashboardData.profile?.representative_name || user?.name || 'Recruiter'}
                        </h1>
                        {isVerified && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="w-3 h-3" /> Verified Recruiter
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {dashboardData.profile?.company_name} • {dashboardData.profile?.designation} (Domain: {dashboardData.profile?.industry_domain})
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setActiveTab('candidates')}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium shadow transition-colors"
                      >
                        <Users className="w-4 h-4" />
                        <span>Discover Verified Talent</span>
                      </button>
                      <button
                        onClick={() => setActiveTab('post-opportunity')}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Post Job</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Active Job Postings</span>
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{dashboardData.jobs.length}</div>
                    <p className="text-[11px] text-slate-400 mt-1">Live vacancies receiving applications</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Candidate Applications</span>
                      <FileText className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">{dashboardData.applications.length}</div>
                    <p className="text-[11px] text-slate-400 mt-1">Applicants with verified credentials</p>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-400">Verified Talent Pool</span>
                      <Users className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mt-2">
                      10+ Candidates
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Validated via 3-stage skill assessments
                    </p>
                  </div>
                </div>

                {/* Active Jobs Section */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-cyan-400" />
                      <span>Active Job Openings</span>
                    </h2>
                    <button
                      onClick={() => setActiveTab('post-opportunity')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                    >
                      Post New Listing <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {dashboardData.jobs.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-slate-800 rounded-xl">
                      <p className="text-xs text-slate-400">No active job listings posted.</p>
                      <button
                        onClick={() => setActiveTab('post-opportunity')}
                        className="mt-3 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-medium"
                      >
                        Create Job Listing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {dashboardData.jobs.map(job => (
                        <div key={job.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div>
                            <h3 className="font-bold text-xs text-white">{job.title}</h3>
                            <p className="text-[11px] text-slate-400">{job.type} • {job.location} • {job.stipend}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {job.requiredSkills?.map((sk, idx) => (
                                <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                            Active Listing
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: CANDIDATE DISCOVERY & VERIFIED SKILL RANKING */}
            {activeTab === 'candidates' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" />
                    <span>Candidate Discovery & Verified Skill Ranking</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Rank and discover students based on objectively verified 3-stage assessment scores. Self-declared claims are excluded from ranking.
                  </p>
                </div>

                {/* Filter & Sort Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Search by Verified Skill</label>
                    <input
                      type="text"
                      value={searchSkill}
                      onChange={e => setSearchSkill(e.target.value)}
                      placeholder="e.g. Java, Spring Boot, SQL..."
                      className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-cyan-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Min. Verified Score</label>
                    <select
                      value={minScoreFilter}
                      onChange={e => setMinScoreFilter(parseInt(e.target.value, 10))}
                      className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-cyan-500 outline-none"
                    >
                      <option value="0">All Scores (Min 0%)</option>
                      <option value="70">Proficient (Min 70%)</option>
                      <option value="80">Advanced (Min 80%)</option>
                      <option value="90">Top Expert (Min 90%)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-400 mb-1">Sort Candidates By</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value)}
                      className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-cyan-500 outline-none"
                    >
                      <option value="score_desc">Verified Skill Score (Highest First)</option>
                      <option value="cgpa_desc">Academic CGPA (Highest First)</option>
                      <option value="skills_count">Total Verified Skills Count</option>
                    </select>
                  </div>
                </div>

                {/* Candidates List */}
                {candidateLoading ? (
                  <div className="text-center py-10">
                    <Loader2 className="w-6 h-6 text-cyan-500 animate-spin mx-auto" />
                    <span className="text-xs text-slate-400 mt-2 block">Searching verified talent...</span>
                  </div>
                ) : candidates.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    No candidates found matching the selected skill and score threshold.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {candidates.slice(0, 5).map((cand, index) => (
                      <div key={cand.id} className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm text-white">
                              {cand.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-white">
                                #{index + 1} {cand.name}
                              </h3>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {cand.college} • {cand.department} (CGPA: {cand.cgpa})
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-medium text-slate-400 block">Avg Verified Score:</span>
                            <span className="text-lg font-bold text-emerald-400">{cand.averageVerifiedScore}%</span>
                          </div>
                        </div>

                        {/* Verified Skills Breakdown */}
                        <div className="bg-slate-900 p-3 rounded-lg space-y-2">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Verified Assessment Evidence:</span>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {cand.verifiedSkills.map((sk, skIdx) => (
                              <div key={skIdx} className="p-2 rounded bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                                <span className="font-medium text-slate-200">{sk.name}</span>
                                <span className="font-bold text-emerald-400">{sk.score}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* TAB 5: POST JOB OPENING */}
            {activeTab === 'post-opportunity' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-indigo-400" />
                    <span>Post Job / Internship Listing</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Create targeted listings with verified skill prerequisites. Candidates will be automatically matched based on their assessment scores.
                  </p>
                </div>

                <form onSubmit={handlePostJob} className="space-y-4 max-w-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Job Title</label>
                      <input
                        type="text"
                        required
                        value={jobTitle}
                        onChange={e => setJobTitle(e.target.value)}
                        placeholder="e.g. Backend Distributed Systems Engineer"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Company Name</label>
                      <input
                        type="text"
                        required
                        value={jobCompany}
                        onChange={e => setJobCompany(e.target.value)}
                        placeholder="e.g. Apex Digital Labs"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Position Type</label>
                      <select
                        value={jobType}
                        onChange={e => setJobType(e.target.value)}
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      >
                        <option value="Internship">Internship</option>
                        <option value="Full-Time">Full-Time</option>
                        <option value="Project Challenge">Project Challenge</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Stipend / Package</label>
                      <input
                        type="text"
                        value={jobStipend}
                        onChange={e => setJobStipend(e.target.value)}
                        placeholder="₹40,000 / mo"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">Duration</label>
                      <input
                        type="text"
                        value={jobDuration}
                        onChange={e => setJobDuration(e.target.value)}
                        placeholder="6 Months"
                        className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={e => setJobLocation(e.target.value)}
                      placeholder="e.g. Bangalore, India (Hybrid)"
                      className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Required Skills (Comma separated — candidates must have these verified)
                    </label>
                    <input
                      type="text"
                      required
                      value={jobRequiredSkills}
                      onChange={e => setJobRequiredSkills(e.target.value)}
                      placeholder="Java, Spring Boot, SQL"
                      className="w-full bg-slate-950 rounded-xl px-3 py-2 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Description & Requirements</label>
                    <textarea
                      rows={3}
                      value={jobDescription}
                      onChange={e => setJobDescription(e.target.value)}
                      className="w-full bg-slate-950 rounded-xl p-3 text-xs text-white border border-slate-700 focus:border-indigo-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPostingJob}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow transition-colors flex items-center gap-2"
                  >
                    {isPostingJob ? <Loader2 className="w-4 h-4 animate-spin" /> : <PlusCircle className="w-4 h-4" />}
                    <span>Publish Job Listing</span>
                  </button>
                </form>
              </div>
            )}

            {/* TAB 6: CANDIDATE APPLICATIONS */}
            {activeTab === 'applications' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <span>Candidate Applications</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Review candidate submissions with verified skill credentials.
                  </p>
                </div>

                {dashboardData.applications.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl">
                    No applications received for your posted jobs yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dashboardData.applications.map(app => (
                      <div key={app.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-white">{app.candidate_name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              {app.qualification_state.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Applied for: <strong className="text-slate-200">{app.job_title}</strong> • {app.candidate_college} (CGPA: {app.candidate_cgpa})
                          </p>
                          <span className="text-[10px] text-slate-500 block mt-1">Applied: {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-bold text-indigo-400">Match: {app.match_score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </section>
        </div>
      </main>

    </div>
  );
};
