import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import db from '../config/db.js';

const router = express.Router();

// Strict RBAC: All routes here require EDUCATIONAL_INSTITUTION role
router.use(authenticateToken, authorizeRoles('EDUCATIONAL_INSTITUTION'));

// GET /api/education/dashboard-summary
router.get('/dashboard-summary', (req, res) => {
  const profile = db.prepare('SELECT * FROM educational_profiles WHERE user_id = ?').get(req.user.id);
  res.json({
    status: 'success',
    role: 'EDUCATIONAL_INSTITUTION',
    message: 'Authorized Educational Institution Dashboard Data',
    institution: profile || {}
  });
});

export default router;
