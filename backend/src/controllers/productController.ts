import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as productService from '../services/productService.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

export async function listProducts(req: Request, res: Response) {
    try {
        const isAdmin = req.originalUrl.includes('/admin/');
        
        const options = {
            page: req.query.page ? parseInt(req.query.page as string) : 1,
            limit: req.query.limit ? parseInt(req.query.limit as string) : 20,
            search: req.query.search as string,
            category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
            status: req.query.status as string,
            featured: req.query.featured ? req.query.featured === 'true' : undefined,
            sort: req.query.sort as string
        };

        if (!isAdmin) {
            options.status = 'active'; // Public only sees active products
        }

        const result = await productService.getProducts(options);
        return successResponse(res, result);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch products', 500);
    }
}

export async function getProduct(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.getProductById(id);
        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }
        
        const isAdmin = req.originalUrl.includes('/admin/');
        if (!isAdmin && product.status !== 'active') {
            return errorResponse(res, 'Product not found', 404);
        }

        return successResponse(res, product);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch product', 500);
    }
}

export async function createProduct(req: Request, res: Response) {
    try {
        const validated = createProductSchema.parse(req.body);
        const product = await productService.createProduct(validated);
        return successResponse(res, product, 'Product created successfully', 201);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return errorResponse(res, error.errors[0].message, 400);
        }
        if (error.message === 'DUPLICATE_SKU') {
            return errorResponse(res, 'SKU already exists', 409);
        }
        if (error.message === 'CATEGORY_NOT_FOUND') {
            return errorResponse(res, 'Invalid category', 400);
        }
        return errorResponse(res, 'Failed to create product', 500);
    }
}

export async function updateProduct(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const validated = updateProductSchema.parse(req.body);
        const product = await productService.updateProduct(id, validated);
        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }
        return successResponse(res, product, 'Product updated successfully');
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return errorResponse(res, error.errors[0].message, 400);
        }
        if (error.message === 'DUPLICATE_SKU') {
            return errorResponse(res, 'SKU already exists', 409);
        }
        if (error.message === 'CATEGORY_NOT_FOUND') {
            return errorResponse(res, 'Invalid category', 400);
        }
        return errorResponse(res, 'Failed to update product', 500);
    }
}

export async function deleteProduct(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const deleted = await productService.deleteProduct(id);
        if (!deleted) {
            return errorResponse(res, 'Product not found', 404);
        }
        return successResponse(res, null, 'Product deleted successfully');
    } catch (error: any) {
        if (error.message === 'PRODUCT_REFERENCED') {
            return errorResponse(res, 'Cannot delete product because it is referenced in orders. Please archive it instead.', 409);
        }
        return errorResponse(res, 'Failed to delete product', 500);
    }
}
