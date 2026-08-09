import { Request, Response } from 'express';
import { pool } from '../config/db.js';
import bcrypt from 'bcrypt';
import { signJwt } from '../utils/jwt.js';
import { successResponse, errorResponse } from '../utils/response.js';
import { sendOTPEmail } from '../services/emailService.js';

// Helper to generate a 6-digit numeric OTP
function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function register(req: Request, res: Response) {
    const { first_name, last_name, email, phone, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return errorResponse(res, 'Missing required fields', 400);
    }

    try {
        const [existingRows] = await pool.execute('SELECT id, is_verified FROM customers WHERE email = ? LIMIT 1', [email]);
        const existing = (existingRows as any[])[0];

        if (existing && existing.is_verified) {
            return errorResponse(res, 'Email already in use', 400);
        }

        const password_hash = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otp_hash = await bcrypt.hash(otp, 10);
        const expires_at = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
        const now = new Date();

        if (existing) {
            // Update unverified user
            await pool.execute(
                `UPDATE customers 
                 SET first_name=?, last_name=?, phone=?, password_hash=?, 
                     otp_hash=?, otp_expires_at=?, otp_attempts=0, last_otp_sent_at=? 
                 WHERE id=?`,
                [first_name, last_name, phone || null, password_hash, otp_hash, expires_at, now, existing.id]
            );
        } else {
            // Insert new unverified user
            await pool.execute(
                `INSERT INTO customers 
                 (first_name, last_name, email, phone, password_hash, is_verified, otp_hash, otp_expires_at, otp_attempts, last_otp_sent_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [first_name, last_name, email, phone || null, password_hash, false, otp_hash, expires_at, 0, now]
            );
        }

        // Send OTP email
        await sendOTPEmail(email, otp, first_name);

        return successResponse(res, { email }, 'OTP sent to email. Please verify to complete registration.', 201);
    } catch (error: any) {
        console.error('Registration error:', error);
        return errorResponse(res, 'Failed to register', 500);
    }
}

export async function verifyOtp(req: Request, res: Response) {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return errorResponse(res, 'Email and OTP are required', 400);
    }

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM customers WHERE email = ? LIMIT 1',
            [email]
        );
        const customer = (rows as any[])[0];

        if (!customer) {
            return errorResponse(res, 'User not found', 404);
        }

        if (customer.is_verified) {
            return errorResponse(res, 'Email is already verified', 400);
        }

        if (customer.otp_attempts >= 5) {
            return errorResponse(res, 'Too many invalid attempts. Please request a new OTP.', 403);
        }

        if (!customer.otp_expires_at || new Date(customer.otp_expires_at) < new Date()) {
            return errorResponse(res, 'OTP has expired. Please request a new one.', 400);
        }

        const isMatch = await bcrypt.compare(otp, customer.otp_hash);

        if (!isMatch) {
            await pool.execute('UPDATE customers SET otp_attempts = otp_attempts + 1 WHERE id = ?', [customer.id]);
            return errorResponse(res, 'Invalid OTP', 400);
        }

        // OTP is correct
        await pool.execute(
            'UPDATE customers SET is_verified = TRUE, otp_hash = NULL, otp_expires_at = NULL, otp_attempts = 0 WHERE id = ?',
            [customer.id]
        );

        // Complete the registration and log them in
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
            'Verification and login successful'
        );
    } catch (error) {
        console.error('Verify OTP error:', error);
        return errorResponse(res, 'Failed to verify OTP', 500);
    }
}

export async function resendOtp(req: Request, res: Response) {
    const { email } = req.body;

    if (!email) {
        return errorResponse(res, 'Email is required', 400);
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, first_name, is_verified, last_otp_sent_at FROM customers WHERE email = ? LIMIT 1',
            [email]
        );
        const customer = (rows as any[])[0];

        if (!customer) {
            return errorResponse(res, 'User not found', 404);
        }

        if (customer.is_verified) {
            return errorResponse(res, 'Email is already verified', 400);
        }

        // Cooldown check (60 seconds)
        if (customer.last_otp_sent_at) {
            const timeSinceLastOtp = Date.now() - new Date(customer.last_otp_sent_at).getTime();
            if (timeSinceLastOtp < 60 * 1000) {
                return errorResponse(res, 'Please wait 60 seconds before requesting a new OTP', 429);
            }
        }

        const otp = generateOTP();
        const otp_hash = await bcrypt.hash(otp, 10);
        const expires_at = new Date(Date.now() + 10 * 60 * 1000);
        const now = new Date();

        await pool.execute(
            `UPDATE customers 
             SET otp_hash=?, otp_expires_at=?, otp_attempts=0, last_otp_sent_at=? 
             WHERE id=?`,
            [otp_hash, expires_at, now, customer.id]
        );

        await sendOTPEmail(email, otp, customer.first_name);

        return successResponse(res, null, 'New OTP sent to email');
    } catch (error) {
        console.error('Resend OTP error:', error);
        return errorResponse(res, 'Failed to resend OTP', 500);
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return errorResponse(res, 'Email and password are required', 400);
    }

    const [rows] = await pool.execute(
        'SELECT id, email, password_hash, first_name, last_name, phone, is_verified FROM customers WHERE email = ? LIMIT 1',
        [email]
    );

    const customer = (rows as any[])[0];

    if (!customer || !customer.password_hash || !(await bcrypt.compare(password, customer.password_hash))) {
        return errorResponse(res, 'Invalid email or password', 401);
    }

    if (!customer.is_verified) {
        return errorResponse(res, 'Please verify your email first', 403);
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
