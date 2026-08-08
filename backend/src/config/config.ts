import { z } from 'zod';
import dotenv from 'dotenv';
dotenv.config();

const envSchema = z.object({
    DB_HOST: z.string().default('127.0.0.1'),
    DB_PORT: z.string().default('3306'),
    DB_USER: z.string().default('root'),
    DB_PASSWORD: z.string().default(''),
    DB_NAME: z.string().default('hooks_knots'),
    PORT: z.string().default('5000'),
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
    CORS_ORIGIN: z.string().default('http://localhost:5173,http://localhost:5174,http://127.0.0.1:5173,http://127.0.0.1:5174'),
    NODE_ENV: z.string().default('development'),
});

export const env = envSchema.parse(process.env);

export const PORT = Number(env.PORT);
export const JWT_SECRET = env.JWT_SECRET;
export const JWT_EXPIRES_IN = env.JWT_EXPIRES_IN;
export const DB_CONFIG = {
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
};

export const RAZORPAY_CONFIG = {
    keyId: env.RAZORPAY_KEY_ID || '',
    keySecret: env.RAZORPAY_KEY_SECRET || '',
    webhookSecret: env.RAZORPAY_WEBHOOK_SECRET || '',
};

// Support comma-separated origins e.g. "http://localhost:5173,http://localhost:5174"
export const CORS_ORIGIN = env.CORS_ORIGIN.split(',').map(o => o.trim());
export const IS_PRODUCTION = env.NODE_ENV === 'production';
