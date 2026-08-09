import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function login(req: Request, res: Response) {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
    }

    const [rows] = await pool.execute(
        'SELECT id, email, password_hash, first_name, last_name FROM admins WHERE email = ? LIMIT 1',
        [email],
    );

    const admins = rows as Array<{ id: number; email: string; password_hash: string; first_name: string; last_name: string }>;
    const admin = admins[0];

    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
        return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = signJwt({ id: admin.id, email: admin.email, name: `${admin.first_name} ${admin.last_name}` });

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
    });

    return successResponse(
        res,
        {
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                first_name: admin.first_name,
                last_name: admin.last_name,
            },
        },
        'Login successful',
    );
}

export async function me(req: Request, res: Response) {
    const admin = (req as any).admin;
    return successResponse(res, { admin }, 'Authenticated admin');
}

export async function logout(_req: Request, res: Response) {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });

    return successResponse(res, {}, 'Logged out');
}
