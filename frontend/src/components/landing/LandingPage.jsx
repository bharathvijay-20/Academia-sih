import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  Building2, 
  Sparkles, 
  ArrowRight, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Zap
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();

  const stakeholders = [
    {
      id: 'student',
      title: '1. Students Workspace',
      subtitle: 'Skill Passports & Dynamic Career Acceleration',
      icon: GraduationCap,
      color: 'from-indigo-600 to-blue-600',
      borderColor: 'border-slate-800 hover:border-indigo-500/40',
      description: 'Discover opportunities, verify skills via 3-stage assessments, build tamper-proof portfolios, and get matched to jobs based on verified competence.',
      features: ['Evidence-based Skill Passport', '3-Stage Dynamic Assessments', 'Automated Job Requalification', 'Career Match Matrix']
    },
    {
      id: 'industry',
      title: '2. Industry / Recruiters Workspace',
      subtitle: 'Talent Discovery & Verified Competence Hiring',
      icon: Building2,
      color: 'from-cyan-600 to-teal-600',
      borderColor: 'border-slate-800 hover:border-cyan-500/40',
      description: 'Discover candidates with objectively verified skill assessment scores, post job openings, verify recruiter credentials, and screen candidates by domain.',
      features: ['Verified Talent Discovery', 'Skill-Score Candidate Ranking', 'Recruiter Qualification Screening', 'Direct Candidate Applications']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-xl tracking-tight text-white">ACADEMIA</span>
                <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  Zero-Friction Access
                </span>
              </div>
            </div>

            {/* Single Login Button in Top Right Corner */}
            <div className="flex items-center">
              <Link
                to="/login"
                id="header-login-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* Main Landing Content */}
      <main className="flex-1 space-y-16 pb-16">
        
        {/* Hero Section */}
        <section className="relative pt-12 sm:pt-16 pb-6 text-center space-y-6 max-w-4xl mx-auto px-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-Powered Academia–Industry Collaboration Ecosystem</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white font-display tracking-tight leading-tight">
            Bridge the Gap Between <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-400">
              Academic Skills & Industry Demand
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Directly access dedicated workspaces for <strong className="text-white">Students</strong> and <strong className="text-white">Industry Recruiters</strong> with verified competency pipelines.
          </p>

          {/* Exactly ONE Button Under the Bridge Gap Text */}
          <div className="flex justify-center pt-4">
            <Link
              to="/login"
              id="hero-signin-btn"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>Get Started / Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </section>

        {/* 2 Stakeholder Overview Cards */}
        <section className="space-y-8 max-w-5xl mx-auto px-4">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Ecosystem Architecture</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">Integrated Workspaces</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Empowering students with verified evidence portfolios and recruiters with competence-based hiring.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stakeholders.map(stake => {
              const Icon = stake.icon;
              return (
                <div
                  key={stake.id}
                  className={`bg-slate-900/80 p-6 sm:p-8 rounded-3xl border ${stake.borderColor} space-y-5 transition-all shadow-xl flex flex-col justify-between`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className={`p-3 rounded-2xl bg-gradient-to-br ${stake.color} text-white shadow-lg`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-white">
                            {stake.title}
                          </h3>
                          <p className="text-xs text-slate-400">{stake.subtitle}</p>
                        </div>
                      </div>

                      <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Active
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      {stake.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-2">
                      {stake.features.map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Signature Features Highlight Grid */}
        <section className="p-8 sm:p-12 rounded-3xl border border-slate-800 max-w-6xl mx-auto px-4 space-y-8 bg-slate-900/60">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Core Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-display">Key Platform Features</h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              Empowering students and recruiters through verified competency and role-based workflows.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <Award className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-xs text-white">1. Verified Skill Passport</h4>
              <p className="text-[11px] text-slate-300">Evidence backing through 3-stage assessments, test cases, and difficulty-graded problems.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h4 className="font-bold text-xs text-white">2. 3-Stage Assessments</h4>
              <p className="text-[11px] text-slate-300">10 Easy MCQs, 5 Medium test-case programming questions, and 2 Hard real-world challenges.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              <h4 className="font-bold text-xs text-white">3. Explainable Job Matching</h4>
              <p className="text-[11px] text-slate-300">Compares verified skills against job requirements with automated qualification status.</p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h4 className="font-bold text-xs text-white">4. Talent Discovery</h4>
              <p className="text-[11px] text-slate-300">Recruiters discover and rank candidates strictly by verified skill assessment scores.</p>
            </div>

          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-400">
          ACADEMIA AI ECOSYSTEM • TECH VADERS (SIH26044)
        </p>
        <p className="text-[11px] text-slate-500">
          Direct Role Workspaces • Evidence-Based Skill Passports • Enterprise Collaboration
        </p>
      </footer>

    </div>
  );
};
