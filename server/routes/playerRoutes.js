import express from 'express';
import {
  getPlayers,
  getPlayerById,
  comparePlayers,
  saveMyPlayerProfile
} from '../controllers/playerController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPlayers);
router.get('/compare', comparePlayers);
router.get('/:id', getPlayerById);
router.post('/profile', protect, saveMyPlayerProfile);

export default router;
