import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Landmark, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AuthModal = () => {
  const { activeModal, setActiveModal, switchRole, addNotification } = useApp();
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' | 'industry' | 'faculty' | 'institution'

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeOrCompany: '',
    departmentOrDomain: '',
    graduationYearOrSize: '2027'
  });

  if (activeModal !== 'auth') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    switchRole(selectedRole);
    setActiveModal(null);

    addNotification({
      roleTarget: selectedRole,
      title: `Welcome to Academia!`,
      message: `Signed in as ${selectedRole.toUpperCase()} stakeholder. Explore your live dashboard.`,
      type: 'success'
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const roleConfigs = [
    { id: 'student', label: 'Student', icon: GraduationCap, color: 'text-indigo-400 border-indigo-500' },
    { id: 'industry', label: 'Industry / Recruiter', icon: Building2, color: 'text-cyan-400 border-cyan-500' },
    { id: 'faculty', label: 'Academician / Faculty', icon: BookOpen, color: 'text-purple-400 border-purple-500' },
    { id: 'institution', label: 'Institution Admin', icon: Landmark, color: 'text-amber-400 border-amber-500' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-dropdown rounded-3xl border border-white/15 overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
              </div>
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                {authMode === 'login' ? 'Sign In to Academia' : 'Create Stakeholder Account'}
              </h3>
              <p className="text-[11px] text-slate-400">Role-based secure access for Academia-Industry Ecosystem</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Grid */}
        <div className="p-6 pb-2">
          <label className="block text-xs font-semibold text-slate-300 mb-2">Select Your Platform Role:</label>
          <div className="grid grid-cols-2 gap-2">
            {roleConfigs.map(r => {
              const Icon = r.icon;
              const isSelected = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id)}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 text-white ' + r.color + ' shadow-md'
                      : 'bg-slate-950/60 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Auth Mode Toggle */}
        <div className="px-6 pt-2">
          <div className="flex p-1 bg-slate-950 rounded-xl border border-white/5">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'login' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setAuthMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                authMode === 'register' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              New Registration
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {authMode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name / Entity Contact</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder={selectedRole === 'student' ? 'e.g. Rahul Sharma' : 'e.g. Vikram Singhania'}
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-white border border-white/10"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder={selectedRole === 'student' ? 'rahul@apex.edu' : 'recruiter@company.com'}
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-white border border-white/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                defaultValue="password123"
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-white border border-white/10"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {selectedRole === 'student' || selectedRole === 'faculty' ? 'College / University' : 'Company Name'}
                </label>
                <input
                  type="text"
                  placeholder="Apex Institute / Apex Tech"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white border border-white/10"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {selectedRole === 'student' ? 'Department' : 'Domain / Sector'}
                </label>
                <input
                  type="text"
                  placeholder="CSE / Cloud Tech"
                  className="w-full glass-input rounded-xl px-3 py-2 text-xs text-white border border-white/10"
                />
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.01] transition-all"
            >
              <span>{authMode === 'login' ? `Sign In as ${selectedRole.toUpperCase()}` : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[10px] text-slate-400 text-center">
            Demo credentials are preloaded. Clicking sign in will instantly launch the live dashboard for the selected stakeholder.
          </p>

        </form>

      </div>
    </div>
  );
};
