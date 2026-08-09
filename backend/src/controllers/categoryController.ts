import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as categoryService from '../services/categoryService.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

export async function listCategories(req: Request, res: Response) {
    try {
        const isAdmin = req.originalUrl.includes('/admin/');
        const categories = await categoryService.getAllCategories(isAdmin);
        return successResponse(res, categories);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch categories', 500);
    }
}

export async function getCategory(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }
        return successResponse(res, category);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch category', 500);
    }
}

export async function createCategory(req: Request, res: Response) {
    try {
        const validated = createCategorySchema.parse(req.body);
        const category = await categoryService.createCategory(validated);
        return successResponse(res, category, 'Category created successfully', 201);
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return errorResponse(res, error.errors[0].message, 400);
        }
        if (error.message === 'DUPLICATE_CATEGORY') {
            return errorResponse(res, 'Category name already exists', 409);
        }
        return errorResponse(res, 'Failed to create category', 500);
    }
}

export async function updateCategory(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const validated = updateCategorySchema.parse(req.body);
        const category = await categoryService.updateCategory(id, validated);
        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }
        return successResponse(res, category, 'Category updated successfully');
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return errorResponse(res, error.errors[0].message, 400);
        }
        if (error.message === 'DUPLICATE_CATEGORY') {
            return errorResponse(res, 'Category name already exists', 409);
        }
        return errorResponse(res, 'Failed to update category', 500);
    }
}

export async function deleteCategory(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const deleted = await categoryService.deleteCategory(id);
        if (!deleted) {
            return errorResponse(res, 'Category not found', 404);
        }
        return successResponse(res, null, 'Category deleted successfully');
    } catch (error: any) {
        if (error.message === 'CATEGORY_HAS_PRODUCTS') {
            return errorResponse(res, 'Cannot delete category because products are assigned to it', 409);
        }
        return errorResponse(res, 'Failed to delete category', 500);
    }
}
