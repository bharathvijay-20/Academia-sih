import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Landing / Intro Page
import { LandingPage } from '../components/landing/LandingPage';

// 1-Click Role Switcher / Login Page
import { LoginPage } from '../pages/auth/LoginPage';

// Dashboards
import { StudentDashboard } from '../components/student/StudentDashboard';
import { IndustryDashboard } from '../components/industry/IndustryDashboard';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Landing / Intro Entry Route */}
      <Route path="/" element={<LandingPage />} />

      {/* 2. 1-Click Role Switcher / Login Route */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<LoginPage />} />
      <Route path="/forgot-password" element={<LoginPage />} />

      {/* 3. Student Dashboard Routes */}
      <Route
        path="/student/*"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/student" element={<Navigate to="/student/dashboard" replace />} />

      {/* 4. Industry Recruiter Dashboard Routes */}
      <Route
        path="/industry/*"
        element={
          <ProtectedRoute allowedRoles={['INDUSTRY_RECRUITER']}>
            <IndustryDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/industry" element={<Navigate to="/industry/dashboard" replace />} />

      {/* Fallback Redirect directly to Intro */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

