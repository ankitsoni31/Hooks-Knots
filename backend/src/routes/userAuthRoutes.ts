import { Router } from 'express';
import { login, logout, me, register, verifyOtp, resendOtp } from '../controllers/userAuthController.js';
import { requireUserAuth } from '../middleware/userAuth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.get('/me', requireUserAuth, me);
router.post('/logout', requireUserAuth, logout);

export default router;
