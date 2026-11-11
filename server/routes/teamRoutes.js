import express from 'express';
import { getTeams, getTeamById, createTeam } from '../controllers/teamController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.get('/', getTeams);
router.get('/:id', getTeamById);
router.post('/', protect, authorize('organizer', 'admin'), createTeam);

export default router;
