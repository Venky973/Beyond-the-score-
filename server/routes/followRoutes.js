import express from 'express';
import { toggleFollow, getMyFollows } from '../controllers/followController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.post('/toggle', toggleFollow);
router.get('/', getMyFollows);

export default router;
