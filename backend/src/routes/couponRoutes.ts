import { Router } from 'express';
import { validateCoupon } from '../controllers/couponController.js';

const router = Router();

// Public route for validation
router.post('/validate', validateCoupon);

export default router;
