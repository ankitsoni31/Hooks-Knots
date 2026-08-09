import { Router } from 'express';
import { verifyPayment, handleWebhook } from '../controllers/paymentController.js';

const router = Router();

// Public: frontend calls this after Razorpay Checkout completes
router.post('/razorpay/verify', verifyPayment);

// Webhook: receives raw body (express.raw() applied in server.ts BEFORE express.json())
router.post('/razorpay/webhook', handleWebhook);

export default router;
