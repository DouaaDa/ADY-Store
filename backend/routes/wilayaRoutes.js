import express from 'express';
import { getWilayas, createWilaya, updateWilaya, deleteWilaya } from '../controllers/wilayaController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getWilayas)
  .post(protect, admin, createWilaya);

router.route('/:id')
  .put(protect, admin, updateWilaya)
  .delete(protect, admin, deleteWilaya);

export default router;
