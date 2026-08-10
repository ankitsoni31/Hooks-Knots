import { Router } from 'express';
import { validateCoupon, createCoupon, getCoupons, getCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public route for validation
router.post('/validate', validateCoupon);

// Admin routes for CRUD
router.get('/', requireAuth, getCoupons);
router.post('/', requireAuth, createCoupon);
router.get('/:id', requireAuth, getCoupon);
router.put('/:id', requireAuth, updateCoupon);
router.delete('/:id', requireAuth, deleteCoupon);

export default router;
