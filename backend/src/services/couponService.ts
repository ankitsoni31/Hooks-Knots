import { pool } from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface CouponData {
    code: string;
    discount_type: 'PERCENTAGE' | 'FIXED';
    discount_value: number;
    min_order_amount?: number;
    max_discount_amount?: number;
    usage_limit?: number;
    expires_at?: string;
    is_active?: boolean;
}

export async function createCoupon(data: CouponData) {
    const [result] = await pool.query<ResultSetHeader>(`
        INSERT INTO coupons (
            code, discount_type, discount_value, min_order_amount, 
            max_discount_amount, usage_limit, expires_at, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        data.code, data.discount_type, data.discount_value, data.min_order_amount || null,
        data.max_discount_amount || null, data.usage_limit || null, data.expires_at || null,
        data.is_active !== undefined ? data.is_active : true
    ]);
    return { id: result.insertId, ...data };
}

export async function getCoupons() {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM coupons ORDER BY created_at DESC');
    return rows;
}

export async function getCouponById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM coupons WHERE id = ?', [id]);
    return rows[0] || null;
}

export async function updateCoupon(id: number, data: Partial<CouponData>) {
    const updates: string[] = [];
    const params: any[] = [];
    
    for (const [key, value] of Object.entries(data)) {
        updates.push(`${key} = ?`);
        params.push(value);
    }
    
    if (updates.length === 0) return true;
    
    params.push(id);
    await pool.query(`UPDATE coupons SET ${updates.join(', ')} WHERE id = ?`, params);
    return true;
}

export async function deleteCoupon(id: number) {
    await pool.query('DELETE FROM coupons WHERE id = ?', [id]);
    return true;
}

export async function validateCoupon(code: string, subtotal: number) {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM coupons WHERE code = ?', [code]);
    if (rows.length === 0) throw new Error('COUPON_NOT_FOUND');
    
    const coupon = rows[0];
    
    if (!coupon.is_active) throw new Error('COUPON_INACTIVE');
    
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
        throw new Error('COUPON_EXPIRED');
    }
    
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
        throw new Error('COUPON_USAGE_LIMIT_REACHED');
    }
    
    if (coupon.min_order_amount && subtotal < Number(coupon.min_order_amount)) {
        throw new Error(`COUPON_MIN_ORDER:${coupon.min_order_amount}`);
    }
    
    let discount = 0;
    const value = Number(coupon.discount_value);
    if (coupon.discount_type === 'PERCENTAGE') {
        discount = subtotal * (value / 100);
        if (coupon.max_discount_amount && discount > Number(coupon.max_discount_amount)) {
            discount = Number(coupon.max_discount_amount);
        }
    } else {
        discount = value;
    }
    
    // Ensure discount doesn't exceed subtotal
    if (discount > subtotal) {
        discount = subtotal;
    }
    
    return {
        id: coupon.id,
        code: coupon.code,
        discount_amount: Math.round(discount * 100) / 100, // round to 2 decimals
        coupon
    };
}
