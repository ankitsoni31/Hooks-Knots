import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';

export async function register(req: Request, res: Response) {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return errorResponse(res, 'Missing required fields', 400);
    }

    try {
        const [existing] = await pool.execute('SELECT id FROM customers WHERE email = ? LIMIT 1', [email]);
        if ((existing as any[]).length > 0) {
            return errorResponse(res, 'Email already in use', 400);
        }

        const password_hash = await bcrypt.hash(password, 10);
        const [result] = await pool.execute(
            'INSERT INTO customers (first_name, last_name, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone || null, password_hash]
        );

        const insertId = (result as any).insertId;
        const token = signJwt({ id: insertId, email, name: `${first_name} ${last_name}` });

        res.cookie('userAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return successResponse(res, { token, user: { id: insertId, first_name, last_name, email, phone } }, 'Registration successful', 201);
    } catch (error: any) {
        return errorResponse(res, 'Failed to register', 500);
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
    }

    const [rows] = await pool.execute(
        'SELECT id, email, password_hash, first_name, last_name, phone FROM customers WHERE email = ? LIMIT 1',
        [email]
    );

    const customers = rows as any[];
    const customer = customers[0];

    if (!customer || !customer.password_hash || !(await bcrypt.compare(password, customer.password_hash))) {
        return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = signJwt({ id: customer.id, email: customer.email, name: `${customer.first_name} ${customer.last_name}` });

    res.cookie('userAuthToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return successResponse(
        res,
        {
            token,
            user: {
                id: customer.id,
                email: customer.email,
                first_name: customer.first_name,
                last_name: customer.last_name,
                phone: customer.phone,
            },
        },
        'Login successful'
    );
}

export async function me(req: Request, res: Response) {
    const userJwt = (req as any).user;
    const [rows] = await pool.execute(
        'SELECT id, email, first_name, last_name, phone FROM customers WHERE id = ? LIMIT 1',
        [userJwt.id]
    );
    const users = rows as any[];
    if (users.length === 0) {
        return errorResponse(res, 'User not found', 404);
    }
    const user = users[0];
    return successResponse(res, { user }, 'Authenticated user');
}

export async function logout(_req: Request, res: Response) {
    res.clearCookie('userAuthToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
    });
    return successResponse(res, {}, 'Logged out');
}
