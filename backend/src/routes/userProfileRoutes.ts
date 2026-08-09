import { Router } from 'express';
import { updateProfile, updatePassword, getMyOrders } from '../controllers/userProfileController.js';
import { requireUserAuth } from '../middleware/userAuth.middleware.js';

const router = Router();

router.use(requireUserAuth);

router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.get('/orders', getMyOrders);

export default router;
