import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  getTurfApprovals,
  reviewTurfApproval,
  getAllBookings,
  getReports,
  handleReport,
  getActivityLogs
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roleAuth.js';

const router = express.Router();

router.use(protect, authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.get('/turf-approvals', getTurfApprovals);
router.put('/turf-approvals/:id', reviewTurfApproval);
router.get('/bookings', getAllBookings);
router.get('/reports', getReports);
router.put('/reports/:id', handleReport);
router.get('/activity-logs', getActivityLogs);

export default router;
