import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string | null;
    price: number;
    discount_price: number | null;
    stock: number;
    sku: string | null;
    status: 'active' | 'inactive';
    featured: boolean;
    created_at: string;
    updated_at: string;
    category_name?: string;
}

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function getProducts(options: {
    page?: number;
    limit?: number;
    search?: string;
    category_id?: number;
    status?: string;
    featured?: boolean;
    sort?: string;
}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    let query = 'SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE 1=1';
    let countQuery = 'SELECT COUNT(p.id) as total FROM products p WHERE 1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (options.search) {
        const searchPattern = `%${options.search}%`;
        query += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.slug LIKE ?)';
        countQuery += ' AND (p.name LIKE ? OR p.sku LIKE ? OR p.slug LIKE ?)';
        params.push(searchPattern, searchPattern, searchPattern);
        countParams.push(searchPattern, searchPattern, searchPattern);
    }

    if (options.category_id) {
        query += ' AND p.category_id = ?';
        countQuery += ' AND p.category_id = ?';
        params.push(options.category_id);
        countParams.push(options.category_id);
    }

    if (options.status) {
        query += ' AND p.status = ?';
        countQuery += ' AND p.status = ?';
        params.push(options.status);
        countParams.push(options.status);
    }

    if (options.featured !== undefined) {
        query += ' AND p.featured = ?';
        countQuery += ' AND p.featured = ?';
        params.push(options.featured ? 1 : 0);
        countParams.push(options.featured ? 1 : 0);
    }

    const sortFields: Record<string, string> = {
        newest: 'p.created_at DESC',
        oldest: 'p.created_at ASC',
        price_low: 'p.price ASC',
        price_high: 'p.price DESC',
        name: 'p.name ASC'
    };

    const orderBy = (options.sort && sortFields[options.sort]) ? sortFields[options.sort] : 'p.created_at DESC';
    query += ` ORDER BY ${orderBy} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    
    const total = countResult[0].total as number;

    return {
        items: rows as Product[],
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
        }
    };
}

export async function getProductById(id: number): Promise<Product | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as Product;
}

export async function createProduct(data: any): Promise<Product> {
    const slug = generateSlug(data.name);

    // Check duplicate slug
    let finalSlug = slug;
    let [existingSlug] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE slug = ?', [finalSlug]);
    let counter = 1;
    while (existingSlug.length > 0) {
        finalSlug = `${slug}-${counter}`;
        [existingSlug] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE slug = ?', [finalSlug]);
        counter++;
    }

    if (data.sku) {
        const [existingSku] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE sku = ?', [data.sku]);
        if (existingSku.length > 0) {
            throw new Error('DUPLICATE_SKU');
        }
    }

    // Verify category exists
    const [category] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ?', [data.category_id]);
    if (category.length === 0) {
        throw new Error('CATEGORY_NOT_FOUND');
    }

    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO products 
         (category_id, name, slug, description, price, discount_price, stock, sku, status, featured) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            data.category_id,
            data.name,
            finalSlug,
            data.description || null,
            data.price,
            data.discount_price !== undefined ? data.discount_price : null,
            data.stock,
            data.sku || null,
            data.status || 'active',
            data.featured ? 1 : 0
        ]
    );

    return (await getProductById(result.insertId))!;
}

export async function updateProduct(id: number, data: any): Promise<Product | null> {
    const current = await getProductById(id);
    if (!current) return null;

    if (data.category_id && data.category_id !== current.category_id) {
        const [category] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE id = ?', [data.category_id]);
        if (category.length === 0) throw new Error('CATEGORY_NOT_FOUND');
    }

    if (data.sku && data.sku !== current.sku) {
        const [existingSku] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE sku = ? AND id != ?', [data.sku, id]);
        if (existingSku.length > 0) throw new Error('DUPLICATE_SKU');
    }

    let finalSlug = current.slug;
    if (data.name && data.name !== current.name) {
        finalSlug = generateSlug(data.name);
        let [existingSlug] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE slug = ? AND id != ?', [finalSlug, id]);
        let counter = 1;
        while (existingSlug.length > 0) {
            finalSlug = `${generateSlug(data.name)}-${counter}`;
            [existingSlug] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE slug = ? AND id != ?', [finalSlug, id]);
            counter++;
        }
    }

    const updateFields = {
        category_id: data.category_id !== undefined ? data.category_id : current.category_id,
        name: data.name !== undefined ? data.name : current.name,
        slug: finalSlug,
        description: data.description !== undefined ? data.description : current.description,
        price: data.price !== undefined ? data.price : current.price,
        discount_price: data.discount_price !== undefined ? data.discount_price : current.discount_price,
        stock: data.stock !== undefined ? data.stock : current.stock,
        sku: data.sku !== undefined ? data.sku : current.sku,
        status: data.status !== undefined ? data.status : current.status,
        featured: data.featured !== undefined ? (data.featured ? 1 : 0) : current.featured,
    };

    await pool.query(
        `UPDATE products SET 
         category_id = ?, name = ?, slug = ?, description = ?, price = ?, 
         discount_price = ?, stock = ?, sku = ?, status = ?, featured = ?
         WHERE id = ?`,
        [
            updateFields.category_id,
            updateFields.name,
            updateFields.slug,
            updateFields.description,
            updateFields.price,
            updateFields.discount_price,
            updateFields.stock,
            updateFields.sku,
            updateFields.status,
            updateFields.featured,
            id
        ]
    );

    return await getProductById(id);
}

export async function deleteProduct(id: number): Promise<boolean> {
    // Instead of archiving automatically, this endpoint performs hard delete if not referenced.
    // If referenced in order_items, it throws an error because of DELETE RESTRICT in schema.
    try {
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows > 0;
    } catch (error: any) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            throw new Error('PRODUCT_REFERENCED');
        }
        throw error;
    }
}
