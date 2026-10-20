import express from 'express';
import {
  getAdminRegistrations,
  getAdminStats,
  adminLogin,
} from '../controllers/adminController.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/registrations', getAdminRegistrations);
router.get('/stats', getAdminStats);

export default router;
