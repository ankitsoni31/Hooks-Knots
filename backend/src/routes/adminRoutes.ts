import { Router } from 'express';
import { listCategories, getCategory, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { listProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { dashboard, updateProfile, changePassword } from '../controllers/adminController.js';
import { listCustomers, getCustomer, getCustomerAddresses } from '../controllers/customerController.js';
import { listOrders, getOrder, updateOrderStatus } from '../controllers/orderController.js';
import { listPayments, getPayment } from '../controllers/paymentController.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/dashboard', dashboard);
router.put('/profile', updateProfile);
router.put('/password', changePassword);

// Categories
router.get('/categories', listCategories);
router.get('/categories/:id', getCategory);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

// Products
router.get('/products', listProducts);
router.get('/products/:id', getProduct);
router.post('/products', createProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

// Product Images
import { getProductImages, uploadProductImages, setPrimaryImage, reorderImages, deleteProductImage } from '../controllers/productImageController.js';
import { uploadProductImage } from '../middleware/upload.middleware.js';

router.get('/products/:productId/images', getProductImages);
router.post('/products/:productId/images', uploadProductImage.array('images'), uploadProductImages);
router.post('/products/:productId/images/:imageId/primary', setPrimaryImage);
router.put('/products/:productId/images/reorder', reorderImages);
router.delete('/products/:productId/images/:imageId', deleteProductImage);

// Error handler for multer errors
router.use((err: any, req: any, res: any, next: any) => {
    if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({ success: false, message: 'Invalid image type' });
    }
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File is too large (max 5MB)' });
    }
    next(err);
});

// Customers
router.get('/customers', listCustomers);
router.get('/customers/:id', getCustomer);
router.get('/customers/:customerId/addresses', getCustomerAddresses);

// Orders
router.get('/orders', listOrders);
router.get('/orders/:id', getOrder);
router.put('/orders/:id/status', updateOrderStatus);

// Payments
router.get('/payments', listPayments);
router.get('/payments/:id', getPayment);

export default router;
