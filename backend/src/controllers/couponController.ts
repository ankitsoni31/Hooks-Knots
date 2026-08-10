import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as couponService from '../services/couponService.js';
import { z } from 'zod';

const couponSchema = z.object({
    code: z.string().min(1).toUpperCase(),
    discount_type: z.enum(['PERCENTAGE', 'FIXED']),
    discount_value: z.number({ coerce: true }).positive(),
    min_order_amount: z.number({ coerce: true }).nonnegative().optional().nullable(),
    max_discount_amount: z.number({ coerce: true }).nonnegative().optional().nullable(),
    usage_limit: z.number({ coerce: true }).int().positive().optional().nullable(),
    expires_at: z.string().optional().nullable(),
    is_active: z.boolean().optional(),
});

export async function createCoupon(req: Request, res: Response) {
    try {
        const data = couponSchema.parse(req.body);
        const coupon = await couponService.createCoupon(data as any);
        return successResponse(res, coupon, 'Coupon created successfully', 201);
    } catch (error: any) {
        if (error.name === 'ZodError') return errorResponse(res, error.errors[0].message, 400);
        if (error.code === 'ER_DUP_ENTRY') return errorResponse(res, 'Coupon code already exists', 400);
        console.error(error);
        return errorResponse(res, 'Failed to create coupon', 500);
    }
}

export async function getCoupons(req: Request, res: Response) {
    try {
        const coupons = await couponService.getCoupons();
        return successResponse(res, coupons);
    } catch (error) {
        console.error(error);
        return errorResponse(res, 'Failed to fetch coupons', 500);
    }
}

export async function getCoupon(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const coupon = await couponService.getCouponById(id);
        if (!coupon) return errorResponse(res, 'Coupon not found', 404);
        return successResponse(res, coupon);
    } catch (error) {
        return errorResponse(res, 'Failed to fetch coupon', 500);
    }
}

export async function updateCoupon(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const data = couponSchema.partial().parse(req.body);
        await couponService.updateCoupon(id, data as any);
        return successResponse(res, null, 'Coupon updated successfully');
    } catch (error: any) {
        if (error.name === 'ZodError') return errorResponse(res, error.errors[0].message, 400);
        if (error.code === 'ER_DUP_ENTRY') return errorResponse(res, 'Coupon code already exists', 400);
        return errorResponse(res, 'Failed to update coupon', 500);
    }
}

export async function deleteCoupon(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        await couponService.deleteCoupon(id);
        return successResponse(res, null, 'Coupon deleted successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to delete coupon', 500);
    }
}

export async function validateCoupon(req: Request, res: Response) {
    try {
        const { code, subtotal } = req.body;
        if (!code || subtotal === undefined) {
            return errorResponse(res, 'Code and subtotal are required', 400);
        }
        
        const result = await couponService.validateCoupon(code, Number(subtotal));
        return successResponse(res, result, 'Coupon applied successfully');
    } catch (error: any) {
        if (error.message === 'COUPON_NOT_FOUND') return errorResponse(res, 'Invalid coupon code', 404);
        if (error.message === 'COUPON_INACTIVE') return errorResponse(res, 'Coupon is inactive', 400);
        if (error.message === 'COUPON_EXPIRED') return errorResponse(res, 'Coupon has expired', 400);
        if (error.message === 'COUPON_USAGE_LIMIT_REACHED') return errorResponse(res, 'Coupon usage limit reached', 400);
        if (error.message?.startsWith('COUPON_MIN_ORDER')) {
            const min = error.message.split(':')[1];
            return errorResponse(res, `Minimum order amount of ₹${min} required`, 400);
        }
        console.error(error);
        return errorResponse(res, 'Failed to validate coupon', 500);
    }
}
