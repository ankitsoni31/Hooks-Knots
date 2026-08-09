import { pool } from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { findOrCreateCustomer, createAddress } from './customerService.js';

const SHIPPING_CHARGE = 0; // Free shipping for now — easy to change here
const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Allowed status transitions
const STATUS_TRANSITIONS: Record<string, string[]> = {
    PENDING:    ['CONFIRMED', 'CANCELLED'],
    CONFIRMED:  ['PROCESSING', 'CANCELLED'],
    PROCESSING: ['SHIPPED'],
    SHIPPED:    ['DELIVERED'],
    DELIVERED:  [],
    CANCELLED:  [],
};

function generateOrderNumber(): string {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `HK-${y}${m}${d}-${rand}`;
}

export async function createOrder(data: {
    customer: { first_name: string; last_name: string; email: string; phone?: string };
    address: { full_name: string; phone?: string; address_line: string; city: string; state: string; pincode: string; country: string };
    items: { product_id: number; quantity: number }[];
}) {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Find or create customer
        const customerId = await findOrCreateCustomer(data.customer);

        // 2. Create address record
        const addressId = await createAddress(customerId, data.address);

        // 3. Validate products and compute totals server-side
        const orderItems: { product_id: number; product_name: string; product_sku: string | null; unit_price: number; quantity: number; total_price: number }[] = [];
        let subtotal = 0;

        for (const item of data.items) {
            if (!item.quantity || item.quantity < 1) throw new Error('INVALID_QUANTITY');

            const [products] = await connection.query<RowDataPacket[]>(
                'SELECT id, name, sku, price, discount_price, stock, status FROM products WHERE id = ?',
                [item.product_id]
            );
            if (products.length === 0) throw new Error(`PRODUCT_NOT_FOUND:${item.product_id}`);
            const product = products[0];

            if (product.status !== 'active') throw new Error(`PRODUCT_INACTIVE:${product.name}`);
            if (product.stock < item.quantity) throw new Error(`INSUFFICIENT_STOCK:${product.name}`);

            // Use discount_price if set, else regular price
            const unitPrice = Number(product.discount_price) > 0 ? Number(product.discount_price) : Number(product.price);
            const itemTotal = unitPrice * item.quantity;
            subtotal += itemTotal;

            orderItems.push({
                product_id: product.id,
                product_name: product.name,
                product_sku: product.sku,
                unit_price: unitPrice,
                quantity: item.quantity,
                total_price: itemTotal
            });
        }

        const discount = 0; // No coupon system yet
        const shipping = SHIPPING_CHARGE;
        const total = subtotal - discount + shipping;

        // 4. Generate unique order number (retry on collision)
        let orderNumber = generateOrderNumber();
        let attempts = 0;
        while (attempts < 5) {
            const [existing] = await connection.query<RowDataPacket[]>('SELECT id FROM orders WHERE order_number = ?', [orderNumber]);
            if (existing.length === 0) break;
            orderNumber = generateOrderNumber();
            attempts++;
        }

        // 5. Create order with shipping snapshot
        const [orderResult] = await connection.query<ResultSetHeader>(`
            INSERT INTO orders (
                customer_id, address_id, order_number, status, subtotal, discount, shipping, total,
                shipping_name, shipping_phone, shipping_address, shipping_city, 
                shipping_state, shipping_pincode, shipping_country
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
            customerId, addressId, orderNumber, 'PENDING',
            subtotal, discount, shipping, total,
            data.address.full_name, data.address.phone || null,
            data.address.address_line, data.address.city,
            data.address.state, data.address.pincode, data.address.country
        ]);
        const orderId = orderResult.insertId;

        // 6. Create order items
        for (const item of orderItems) {
            await connection.query<ResultSetHeader>(`
                INSERT INTO order_items (order_id, product_id, product_name, product_sku, unit_price, quantity, total_price)
                VALUES (?,?,?,?,?,?,?)
            `, [orderId, item.product_id, item.product_name, item.product_sku, item.unit_price, item.quantity, item.total_price]);
        }

        await connection.commit();
        return { order_id: orderId, order_number: orderNumber, customer_id: customerId, total };

    } catch (e) {
        await connection.rollback();
        throw e;
    } finally {
        connection.release();
    }
}

export async function getOrders(options: {
    page: number;
    limit: number;
    search?: string;
    status?: string;
}) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    let conditions = '1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (options.search) {
        const like = `%${options.search}%`;
        conditions += ` AND (o.order_number LIKE ? OR CONCAT(c.first_name,' ',c.last_name) LIKE ? OR c.email LIKE ? OR c.phone LIKE ?)`;
        params.push(like, like, like, like);
        countParams.push(like, like, like, like);
    }
    if (options.status) {
        conditions += ' AND o.status = ?';
        params.push(options.status);
        countParams.push(options.status);
    }

    const query = `
        SELECT o.id, o.order_number, o.status, o.subtotal, o.discount, o.shipping, o.total, o.placed_at,
               c.first_name, c.last_name, c.email, c.phone
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE ${conditions}
        ORDER BY o.placed_at DESC
        LIMIT ? OFFSET ?
    `;
    const countQuery = `SELECT COUNT(o.id) AS total FROM orders o JOIN customers c ON c.id = o.customer_id WHERE ${conditions}`;

    params.push(limit, offset);
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const total = countResult[0].total as number;

    return {
        items: rows,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
}

export async function getOrderById(id: number) {
    const [orders] = await pool.query<RowDataPacket[]>(`
        SELECT o.*, c.first_name, c.last_name, c.email, c.phone AS customer_phone
        FROM orders o
        JOIN customers c ON c.id = o.customer_id
        WHERE o.id = ?
    `, [id]);
    if (orders.length === 0) return null;
    const order = orders[0];

    const [items] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM order_items WHERE order_id = ?', [id]
    );

    return { ...order, items };
}

export async function getOrderByNumber(orderNumber: string) {
    const [orders] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM orders WHERE order_number = ?', [orderNumber]
    );
    if (orders.length === 0) return null;
    return orders[0];
}

export async function updateOrderStatus(id: number, newStatus: string) {
    if (!VALID_STATUSES.includes(newStatus)) throw new Error('INVALID_STATUS');

    const [orders] = await pool.query<RowDataPacket[]>('SELECT status FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) throw new Error('ORDER_NOT_FOUND');

    const currentStatus = orders[0].status;
    const allowed = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
        throw new Error(`INVALID_TRANSITION:${currentStatus}→${newStatus}`);
    }

    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [newStatus, id]);
    return true;
}

export async function getDashboardStats() {
    const [[totalProducts]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM products') as any;
    const [[activeProducts]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM products WHERE status = 'active'") as any;
    const [[totalCustomers]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM customers') as any;
    const [[totalOrders]] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) AS count FROM orders') as any;
    const [[pendingOrders]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM orders WHERE status = 'PENDING'") as any;
    const [[successfulPayments]] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) AS count FROM payments WHERE payment_status = 'SUCCESS'") as any;
    const [[revenue]] = await pool.query<RowDataPacket[]>("SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE payment_status = 'SUCCESS'") as any;

    return {
        total_products: totalProducts.count,
        active_products: activeProducts.count,
        total_customers: totalCustomers.count,
        total_orders: totalOrders.count,
        pending_orders: pendingOrders.count,
        successful_payments: successfulPayments.count,
        total_revenue: Number(revenue.total),
    };
}
