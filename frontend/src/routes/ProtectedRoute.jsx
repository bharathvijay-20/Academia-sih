import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { role, ensureRole } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If accessing student routes and not in student role, sync role
    if (allowedRoles.includes('STUDENT') && role !== 'STUDENT') {
      ensureRole('STUDENT');
    }
    // If accessing industry routes and not in recruiter role, sync role
    else if (allowedRoles.includes('INDUSTRY_RECRUITER') && role !== 'INDUSTRY_RECRUITER') {
      ensureRole('INDUSTRY_RECRUITER');
    }
  }, [location.pathname, allowedRoles, role, ensureRole]);

  return children;
};

