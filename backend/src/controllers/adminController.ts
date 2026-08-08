import { Request, Response } from 'express';
import { successResponse } from '../utils/response.js';
import { getDashboardStats } from '../services/orderService.js';

export async function dashboard(_req: Request, res: Response) {
    try {
        const stats = await getDashboardStats();
        return successResponse(res, stats, 'Dashboard data');
    } catch {
        return successResponse(res, { total_products: 0, active_products: 0, total_customers: 0, total_orders: 0, pending_orders: 0 }, 'Dashboard');
    }
}
