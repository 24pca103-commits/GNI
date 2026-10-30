import express from 'express';
import {
  getPublicFeedbacks,
  getAllAdminFeedbacks,
  submitFeedback,
  updateFeedbackStatus,
  deleteFeedback,
} from '../controllers/feedbackController.js';

const router = express.Router();

// Public: Get all approved feedbacks for user page
router.get('/', getPublicFeedbacks);

// Public: User submits new review/feedback (saved as 'pending')
router.post('/', submitFeedback);

// Admin: Get all feedback entries including pending and rejected
router.get('/admin', getAllAdminFeedbacks);

// Admin: Approve (Upload to Site) or Reject feedback
router.put('/:id/status', updateFeedbackStatus);

// Admin: Delete feedback
router.delete('/:id', deleteFeedback);

export default router;
