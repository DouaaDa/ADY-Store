import express from 'express';
import { getNotifications, markNotificationRead, getActivityLogs } from '../controllers/systemController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/notifications', protect, admin, getNotifications);
router.put('/notifications/:id/read', protect, admin, markNotificationRead);
router.get('/logs', protect, admin, getActivityLogs);

export default router;
