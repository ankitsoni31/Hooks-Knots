import { Request, Response } from 'express';
import { successResponse } from '../utils/response.js';

export async function listAddresses(_req: Request, res: Response) {
    return successResponse(res, [], 'Addresses list placeholder');
}

export async function getAddress(_req: Request, res: Response) {
    return successResponse(res, null, 'Address detail placeholder');
}
