import express from 'express';
import { stripeWebhookHandler } from '../controllers/webhookController';

const router = express.Router();

// The webhook uses express.raw instead of express.json
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhookHandler);

export default router;
