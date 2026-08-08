import { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/response.js';
import * as customerService from '../services/customerService.js';

export async function listCustomers(req: Request, res: Response) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const result = await customerService.listCustomers({ page, limit, search });
        return successResponse(res, result);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch customers', 500);
    }
}

export async function getCustomer(req: Request, res: Response) {
    try {
        const id = parseInt(req.params.id);
        const customer = await customerService.getCustomerById(id);
        if (!customer) return errorResponse(res, 'Customer not found', 404);
        return successResponse(res, customer);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch customer', 500);
    }
}

export async function getCustomerAddresses(req: Request, res: Response) {
    try {
        const customerId = parseInt(req.params.customerId);
        const addresses = await customerService.getCustomerAddresses(customerId);
        return successResponse(res, addresses);
    } catch (error: any) {
        return errorResponse(res, 'Failed to fetch addresses', 500);
    }
}
