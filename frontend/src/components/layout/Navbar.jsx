import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { 
  GraduationCap, 
  Building2, 
  Bell, 
  LogOut,
  ChevronDown, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  ShieldCheck,
  Home,
  Zap
} from 'lucide-react';

export const Navbar = ({ notifications = [], onNotificationClick, onMarkAllRead }) => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const isStudent = role === 'STUDENT';
  const roleLabel = isStudent ? 'Student' : 'Recruiter';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.profile?.name || user?.profile?.representative_name || user?.name || (isStudent ? 'Rahul Sharma' : 'Sarah Jenkins');

  const unreadNotifications = notifications.filter(n => !n.is_read && !n.read);
  const unreadCount = unreadNotifications.length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900 border-b border-slate-800 shadow-lg">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        <div className="flex items-center justify-between h-18 gap-4 py-2">
          
          {/* Brand Logo & Intro Link */}
          <div className="flex items-center gap-3.5">
            <Link 
              to="/"
              className="flex items-center gap-3 text-left group"
              title="Return to Intro Page"
            >
              <div className={`w-10 h-10 rounded-xl ${isStudent ? 'bg-indigo-600' : 'bg-cyan-600'} flex items-center justify-center shadow-md transition-transform group-hover:scale-105`}>
                {isStudent ? <GraduationCap className="w-5 h-5 text-white" /> : <Building2 className="w-5 h-5 text-white" />}
              </div>
              <div className="flex items-center gap-2.5">
                <span className="font-display font-bold text-xl tracking-tight text-white group-hover:text-cyan-300 transition-colors">Academia</span>
                <span className={`text-xs uppercase font-semibold tracking-wider px-2 py-0.5 rounded-md ${isStudent ? 'bg-indigo-950/80 text-indigo-300 border border-indigo-500/30' : 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/30'}`}>
                  {roleLabel} Portal
                </span>
              </div>
            </Link>

            {/* Quick Link to Intro */}
            <Link
              to="/"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              title="Intro Home"
            >
              <Home className="w-5 h-5" />
            </Link>
          </div>

          {/* Right Tools: Notifications, Profile */}
          <div className="flex items-center gap-2 sm:gap-4">

            {/* Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popover */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-400" />
                      <h4 className="font-semibold text-xs text-white">Platform Notifications</h4>
                      {unreadCount > 0 ? (
                        <span className="text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          {unreadCount} unread
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          All clear
                        </span>
                      )}
                    </div>

                    {unreadCount > 0 && onMarkAllRead && (
                      <button
                        onClick={() => {
                          onMarkAllRead();
                        }}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                      >
                        Clear all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60 mt-2 space-y-1">
                    {unreadNotifications.length === 0 ? (
                      <div className="text-center py-6 space-y-1.5">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                        <p className="text-xs font-semibold text-slate-300">All notifications read</p>
                        <p className="text-[10px] text-slate-500">Your notification bar is completely clear</p>
                      </div>
                    ) : (
                      unreadNotifications.slice(0, 10).map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => {
                            if (onNotificationClick) onNotificationClick(n);
                            setShowNotifications(false);
                          }}
                          className="p-2.5 rounded-xl transition-colors cursor-pointer bg-indigo-950/40 border border-indigo-500/30 hover:bg-indigo-950/60"
                        >
                          <div className="flex items-start gap-2.5">
                            {n.type === 'SUCCESS' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                            ) : n.type === 'WARNING' ? (
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            ) : (
                              <Info className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <p className="text-xs font-semibold text-white">{n.title}</p>
                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                              </div>
                              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-slate-800 transition-colors text-left cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-xl ${isStudent ? 'bg-indigo-600' : 'bg-cyan-600'} flex items-center justify-center font-bold text-sm text-white shadow-sm`}>
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-white truncate max-w-[140px]">
                    {displayName}
                  </div>
                  <div className="text-xs text-slate-400 font-normal">
                    {roleLabel} Active
                  </div>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 p-2 space-y-1">
                  <div className="px-3 py-2.5 border-b border-slate-800">
                    <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                  </div>

                  <div className="py-1 space-y-1">
                    <Link
                      to="/"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 transition-colors text-left"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>Intro Page</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
