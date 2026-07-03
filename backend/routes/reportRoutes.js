import express from 'express';
import {
  getOrdersExcel,
  getCustomersExcel,
  getProductsExcel
} from '../controllers/reportController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/orders').get(protect, admin, getOrdersExcel);
router.route('/customers').get(protect, admin, getCustomersExcel);
router.route('/products').get(protect, admin, getProductsExcel);

export default router;
