import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getAllReviews, moderateReview, deleteReview, getSimilarProducts, searchProducts, getStockAlerts, getAllStock, updateStock } from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Must be before /:id to avoid route collision
router.route('/search').get(searchProducts);
router.route('/stock-alerts').get(protect, admin, getStockAlerts);
router.route('/stock').get(protect, admin, getAllStock);
router.route('/reviews/all').get(protect, admin, getAllReviews);

router.route('/')
  .get(getProducts)
  .post(protect, admin, createProduct);

router.route('/:id/reviews').post(protect, createProductReview);

router.route('/:productId/reviews/:reviewId')
  .put(protect, admin, moderateReview)
  .delete(protect, admin, deleteReview);

router.route('/:id/similar').get(getSimilarProducts);
router.route('/:id/stock').put(protect, admin, updateStock);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

export default router;

