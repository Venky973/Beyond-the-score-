import express from 'express';
import {
  getTurfs,
  getTurfById,
  createTurf,
  updateTurf,
  getMyTurfs,
  getTurfSlots,
  manageBlockedSlots
} from '../controllers/turfController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.get('/', getTurfs);
router.get('/my-turfs', protect, authorize('operator', 'admin'), getMyTurfs);
router.get('/:id', getTurfById);
router.get('/:id/slots', getTurfSlots);

router.post('/', protect, authorize('operator', 'admin'), createTurf);
router.put('/:id', protect, authorize('operator', 'admin'), updateTurf);
router.post('/:id/block-slots', protect, authorize('operator', 'admin'), manageBlockedSlots);

export default router;
