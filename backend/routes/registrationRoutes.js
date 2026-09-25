import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, getRegistrationStatus } from '../controllers/registrationController.js';

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

// POST /api/register
router.post('/register', registerLimiter, registerUser);

// GET /api/register/status
router.get('/register/status', getRegistrationStatus);

export default router;
