import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export async function getAllCategories(includeInactive = false): Promise<Category[]> {
    let query = 'SELECT * FROM categories';
    if (!includeInactive) {
        query += ' WHERE status = "active"';
    }
    query += ' ORDER BY name ASC';
    const [rows] = await pool.query<RowDataPacket[]>(query);
    return rows as Category[];
}

export async function getCategoryById(id: number): Promise<Category | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM categories WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0] as Category;
}

export async function createCategory(data: { name: string; description?: string; status?: 'active' | 'inactive' }): Promise<Category> {
    const slug = generateSlug(data.name);
    
    // Check for duplicate slug
    const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE slug = ?', [slug]);
    if (existing.length > 0) {
        throw new Error('DUPLICATE_CATEGORY');
    }

    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO categories (name, slug, description, status) VALUES (?, ?, ?, ?)',
        [data.name, slug, data.description || null, data.status || 'active']
    );

    const category = await getCategoryById(result.insertId);
    return category!;
}

export async function updateCategory(id: number, data: { name?: string; description?: string; status?: 'active' | 'inactive' }): Promise<Category | null> {
    const current = await getCategoryById(id);
    if (!current) return null;

    let slug = current.slug;
    if (data.name && data.name !== current.name) {
        slug = generateSlug(data.name);
        const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM categories WHERE slug = ? AND id != ?', [slug, id]);
        if (existing.length > 0) {
            throw new Error('DUPLICATE_CATEGORY');
        }
    }

    const newName = data.name || current.name;
    const newDesc = data.description !== undefined ? data.description : current.description;
    const newStatus = data.status || current.status;

    await pool.query(
        'UPDATE categories SET name = ?, slug = ?, description = ?, status = ? WHERE id = ?',
        [newName, slug, newDesc, newStatus, id]
    );

    return await getCategoryById(id);
}

export async function deleteCategory(id: number): Promise<boolean> {
    // Check if category is used in products
    const [products] = await pool.query<RowDataPacket[]>('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id]);
    if (products.length > 0) {
        throw new Error('CATEGORY_HAS_PRODUCTS');
    }

    const [result] = await pool.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
    return result.affectedRows > 0;
}
