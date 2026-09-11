import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import db from '../config/db.js';

const router = express.Router();

// Strict RBAC: All routes here require ACADEMICIAN role
router.use(authenticateToken, authorizeRoles('ACADEMICIAN'));

// GET /api/academician/dashboard-summary
router.get('/dashboard-summary', (req, res) => {
  const profile = db.prepare('SELECT * FROM academician_profiles WHERE user_id = ?').get(req.user.id);
  res.json({
    status: 'success',
    role: 'ACADEMICIAN',
    message: 'Authorized Academician Dashboard Data',
    faculty: profile || {}
  });
});

export default router;
