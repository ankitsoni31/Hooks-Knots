import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { getDashboardStats } from '../services/orderService.js';

export async function dashboard(_req: Request, res: Response) {
    try {
        const stats = await getDashboardStats();
        return successResponse(res, stats, 'Dashboard data');
    } catch {
        return successResponse(res, { total_products: 0, active_products: 0, total_customers: 0, total_orders: 0, pending_orders: 0 }, 'Dashboard');
    }
}

export async function updateProfile(req: Request, res: Response) {
    try {
        const adminId = (req as any).admin.id;
        const { first_name, last_name, theme, notifications_enabled } = req.body;
        
        await pool.execute(
            'UPDATE admins SET first_name = ?, last_name = ?, theme = ?, notifications_enabled = ? WHERE id = ?',
            [first_name || '', last_name || '', theme || 'system', notifications_enabled !== false, adminId]
        );
        
        return successResponse(res, null, 'Profile updated successfully');
    } catch (err) {
        console.error('Update profile error:', err);
        return errorResponse(res, 'Failed to update profile', 500);
    }
}

export async function changePassword(req: Request, res: Response) {
    try {
        const adminId = (req as any).admin.id;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return errorResponse(res, 'Current and new password are required');
        }

        const [rows] = await pool.execute('SELECT password_hash FROM admins WHERE id = ? LIMIT 1', [adminId]);
        const admins = rows as any[];
        
        if (admins.length === 0) {
            return errorResponse(res, 'Admin not found', 404);
        }
        
        const validPassword = await bcrypt.compare(current_password, admins[0].password_hash);
        if (!validPassword) {
            return errorResponse(res, 'Incorrect current password', 401);
        }

        const hashed = await bcrypt.hash(new_password, 10);
        await pool.execute('UPDATE admins SET password_hash = ? WHERE id = ?', [hashed, adminId]);

        return successResponse(res, null, 'Password changed successfully');
    } catch (err) {
        console.error('Change password error:', err);
        return errorResponse(res, 'Failed to change password', 500);
    }
}
