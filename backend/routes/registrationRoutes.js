import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  registerUser,
  getRegistrationStatus,
  resendConfirmationEmail,
  checkRegistrationEligibility,
  checkEmailEligibility,
} from '../controllers/registrationController.js';

const router = express.Router();

// Rate limiter for registration endpoint: max 20 requests per 15 minutes per IP
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: 'Too many registration attempts from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for resending confirmation email: max 5 requests per 10 minutes per IP
const resendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: 'Too many resend attempts. Please wait 10 minutes before requesting another confirmation email.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// GET & POST /api/check-email and /api/check-registration (Real-time email & phone eligibility check)
router.get('/check-email', checkEmailEligibility);
router.post('/check-email', checkEmailEligibility);
router.get('/check-registration', checkRegistrationEligibility);
router.post('/check-registration', checkRegistrationEligibility);

// POST /api/register
router.post('/register', registerLimiter, registerUser);

// POST /api/resend-confirmation
router.post('/resend-confirmation', resendLimiter, resendConfirmationEmail);

// GET /api/register/status
router.get('/register/status', getRegistrationStatus);

export default router;
