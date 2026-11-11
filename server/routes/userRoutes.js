import express from 'express';
import { getUserDashboard, getUserById } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getUserDashboard);
router.get('/:id', getUserById);

export default router;
