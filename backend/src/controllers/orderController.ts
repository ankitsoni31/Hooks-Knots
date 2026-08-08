import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as orderService from '../services/orderService.js';
import * as paymentService from '../services/paymentService.js';
import { RAZORPAY_CONFIG } from '../config/config.js';
import { z } from 'zod';

const createOrderSchema = z.object({
    customer: z.object({
        first_name: z.string().min(1, 'First name required'),
        last_name: z.string().min(1, 'Last name required'),
        email: z.string().email('Invalid email'),
        phone: z.string().optional(),
    }),
    address: z.object({
        full_name: z.string().min(1, 'Full name required'),
        phone: z.string().optional(),
        address_line: z.string().min(1, 'Address required'),
        city: z.string().min(1, 'City required'),
        state: z.string().min(1, 'State required'),
        pincode: z.string().min(4, 'Invalid pincode'),
        country: z.string().min(1, 'Country required'),
    }),
    items: z.array(z.object({
        product_id: z.number({ coerce: true }).int().positive('Invalid product'),
        quantity: z.number({ coerce: true }).int().min(1, 'Quantity must be at least 1'),
    })).min(1, 'Order must have at least one item'),
});

export async function createOrder(req: Request, res: Response) {
    try {
        const data = createOrderSchema.parse(req.body);

        // 1. Validate + create local order (server-side price calc, no stock deduction yet)
        const order = await orderService.createOrder(data);

        // 2. Create Razorpay order
        let razorpayData = null;
        try {
            razorpayData = await paymentService.createRazorpayOrder({
                orderId: order.order_id,
                customerId: order.customer_id,
                amount: order.total,
                currency: 'INR',
                receipt: order.order_number,
            });
        } catch (rzpErr: any) {
            // If Razorpay not configured, return order without payment (dev mode)
            if (rzpErr.message === 'RAZORPAY_CONFIG_MISSING') {
                return successResponse(res, {
                    orderId: order.order_id,
                    orderNumber: order.order_number,
                    razorpayOrderId: null,
                    razorpayKeyId: null,
                    amount: Math.round(order.total * 100),
                    currency: 'INR',
                    devMode: true,
                }, 'Order created (Razorpay not configured)', 201);
            }
            throw rzpErr;
        }

        return successResponse(res, {
            orderId: order.order_id,
            orderNumber: order.order_number,
            razorpayOrderId: razorpayData.razorpayOrderId,
            razorpayKeyId: RAZORPAY_CONFIG.keyId, // Only KEY ID, never secret
            amount: razorpayData.amount,
            currency: razorpayData.currency,
        }, 'Order created', 201);

    } catch (error: any) {
        if (error.name === 'ZodError') return errorResponse(res, error.errors[0].message, 400);
        if (error.message === 'INVALID_QUANTITY') return errorResponse(res, 'Invalid quantity', 400);
        if (error.message?.startsWith('PRODUCT_NOT_FOUND')) return errorResponse(res, 'Product not found', 404);
        if (error.message?.startsWith('PRODUCT_INACTIVE')) {
            return errorResponse(res, `Product "${error.message.split(':')[1]}" is currently unavailable`, 400);
        }
        if (error.message?.startsWith('INSUFFICIENT_STOCK')) {
            return errorResponse(res, `Insufficient stock for "${error.message.split(':')[1]}"`, 400);
        }
        console.error('[createOrder] Error:', error);
        return errorResponse(res, 'Failed to create order', 500);
    }
}

export async function listOrders(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const status = req.query.status as string;
        const result = await orderService.getOrders({ page, limit, search, status });
        return successResponse(res, result);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch orders', 500);
    }
}

export async function getOrder(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const order = await orderService.getOrderById(id);
        if (!order) return errorResponse(res, 'Order not found', 404);

        // Attach payment info
        const payment = await paymentService.getPaymentByOrderId(id);
        return successResponse(res, { ...order, payment: payment || null });
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch order', 500);
    }
}

export async function updateOrderStatus(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const { status } = req.body;
        if (!status) return errorResponse(res, 'Status is required', 400);
        await orderService.updateOrderStatus(id, status);
        return successResponse(res, null, 'Order status updated');
    } catch (error: any) {
        if (error.message === 'ORDER_NOT_FOUND') return errorResponse(res, 'Order not found', 404);
        if (error.message === 'INVALID_STATUS') return errorResponse(res, 'Invalid status', 400);
        if (error.message?.startsWith('INVALID_TRANSITION')) {
            return errorResponse(res, `Invalid status transition: ${error.message.split(':')[1]}`, 400);
        }
        return errorResponse(res, 'Failed to update order status', 500);
    }
}
