import { z } from 'zod';

export const createCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(150, 'Name is too long'),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).default('active'),
});

export const updateCategorySchema = z.object({
    name: z.string().min(1, 'Name is required').max(150, 'Name is too long').optional(),
    description: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
});
