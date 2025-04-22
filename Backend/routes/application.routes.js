import express from 'express';
import { applyJob, getApplications, getResume, updateStatus } from '../controllers/application.controller.js';
import { isAuthenticated } from '../middleware/auth.middleware.js';

const router = express.Router();

// Apply for a job
router.post('/apply', isAuthenticated, applyJob);

// Get all applications for a user
router.get('/my-applications', isAuthenticated, getApplications);

// Update application status
router.patch('/:id/status', isAuthenticated, updateStatus);

// Get resume
router.get('/:id/resume', isAuthenticated, getResume);

export default router; 