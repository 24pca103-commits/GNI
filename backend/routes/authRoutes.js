import express from 'express';
import rateLimit from 'express-rate-limit';
import { registerUser, getStatus } from '../controllers/authController.js';
import { validateRegistration } from '../middleware/validateRegistration.js';

const router = express.Router();

// Rate limiter for registration endpoint (max 15 requests per 15 minutes per IP to prevent spam)
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many registration attempts from this IP. Please try again after 15 minutes.',
  },
});

router.post('/register', registerLimiter, validateRegistration, registerUser);
router.get('/status', getStatus);

export default router;
