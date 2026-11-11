import express from 'express';
import {
  getMatches,
  getLiveMatches,
  getMatchById,
  createMatch,
  updateMatch,
  updateScore,
  addMatchEvent,
  declareResult,
  deleteMatch
} from '../controllers/matchController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/live', getLiveMatches);
router.get('/:id', getMatchById);

// Protected routes for organizers and administrators
router.post('/', protect, authorize('organizer', 'admin'), createMatch);
router.put('/:id', protect, authorize('organizer', 'admin'), updateMatch);
router.put('/:id/score', protect, authorize('organizer', 'admin'), updateScore);
router.post('/:id/events', protect, authorize('organizer', 'admin'), addMatchEvent);
router.put('/:id/result', protect, authorize('organizer', 'admin'), declareResult);
router.delete('/:id', protect, authorize('organizer', 'admin'), deleteMatch);

export default router;
