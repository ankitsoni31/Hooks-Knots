import { Router } from 'express';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', login);
router.get('/me', requireAuth, me);
router.post('/logout', requireAuth, logout);

export default router;
