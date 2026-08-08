import { pool } from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export async function listCustomers(options: {
    page: number;
    limit: number;
    search?: string;
}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    let where = '1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (options.search) {
        const like = `%${options.search}%`;
        where = `(CONCAT(c.first_name, ' ', c.last_name) LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)`;
        params.push(like, like, like);
        countParams.push(like, like, like);
    }

    const query = `
        SELECT 
            c.id, c.first_name, c.last_name, c.email, c.phone, c.created_at,
            COUNT(DISTINCT o.id) AS order_count,
            COALESCE(SUM(o.total), 0) AS total_spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE ${where}
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ? OFFSET ?
    `;
    const countQuery = `SELECT COUNT(DISTINCT c.id) AS total FROM customers c WHERE ${where}`;

    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const total = countResult[0].total as number;

    return {
        items: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
}

export async function getCustomerById(id: number) {
    const [customers] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM customers WHERE id = ?', [id]
    );
    if (customers.length === 0) return null;
    const customer = customers[0];

    const [addresses] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC', [id]
    );

    const [orderStats] = await pool.query<RowDataPacket[]>(`
        SELECT COUNT(*) AS order_count, COALESCE(SUM(total), 0) AS total_spent
        FROM orders WHERE customer_id = ?
    `, [id]);

    const [recentOrders] = await pool.query<RowDataPacket[]>(`
        SELECT id, order_number, status, total, placed_at
        FROM orders WHERE customer_id = ?
        ORDER BY placed_at DESC LIMIT 10
    `, [id]);

    return {
        ...customer,
        addresses,
        order_count: orderStats[0].order_count,
        total_spent: orderStats[0].total_spent,
        recent_orders: recentOrders
    };
}

export async function findOrCreateCustomer(data: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
}): Promise<number> {
    const [existing] = await pool.query<RowDataPacket[]>(
        'SELECT id FROM customers WHERE email = ?', [data.email]
    );
    if (existing.length > 0) {
        // Update name/phone if changed
        await pool.query(
            'UPDATE customers SET first_name=?, last_name=?, phone=COALESCE(?,phone) WHERE id=?',
            [data.first_name, data.last_name, data.phone || null, existing[0].id]
        );
        return existing[0].id;
    }
    const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO customers (first_name, last_name, email, phone) VALUES (?,?,?,?)',
        [data.first_name, data.last_name, data.email, data.phone || null]
    );
    return result.insertId;
}

export async function createAddress(customerId: number, data: {
    full_name: string;
    phone?: string;
    address_line: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(`
        INSERT INTO addresses (customer_id, line1, city, state, postal_code, country, phone)
        VALUES (?,?,?,?,?,?,?)
    `, [customerId, data.address_line, data.city, data.state, data.pincode, data.country, data.phone || null]);
    return result.insertId;
}

export async function getCustomerAddresses(customerId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC', [customerId]
    );
    return rows;
}
