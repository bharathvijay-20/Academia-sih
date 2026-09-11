import React, { useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  LayoutDashboard,
  Award,
  CheckSquare,
  Briefcase,
  UserCheck,
  PlusCircle,
  Users,
  FileText,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  Target,
  GraduationCap
} from 'lucide-react';

export const Sidebar = ({ activeTab = 'overview', onTabChange = () => {} }) => {
  const { role } = useAuth();
  const isStudent = role === 'STUDENT';
  const [isOpen, setIsOpen] = useState(false);

  // Student Navigation Items
  const studentNav = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'learning-hub', label: 'Learning Hub', icon: GraduationCap, badge: 'Skills' },
    { id: 'assessment', label: 'Skill Assessments', icon: CheckSquare, badge: '3-Stage' },
    { id: 'placement-prep', label: 'Placement Prep & Tests', icon: Target, badge: 'Coding & Aptitude' },
    { id: 'passport', label: 'Verified Skill Passport', icon: Award },
    { id: 'opportunities', label: 'Job Search & Matching', icon: Briefcase },
    { id: 'internships', label: 'Internship Packages & Offers', icon: Sparkles, badge: 'Stipend' },
    { id: 'applications', label: 'Application Tracker', icon: FileText }
  ];

  // Recruiter Navigation Items
  const recruiterNav = [
    { id: 'overview', label: 'Recruiter Dashboard', icon: LayoutDashboard },
    { id: 'candidates', label: 'Candidate Discovery', icon: Users, badge: 'Verified Skills' },
    { id: 'post-opportunity', label: 'Post Job Opening', icon: PlusCircle },
    { id: 'applications', label: 'Candidate Applications', icon: FileText }
  ];

  const navItems = isStudent ? studentNav : recruiterNav;
  const activeColorClass = isStudent ? 'bg-indigo-600 shadow-indigo-600/20' : 'bg-cyan-600 shadow-cyan-600/20';
  const activeItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const ActiveIcon = activeItem ? activeItem.icon : LayoutDashboard;

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0">
      <div className="sticky top-24 space-y-2">
        
        {/* 🔘 Single Button Trigger with Animated Indicator */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          id="sidebar-modules-toggle-btn"
          className={`w-full flex items-center justify-between p-3 rounded-2xl bg-slate-900 border transition-all duration-300 shadow-xl cursor-pointer group ${
            isOpen 
              ? isStudent 
                ? 'border-indigo-500/50 shadow-indigo-500/10' 
                : 'border-cyan-500/50 shadow-cyan-500/10'
              : 'border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
          }`}
          aria-expanded={isOpen}
          title="Toggle Navigation Modules"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors shadow-sm ${
              isStudent ? 'bg-indigo-600 text-white' : 'bg-cyan-600 text-white'
            }`}>
              <ActiveIcon className="w-4 h-4" />
            </div>
            <div className="text-left min-w-0">
              <div className="text-xs font-bold text-white truncate group-hover:text-slate-200 transition-colors">
                {activeItem?.label || 'Dashboard Modules'}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {isOpen ? 'Click to hide modules' : 'Click to slide modules'}
              </div>
            </div>
          </div>

          <div className={`w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-white bg-slate-800' : 'group-hover:text-white'
          }`}>
            <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" />
          </div>
        </button>

        {/* 🎬 Sliding Animated Modules Container */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? 'max-h-[500px] opacity-100 translate-y-0 scale-100 pointer-events-auto'
              : 'max-h-0 opacity-0 -translate-y-3 scale-95 pointer-events-none'
          }`}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-3 shadow-2xl backdrop-blur-sm">
            
            {/* Navigation Items */}
            <nav className="space-y-1.5">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onTabChange(item.id);
                    }}
                    className={`w-full h-10 flex items-center justify-between px-3 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                      isActive
                        ? `${activeColorClass} text-white font-semibold shadow-md`
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <div className="w-4 h-4 flex items-center justify-center shrink-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      </div>
                      <span className="truncate text-left">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`shrink-0 text-[9px] font-semibold px-2 py-0.5 rounded-full leading-none ml-2 border ${
                        isActive 
                          ? 'bg-white/20 text-white border-white/30' 
                          : 'bg-slate-950 text-slate-300 border-slate-800'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* System Info Box */}
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-center">
              <p className="text-[10px] font-medium text-slate-400">
                Verified Skill Passports & RBAC
              </p>
            </div>

          </div>
        </div>

      </div>
    </aside>
  );
};
