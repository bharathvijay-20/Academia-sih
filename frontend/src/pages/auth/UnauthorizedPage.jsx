import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { ShieldAlert, ArrowLeft, Home, LogOut, GraduationCap } from 'lucide-react';

export const UnauthorizedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, role, logout, getRoleDashboardPath } = useAuth();

  const attemptedPath = location.state?.attemptedPath || 'Protected Resource';
  const allowedRoles = location.state?.allowedRoles || [];
  const redirectPath = location.state?.redirectPath || getRoleDashboardPath(role);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full glass-dropdown p-8 rounded-3xl border border-rose-500/30 text-center space-y-6 shadow-2xl relative z-10 bg-slate-900/90 backdrop-blur-2xl">
        
        {/* Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30 shadow-lg">
          <ShieldAlert className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            HTTP 403 • Access Denied
          </span>
          <h2 className="text-2xl font-bold font-display text-white mt-2">
            Role Authorization Required
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            You do not have permission to view <span className="text-rose-300 font-mono font-semibold">{attemptedPath}</span>.
          </p>
        </div>

        {/* Role Explanation Card */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/5 text-xs text-left space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-400">Your Current Account Role:</span>
            <span className="font-bold text-indigo-400">{role || 'Unassigned'}</span>
          </div>
          {allowedRoles.length > 0 && (
            <div className="flex justify-between pt-1 border-t border-white/5">
              <span className="text-slate-400">Required Role Permission:</span>
              <span className="font-bold text-rose-300">{allowedRoles.join(' / ')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => navigate(redirectPath)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30 hover:scale-[1.01] transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to My Authorized Dashboard</span>
          </button>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign In as Different Role</span>
          </button>
        </div>

      </div>

    </div>
  );
};
