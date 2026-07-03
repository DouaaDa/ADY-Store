import express from 'express';
import { register, login, getMe, toggleWishlist, getUsers, deleteUser, getUserById, updateUser, updateProfile } from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/wishlist/:productId', protect, toggleWishlist);

// Admin Routes
router.route('/users').get(protect, admin, getUsers);
router.route('/users/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

// Status update shortcut (used by UserManager frontend)
router.put('/users/:id/status', protect, admin, updateUser);

export default router;
