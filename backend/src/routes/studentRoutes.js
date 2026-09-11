import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { studentService } from '../services/studentService.js';

const router = express.Router();

// Strict RBAC: All student endpoints require authenticated STUDENT role
router.use(authenticateToken, authorizeRoles('STUDENT'));

/**
 * GET /api/student/dashboard
 * Fetch full isolated student dashboard data
 */
router.get('/dashboard', (req, res) => {
  try {
    const data = studentService.getStudentDashboard(req.user.id);
    res.status(200).json({ status: 'success', ...data });
  } catch (err) {
    console.error('Error fetching student dashboard:', err);
    res.status(500).json({ error: err.message || 'Failed to load dashboard data.' });
  }
});

/**
 * POST /api/student/verify-identity
 * Aadhaar/ID identity verification with duplicate prevention
 */
router.post('/verify-identity', (req, res) => {
  try {
    const { identityType, identityNumber, fullName, institution } = req.body;
    const result = studentService.verifyIdentity({
      userId: req.user.id,
      identityType,
      identityNumber,
      fullName,
      institution
    });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error verifying identity:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/student/skills/declare
 * Add a self-declared skill
 */
router.post('/skills/declare', (req, res) => {
  try {
    const { skillName, proficiency } = req.body;
    const result = studentService.declareSkill({
      userId: req.user.id,
      skillName,
      proficiency
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/student/assessment/start
 * Initiate 3-stage dynamic randomized assessment for a skill
 */
router.post('/assessment/start', (req, res) => {
  try {
    const { skillName } = req.body;
    const result = studentService.startAssessment({
      userId: req.user.id,
      skillName
    });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error starting assessment:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/student/assessment/submit-stage
 * Submit answers for Stage 1, 2, or 3
 */
router.post('/assessment/submit-stage', (req, res) => {
  try {
    const { attemptId, stage, answers } = req.body;
    const result = studentService.submitStage({
      userId: req.user.id,
      attemptId,
      stage: parseInt(stage, 10),
      answers
    });
    res.status(200).json(result);
  } catch (err) {
    console.error('Error submitting assessment stage:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/student/jobs
 * Fetch matched jobs with qualification state analysis
 */
router.get('/jobs', (req, res) => {
  try {
    const jobs = studentService.getMatchedJobs(req.user.id);
    res.status(200).json({ jobs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/student/jobs/apply
 * Apply to an opportunity
 */
router.post('/jobs/apply', (req, res) => {
  try {
    const { jobId, customNote } = req.body;
    const result = studentService.applyToJob({
      userId: req.user.id,
      jobId,
      customNote
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /api/student/notifications/:id/read
 * Mark notification(s) as read
 */
router.patch('/notifications/:id/read', (req, res) => {
  try {
    const result = studentService.markNotificationRead(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
