import { Router } from 'express';
import { listAddresses, getAddress } from '../controllers/addressController.js';

const router = Router();

router.get('/', listAddresses);
router.get('/:id', getAddress);

export default router;
