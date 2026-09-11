import express from 'express';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizeRoles } from '../middleware/authorizeRoles.js';
import { industryService } from '../services/industryService.js';

const router = express.Router();

// Strict RBAC: All industry endpoints require authenticated INDUSTRY_RECRUITER role
router.use(authenticateToken, authorizeRoles('INDUSTRY_RECRUITER'));

/**
 * GET /api/industry/dashboard
 * Fetch full isolated recruiter dashboard data
 */
router.get('/dashboard', (req, res) => {
  try {
    const data = industryService.getRecruiterDashboard(req.user.id);
    res.status(200).json({ status: 'success', ...data });
  } catch (err) {
    console.error('Error fetching recruiter dashboard:', err);
    res.status(500).json({ error: err.message || 'Failed to load recruiter dashboard data.' });
  }
});

/**
 * POST /api/industry/verify-documents
 * Submit recruiter professional verification credentials
 */
router.post('/verify-documents', (req, res) => {
  try {
    const { degreeName, degreeUrl, yearsOfExperience, experienceUrl, certificationName, certificationUrl, domain } = req.body;
    const result = industryService.submitVerificationDocuments({
      userId: req.user.id,
      degreeName,
      degreeUrl,
      yearsOfExperience,
      experienceUrl,
      certificationName,
      certificationUrl,
      domain
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/industry/qualification-test
 * Fetch recruiter screening assessment questions
 */
router.get('/qualification-test', (req, res) => {
  try {
    const domain = req.query.domain || 'Full Stack Development';
    const test = industryService.getQualificationTest(req.user.id, domain);
    res.status(200).json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/industry/qualification-test/submit
 * Submit recruiter qualification assessment
 */
router.post('/qualification-test/submit', (req, res) => {
  try {
    const { domain, answers } = req.body;
    const result = industryService.submitQualificationTest({
      userId: req.user.id,
      domain,
      answers
    });
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/industry/candidates
 * Discover and rank candidates by verified skill scores
 */
router.get('/candidates', (req, res) => {
  try {
    const { searchSkill, minScore, sortBy } = req.query;
    const candidates = industryService.getCandidates({
      userId: req.user.id,
      searchSkill: searchSkill || '',
      minScore: parseInt(minScore || '0', 10),
      sortBy: sortBy || 'score_desc'
    });
    res.status(200).json({ candidates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/industry/jobs
 * Post a new job / internship opportunity
 */
router.post('/jobs', (req, res) => {
  try {
    const { title, company, type, location, stipend, duration, requiredSkills, preferredSkills, description, minScore } = req.body;
    const result = industryService.postJob({
      userId: req.user.id,
      title,
      company,
      type,
      location,
      stipend,
      duration,
      requiredSkills,
      preferredSkills,
      description,
      minScore
    });
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /api/industry/notifications/:id/read
 * Mark recruiter notification(s) as read
 */
router.patch('/notifications/:id/read', (req, res) => {
  try {
    const result = industryService.markNotificationRead(req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
