import { Router } from 'express';
import { createOrder, getOrder } from '../controllers/orderController.js';

const router = Router();

// Public order creation (guest checkout)
router.post('/', createOrder);
router.get('/:id', getOrder);

export default router;
