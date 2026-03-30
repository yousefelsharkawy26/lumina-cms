import express from 'express';
import { getProductReviews, createReview } from '../controllers/reviewController';
import { protect } from '../middleware/authMiddleware';

// Important: Note that this route should be nested if we want to extract productId from parent route,
// or we can pass productId directly as a route parameter.
// Assuming the mount in index.ts is: app.use('/api/products/:productId/reviews', reviewRoutes)
const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getProductReviews)
  .post(protect, createReview);

export default router;
