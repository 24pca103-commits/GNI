import express from 'express';
import {
  getActiveCourses,
  getAllCourses,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
} from '../controllers/courseController.js';

const router = express.Router();

// Public: Get all active courses
router.get('/', getActiveCourses);

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
