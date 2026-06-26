import { Router } from 'express';
import { loginWithPhone, logout, refreshToken } from '../controllers/authController';
import { getProfile, updateProfile, submitRegistration, getDashboard } from '../controllers/profileController';
import { getJobs, getJobById, applyForJob } from '../controllers/jobController';
import { logContact } from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// ── Authentication Routes (Public) ──────────────────────────────────────────
// Direct phone login/register — no OTP step
router.post('/auth/login', loginWithPhone);
router.post('/auth/logout', logout);
router.post('/auth/refresh-token', refreshToken);

// ── Profile & Dashboard (Protected — JWT required) ───────────────────────────
// All profile queries are filtered by userId from JWT → full data isolation
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.post('/register', protect, submitRegistration);
router.get('/dashboard', protect, getDashboard);

// ── Job Listings ─────────────────────────────────────────────────────────────
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs/:id/apply', protect, applyForJob);

// ── Contact / Recruiter Logging ───────────────────────────────────────────────
router.post('/contact-logs', protect, logContact);

export default router;
