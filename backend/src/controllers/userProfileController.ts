import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '../utils/response.js';

export async function updateProfile(req: Request, res: Response) {
    const userJwt = (req as any).user;
    const { first_name, last_name, phone } = req.body;

    if (!first_name || !last_name) {
        return errorResponse(res, 'First name and last name are required', 400);
    }

    try {
        await pool.execute(
            'UPDATE customers SET first_name = ?, last_name = ?, phone = ? WHERE id = ?',
            [first_name, last_name, phone || null, userJwt.id]
        );
        return successResponse(res, {}, 'Profile updated successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to update profile', 500);
    }
}

export async function updatePassword(req: Request, res: Response) {
    const userJwt = (req as any).user;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
        return errorResponse(res, 'Current and new passwords are required', 400);
    }

    try {
        const [rows] = await pool.execute('SELECT password_hash FROM customers WHERE id = ? LIMIT 1', [userJwt.id]);
        const customers = rows as any[];
        
        if (customers.length === 0) {
            return errorResponse(res, 'User not found', 404);
        }

        const customer = customers[0];
        
        if (!customer.password_hash || !(await bcrypt.compare(current_password, customer.password_hash))) {
            return errorResponse(res, 'Incorrect current password', 401);
        }

        const hashed = await bcrypt.hash(new_password, 10);
        await pool.execute('UPDATE customers SET password_hash = ? WHERE id = ?', [hashed, userJwt.id]);

        return successResponse(res, {}, 'Password updated successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to update password', 500);
    }
}

export async function getMyOrders(req: Request, res: Response) {
    const userJwt = (req as any).user;
    try {
        const [orders] = await pool.execute(
            'SELECT * FROM orders WHERE customer_id = ? ORDER BY placed_at DESC',
            [userJwt.id]
        );

        // Fetch order items for each order
        const ordersList = orders as any[];
        for (let order of ordersList) {
            const [items] = await pool.execute(
                'SELECT * FROM order_items WHERE order_id = ?',
                [order.id]
            );
            order.items = items;
        }

        return successResponse(res, { orders: ordersList }, 'User orders fetched successfully');
    } catch (error) {
        return errorResponse(res, 'Failed to fetch orders', 500);
    }
}
