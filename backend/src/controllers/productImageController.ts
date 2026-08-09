import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as productImageService from '../services/productImageService.js';
import * as productService from '../services/productService.js';

export async function getProductImages(req: Request, res: Response) {
    try {
        const productId = parseInt(req.params.productId);
        const images = await productImageService.getImagesByProductId(productId);
        return successResponse(res, images);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch images', 500);
    }
}

export async function uploadProductImages(req: Request, res: Response) {
    try {
        const productId = parseInt(req.params.productId);
        
        // Verify product exists
        const product = await productService.getProductById(productId);
        if (!product) {
            return errorResponse(res, 'Product not found', 404);
        }

        const files = req.files as Express.Multer.File[];
        if (!files || files.length === 0) {
            return errorResponse(res, 'No valid images uploaded', 400);
        }

        const uploadedImages = await productImageService.uploadImages(productId, files);
        return successResponse(res, uploadedImages, 'Images uploaded successfully', 201);
    } catch (error: any) {
        if (error.message === 'INVALID_FILE_TYPE') {
            return errorResponse(res, 'Invalid image type', 400);
        }
        return errorResponse(res, 'Failed to upload images', 500);
    }
}

export async function setPrimaryImage(req: Request, res: Response) {
    try {
        const productId = parseInt(req.params.productId);
        const imageId = parseInt(req.params.imageId);
        await productImageService.setPrimaryImage(productId, imageId);
        return successResponse(res, null, 'Primary image set successfully');
    } catch (error: any) {
        if (error.message === 'IMAGE_NOT_FOUND') {
            return errorResponse(res, 'Image not found', 404);
        }
        return errorResponse(res, 'Failed to set primary image', 500);
    }
}

export async function reorderImages(req: Request, res: Response) {
    try {
        const productId = parseInt(req.params.productId);
        const images: { id: number; sort_order: number }[] = req.body.images;
        
        if (!Array.isArray(images)) {
            return errorResponse(res, 'Invalid request format', 400);
        }

        await productImageService.reorderImages(productId, images);
        return successResponse(res, null, 'Images reordered successfully');
    } catch (error: any) {
        return errorResponse(res, 'Failed to reorder images', 500);
    }
}

export async function deleteProductImage(req: Request, res: Response) {
    try {
        const productId = parseInt(req.params.productId);
        const imageId = parseInt(req.params.imageId);
        await productImageService.deleteImage(productId, imageId);
        return successResponse(res, null, 'Image deleted successfully');
    } catch (error: any) {
        if (error.message === 'IMAGE_NOT_FOUND') {
            return errorResponse(res, 'Image not found', 404);
        }
        return errorResponse(res, 'Failed to delete image', 500);
    }
}
