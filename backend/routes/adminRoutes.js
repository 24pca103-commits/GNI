import express from 'express';
import {
  getAdminRegistrations,
  updateRegistrationStatus,
  deleteRegistration,
  notifyCourseStudents,
  getAdminStats,
  adminLogin,
  verifyAdminLoginOtp,
  resendAdminLoginOtp,
  adminForgotPassword,
  verifyAdminResetOtp,
  resetAdminPassword,
} from '../controllers/adminController.js';

const router = express.Router();

// Admin Authentication & 2FA OTP
router.post('/login', adminLogin);
router.post('/verify-otp', verifyAdminLoginOtp);
router.post('/resend-otp', resendAdminLoginOtp);

// Admin Password Reset Flow
router.post('/forgot-password', adminForgotPassword);
router.post('/verify-reset-otp', verifyAdminResetOtp);
router.post('/reset-password', resetAdminPassword);

// Student Registrations & Applications Management
router.get('/registrations', getAdminRegistrations);
router.patch('/registrations/:id/status', updateRegistrationStatus);
router.delete('/registrations/:id', deleteRegistration);
router.post('/courses/:courseId/notify-students', notifyCourseStudents);

// Dashboard Statistics
router.get('/stats', getAdminStats);

export default router;
