import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

// Default Pre-seeded Profiles for Instant Access
export const DEMO_USERS = {
  STUDENT: {
    id: 'usr-student-001',
    email: 'student@apex.edu',
    role: 'STUDENT',
    name: 'Rahul Sharma',
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
    }
  },
  INDUSTRY_RECRUITER: {
    id: 'usr-industry-001',
    email: 'recruiter@apexdigital.io',
    role: 'INDUSTRY_RECRUITER',
    name: 'Vikram Singhania',
    email_verified: 1,
    profile: {
      id: 'prof-ind-001',
      company_name: 'Apex Digital Labs',
      representative_name: 'Vikram Singhania',
      name: 'Vikram Singhania',
      designation: 'VP of Engineering & University Relations',
      email: 'recruiter@apexdigital.io',
      website: 'https://apexdigital.io',
      industry_domain: 'Full Stack Development',
      company_size: '500–1,000 Employees',
      headquarters: 'Bangalore, India',
      bio: 'Enterprise digital engineering partner building mission-critical cloud backends and talent development pipelines.',
      verification_status: 'VERIFIED'
    }
  }
};


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('academia_auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return DEMO_USERS.STUDENT;
      }
    }
    return DEMO_USERS.STUDENT;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('academia_auth_token') || 'demo-jwt-token-active-session';
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync state to localStorage
  const persistSession = (targetUser, sessionToken) => {
    const activeToken = sessionToken || `token-${targetUser.role.toLowerCase()}-${Date.now()}`;
    setUser(targetUser);
    setToken(activeToken);
    localStorage.setItem('academia_auth_user', JSON.stringify(targetUser));
    localStorage.setItem('academia_auth_token', activeToken);
    localStorage.setItem('academia_role', targetUser.role === 'STUDENT' ? 'student' : 'industry');
  };

  // Instant login as Student
  const loginAsStudent = () => {
    persistSession(DEMO_USERS.STUDENT);
    return DEMO_USERS.STUDENT;
  };

  // Instant login as Recruiter
  const loginAsRecruiter = () => {
    persistSession(DEMO_USERS.INDUSTRY_RECRUITER);
    return DEMO_USERS.INDUSTRY_RECRUITER;
  };

  // Switch role seamlessly
  const switchRole = (newRole) => {
    if (newRole === 'INDUSTRY_RECRUITER' || newRole === 'industry' || newRole === 'recruiter') {
      return loginAsRecruiter();
    } else {
      return loginAsStudent();
    }
  };

  // Ensure role matches requested route
  const ensureRole = (requiredRole) => {
    if (requiredRole === 'INDUSTRY_RECRUITER' && user?.role !== 'INDUSTRY_RECRUITER') {
      return loginAsRecruiter();
    } else if (requiredRole === 'STUDENT' && user?.role !== 'STUDENT') {
      return loginAsStudent();
    }
    return user;
  };

  // Universal Login (handles direct credentials, registered accounts, and demo pass-through)
  const login = async (email, password = '') => {
    setIsLoading(true);
    try {
      const input = (email || '').trim().toLowerCase();

      // Quick demo shortcuts
      if (input === 'student@apex.edu' || input === 'student') {
        const u = loginAsStudent();
        setIsLoading(false);
        return u;
      }
      if (input === 'recruiter@apexdigital.io' || input === 'recruiter') {
        const u = loginAsRecruiter();
        setIsLoading(false);
        return u;
      }

      // Real backend authentication
      const res = await authService.login(email, password);
      if (res && res.token && res.user) {
        const loggedUser = {
          id: res.user.id,
          email: res.user.email,
          role: res.user.role,
          name: res.profile?.name || res.profile?.full_name || email.split('@')[0],
          email_verified: res.user.email_verified || 1,
          profile: res.profile || {
            name: email.split('@')[0],
            college: 'Apex Institute of Technology',
            department: 'Computer Science & Engineering',
            cgpa: 8.5
          }
        };
        persistSession(loggedUser, res.token);
        setIsLoading(false);
        return loggedUser;
      }

      throw new Error(res?.error || 'Login failed.');
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  // Register New User & Create Unique Profile
  const register = async ({ fullName, email, password, role = 'STUDENT', college = 'Apex Institute of Technology', department = 'Computer Science & Engineering', year = '3rd Year', cgpa = '8.5' }) => {
    setIsLoading(true);
    try {
      const res = await authService.completeRegistration({
        email,
        password,
        role,
        fullName,
        profileData: {
          name: fullName,
          college,
          department,
          year,
          cgpa: parseFloat(cgpa) || 8.5
        }
      });

      if (res && res.token && res.user) {
        const newUser = {
          id: res.user.id,
          email: res.user.email,
          role: res.user.role,
          name: fullName || res.profile?.name || email.split('@')[0],
          email_verified: 1,
          profile: res.profile || {
            name: fullName,
            college,
            department,
            year,
            cgpa: parseFloat(cgpa) || 8.5
          }
        };
        persistSession(newUser, res.token);
        setIsLoading(false);
        return newUser;
      }

      throw new Error(res?.error || 'Registration failed.');
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('academia_auth_token');
    localStorage.removeItem('academia_auth_user');
  };

  // Get default dashboard path for role
  const getRoleDashboardPath = (roleToCheck) => {
    const targetRole = roleToCheck || user?.role;
    switch (targetRole) {
      case 'INDUSTRY_RECRUITER':
        return '/industry/dashboard';
      case 'STUDENT':
      default:
        return '/student/dashboard';
    }
  };

  const value = {
    user: user || DEMO_USERS.STUDENT,
    role: user?.role || 'STUDENT',
    token: token || 'demo-jwt-token-active-session',
    isAuthenticated: true,
    isLoading,
    login,
    register,
    loginAsStudent,
    loginAsRecruiter,
    switchRole,
    ensureRole,
    logout,
    getRoleDashboardPath
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
