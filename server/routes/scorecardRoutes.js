import express from 'express';
import {
  createScorecard,
  getMyScorecards,
  getScorecardByShareCode,
  getPublicScorecards,
  getScorecardById,
  updateScorecard,
  deleteScorecard
} from '../controllers/scorecardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/public', getPublicScorecards);
router.get('/share/:code', getScorecardByShareCode);
router.get('/my-scorecards', protect, getMyScorecards);
router.get('/:id', getScorecardById);

router.post('/', protect, createScorecard);
router.put('/:id', protect, updateScorecard);
router.delete('/:id', protect, deleteScorecard);

export default router;
