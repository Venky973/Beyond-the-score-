import express from 'express';
import { getAllSports, getSportBySlug, createSport } from '../controllers/sportController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.get('/', getAllSports);
router.get('/:slug', getSportBySlug);
router.post('/', protect, authorize('admin'), createSport);

export default router;
