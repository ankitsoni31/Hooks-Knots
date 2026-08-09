import { Request, Response, NextFunction } from 'express';
import { errorResponse } from '../utils/response.js';
import { verifyJwt } from '../utils/jwt.js';

export interface AuthenticatedUser {
    id: number;
    email: string;
    name: string;
}

export async function requireUserAuth(req: Request, res: Response, next: NextFunction) {
    let token = req.cookies?.userAuthToken as string | undefined;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return errorResponse(res, 'Authentication required', 401);
    }

    try {
        const decoded = verifyJwt(token) as AuthenticatedUser;
        (req as any).user = decoded;
        return next();
    } catch {
        return errorResponse(res, 'Authentication required', 401);
    }
}
