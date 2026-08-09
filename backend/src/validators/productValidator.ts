import { z } from 'zod';

export const createProductSchema = z.object({
    category_id: z.number({
        required_error: 'Category ID is required',
        invalid_type_error: 'Category ID must be a number',
    }),
    name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
    description: z.string().optional(),
    price: z.number({ coerce: true }).min(0, 'Price must be greater than or equal to 0'),
    discount_price: z.number({ coerce: true }).min(0, 'Discount price cannot be negative').optional().nullable(),
    stock: z.number({ coerce: true }).int().min(0, 'Stock must be a non-negative integer').default(0),
    sku: z.string().max(100, 'SKU is too long').optional().nullable(),
    status: z.enum(['active', 'inactive']).default('active'),
    featured: z.boolean({ coerce: true }).default(false),
}).refine((data) => {
    if (data.discount_price !== undefined && data.discount_price !== null) {
        return data.discount_price <= data.price;
    }
    return true;
}, {
    message: 'Discount price must not exceed original price',
    path: ['discount_price'],
});

export const updateProductSchema = z.object({
    category_id: z.number().optional(),
    name: z.string().min(1).max(255).optional(),
    description: z.string().optional(),
    price: z.number({ coerce: true }).min(0).optional(),
    discount_price: z.number({ coerce: true }).min(0).optional().nullable(),
    stock: z.number({ coerce: true }).int().min(0).optional(),
    sku: z.string().max(100).optional().nullable(),
    status: z.enum(['active', 'inactive']).optional(),
    featured: z.boolean({ coerce: true }).optional(),
}).refine((data) => {
    if (data.price !== undefined && data.discount_price !== undefined && data.discount_price !== null) {
        return data.discount_price <= data.price;
    }
    return true; // We can't fully validate cross-field if one is missing, handled at service level if needed, but this is a good start.
}, {
    message: 'Discount price must not exceed original price',
    path: ['discount_price'],
});
