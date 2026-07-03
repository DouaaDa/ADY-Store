import express from 'express';
import {
  getPromotions,
  getAdminPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion
} from '../controllers/promotionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getPromotions)
  .post(protect, admin, createPromotion);

router.route('/admin')
  .get(protect, admin, getAdminPromotions);

router.route('/:id')
  .put(protect, admin, updatePromotion)
  .delete(protect, admin, deletePromotion);

export default router;
