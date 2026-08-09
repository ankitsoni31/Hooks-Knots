import { pool } from '../config/db.js';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import fs from 'fs/promises';
import path from 'path';

export interface ProductImage {
    id: number;
    product_id: number;
    file_path: string;
    alt_text: string | null;
    is_primary: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export async function getImagesByProductId(productId: number): Promise<ProductImage[]> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM product_images WHERE product_id = ? ORDER BY display_order ASC, id ASC', [productId]);
    return rows as ProductImage[];
}

export async function uploadImages(productId: number, files: Express.Multer.File[]): Promise<ProductImage[]> {
    const currentImages = await getImagesByProductId(productId);
    let nextOrder = currentImages.length > 0 ? Math.max(...currentImages.map(i => i.display_order)) + 1 : 1;
    let hasPrimary = currentImages.some(i => i.is_primary);

    const insertedImages: ProductImage[] = [];

    for (const file of files) {
        const isPrimary = !hasPrimary;
        hasPrimary = true; // Set to true after first one

        const filePath = `/uploads/products/${file.filename}`;
        
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO product_images (product_id, file_path, is_primary, display_order) VALUES (?, ?, ?, ?)',
            [productId, filePath, isPrimary ? 1 : 0, nextOrder]
        );
        
        nextOrder++;

        const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM product_images WHERE id = ?', [result.insertId]);
        insertedImages.push(rows[0] as ProductImage);
    }

    return insertedImages;
}

export async function setPrimaryImage(productId: number, imageId: number): Promise<void> {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        
        // Verify image belongs to product
        const [rows] = await connection.query<RowDataPacket[]>('SELECT id FROM product_images WHERE id = ? AND product_id = ?', [imageId, productId]);
        if (rows.length === 0) throw new Error('IMAGE_NOT_FOUND');

        await connection.query('UPDATE product_images SET is_primary = FALSE WHERE product_id = ?', [productId]);
        await connection.query('UPDATE product_images SET is_primary = TRUE WHERE id = ?', [imageId]);
        
        await connection.commit();
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
}

export async function reorderImages(productId: number, orderUpdates: { id: number; sort_order: number }[]): Promise<void> {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        for (const update of orderUpdates) {
            await connection.query('UPDATE product_images SET display_order = ? WHERE id = ? AND product_id = ?', [update.sort_order, update.id, productId]);
        }
        await connection.commit();
    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
}

export async function deleteImage(productId: number, imageId: number): Promise<boolean> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM product_images WHERE id = ? AND product_id = ?', [imageId, productId]);
    if (rows.length === 0) throw new Error('IMAGE_NOT_FOUND');
    
    const image = rows[0] as ProductImage;
    
    // Delete from DB
    await pool.query('DELETE FROM product_images WHERE id = ?', [imageId]);
    
    // Delete physical file safely
    try {
        // Extract filename from file_path, e.g. /uploads/products/xyz.jpg -> xyz.jpg
        const filename = image.file_path.split('/').pop();
        if (filename) {
            const absolutePath = path.join(process.cwd(), 'uploads', 'products', filename);
            await fs.unlink(absolutePath);
        }
    } catch (e) {
        console.error('Failed to delete physical file', e);
    }

    // Reassign primary if needed
    if (image.is_primary) {
        const [remaining] = await pool.query<RowDataPacket[]>('SELECT id FROM product_images WHERE product_id = ? ORDER BY display_order ASC LIMIT 1', [productId]);
        if (remaining.length > 0) {
            await pool.query('UPDATE product_images SET is_primary = TRUE WHERE id = ?', [remaining[0].id]);
        }
    }

    return true;
}
