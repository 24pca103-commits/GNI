import express from 'express';
import {
  getAllPillars,
  getPillarById,
  createPillar,
  updatePillar,
  deletePillar,
} from '../controllers/pillarController.js';

const router = express.Router();

// Public: Get all active heritage pillars
router.get('/', getAllPillars);

// Public: Get pillar by ID
router.get('/:id', getPillarById);

// Admin: Create pillar
router.post('/', createPillar);

// Admin: Update pillar
router.put('/:id', updatePillar);

// Admin: Delete pillar
router.delete('/:id', deletePillar);

export default router;
