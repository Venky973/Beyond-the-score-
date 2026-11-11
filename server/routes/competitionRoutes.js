import express from 'express';
import {
  getCompetitions,
  getCompetitionById,
  createCompetition
} from '../controllers/competitionController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.get('/', getCompetitions);
router.get('/:id', getCompetitionById);
router.post('/', protect, authorize('organizer', 'admin'), createCompetition);

export default router;
