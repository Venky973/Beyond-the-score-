import express from 'express';
import {
  createBooking,
  getUserBookings,
  getOperatorBookings,
  getBookingById,
  updateBookingStatus
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getUserBookings);
router.get('/operator', protect, authorize('operator', 'admin'), getOperatorBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);

export default router;
