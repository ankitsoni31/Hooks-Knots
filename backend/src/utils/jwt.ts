import jwt from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/config.js';

const jwtSecret = JWT_SECRET as string;

export function signJwt(payload: Record<string, unknown>) {
    const options = { expiresIn: JWT_EXPIRES_IN } as unknown as Record<string, unknown>;
    return jwt.sign(payload as string | object, jwtSecret, options);
}

export function verifyJwt(token: string) {
    return jwt.verify(token, jwtSecret);
}
