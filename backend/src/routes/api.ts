import { Router } from 'express';
import { requestOTP, verifyOTP } from '../controllers/authController';
import { getProfile, updateProfile, submitRegistration, getDashboard } from '../controllers/profileController';
import { getJobs, getJobById, applyForJob } from '../controllers/jobController';
import { logContact } from '../controllers/contactController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Health Check
router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

// Authentication Routes
router.post('/auth/request-otp', requestOTP);
router.post('/auth/verify-otp', verifyOTP);

// Profile & Dashboard (Protected Routes)
router.get('/profile', protect, getProfile);
router.patch('/profile', protect, updateProfile);
router.post('/register', protect, submitRegistration);
router.get('/dashboard', protect, getDashboard);

// Job Openings Routes
router.get('/jobs', getJobs);
router.get('/jobs/:id', getJobById);
router.post('/jobs/:id/apply', protect, applyForJob);

// Analytics & Recruiter Logging Routes
router.post('/contact-logs', protect, logContact);

export default router;
