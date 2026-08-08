import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as paymentService from '../services/paymentService.js';

// POST /api/payments/razorpay/verify  (public — called by frontend after checkout)
export async function verifyPayment(req: Request, res: Response) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return errorResponse(res, 'Missing payment verification data', 400);
        }

        const result = await paymentService.verifyAndConfirmPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        return successResponse(res, {
            alreadyConfirmed: result.alreadyConfirmed,
            orderNumber: result.orderNumber,
        }, 'Payment verified successfully');

    } catch (error: any) {
        if (error.message === 'SIGNATURE_MISMATCH') {
            return errorResponse(res, 'Payment verification failed', 400);
        }
        if (error.message === 'PAYMENT_NOT_FOUND') {
            return errorResponse(res, 'Payment record not found', 404);
        }
        console.error('[verifyPayment] Error:', error);
        return errorResponse(res, 'Payment verification error', 500);
    }
}

// POST /api/payments/razorpay/webhook  (receives raw body — see server.ts)
export async function handleWebhook(req: Request, res: Response) {
    try {
        const signature = req.headers['x-razorpay-signature'] as string;
        if (!signature) {
            return res.status(400).json({ success: false, message: 'Missing webhook signature' });
        }

        // req.body is a Buffer here because of express.raw() middleware on this route
        const rawBody = req.body as Buffer;
        await paymentService.handleWebhookEvent(rawBody, signature);

        return res.status(200).json({ success: true });
    } catch (error: any) {
        if (error.message === 'INVALID_WEBHOOK_SIGNATURE') {
            return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
        }
        console.error('[webhook] Error:', error);
        return res.status(500).json({ success: false });
    }
}

// GET /api/admin/payments
export async function listPayments(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const status = req.query.status as string;
        const result = await paymentService.listPayments({ page, limit, search, status });
        return successResponse(res, result);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch payments', 500);
    }
}

// GET /api/admin/payments/:id
export async function getPayment(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const payment = await paymentService.getPaymentById(id);
        if (!payment) return errorResponse(res, 'Payment not found', 404);
        return successResponse(res, payment);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch payment', 500);
    }
}
