import express from 'express';
import { sendMessage, getMessages, markMessageRead, deleteMessage, replyToMessage, archiveMessage } from '../controllers/messageController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(sendMessage)
  .get(protect, admin, getMessages);

router.put('/:id/read', protect, admin, markMessageRead);
router.put('/:id/reply', protect, admin, replyToMessage);
router.put('/:id/archive', protect, admin, archiveMessage);
router.delete('/:id', protect, admin, deleteMessage);

export default router;
