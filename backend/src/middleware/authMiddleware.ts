import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.js';
import { verifyJwt } from '../utils/jwt.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 'Authorization token missing', 401);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = verifyJwt(token);
        (req as any).user = decoded;
        return next();
    } catch {
        return errorResponse(res, 'Invalid or expired token', 401);
    }
}
