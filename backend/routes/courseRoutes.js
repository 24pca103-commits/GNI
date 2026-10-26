import express from 'express';
import {
  getActiveCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
  getPricingConfig,
  calculateCourseFee,
} from '../controllers/courseController.js';

const router = express.Router();

// Public: Get all active courses
router.get('/', getActiveCourses);

// Public: Get official pricing and duration configuration
router.get('/pricing-config', getPricingConfig);

// Public: Calculate trusted course fee based on course & duration
router.post('/calculate-fee', calculateCourseFee);

// Admin: Get all courses (active + inactive)
router.get('/all', getAllCourses);

// Admin: Create course
router.post('/', createCourse);

// Admin: Update course and discount offers
router.put('/:id', updateCourse);

// Admin: Toggle active status
router.patch('/:id/status', toggleCourseStatus);

// Admin: Delete course
router.delete('/:id', deleteCourse);

export default router;
