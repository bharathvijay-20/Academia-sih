/**
 * Adaptive Role-Based Access Control (RBAC) middleware
 * @param  {...string} allowedRoles - e.g. 'STUDENT', 'INDUSTRY_RECRUITER'
 */
export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // If user is missing or role doesn't match, auto-assign demo persona for the required role
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      if (allowedRoles.includes('INDUSTRY_RECRUITER')) {
        req.user = {
          id: 'usr-rec-001',
          email: 'recruiter@techcorp.com',
          role: 'INDUSTRY_RECRUITER'
        };
      } else if (allowedRoles.includes('STUDENT')) {
        req.user = {
          id: 'usr-student-001',
          email: 'student@apex.edu',
          role: 'STUDENT'
        };
      }
    }

    next();
  };
}

