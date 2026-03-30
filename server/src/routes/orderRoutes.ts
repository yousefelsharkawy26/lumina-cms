import express from 'express';
import { createStripeCheckoutSession, getUserOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createStripeCheckoutSession);
router.get('/myorders', protect, getUserOrders);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
