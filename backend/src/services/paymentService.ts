import Razorpay from 'razorpay';
import crypto from 'crypto';
import { pool } from '../config/db.js';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { RAZORPAY_CONFIG } from '../config/config.js';

// Lazily create Razorpay instance so missing credentials don't crash startup
let _rzp: Razorpay | null = null;
function getRazorpay(): Razorpay {
    if (!_rzp) {
        if (!RAZORPAY_CONFIG.keyId || !RAZORPAY_CONFIG.keySecret) {
            throw new Error('RAZORPAY_CONFIG_MISSING');
        }
        _rzp = new Razorpay({ key_id: RAZORPAY_CONFIG.keyId, key_secret: RAZORPAY_CONFIG.keySecret });
    }
    return _rzp;
}

// ─── Create Razorpay order + payment record ───────────────────────────────────
export async function createRazorpayOrder(params: {
    orderId: number;
    customerId: number;
    amount: number;     // in INR (e.g. 1299.00)
    currency: string;
    receipt: string;    // order_number
}): Promise<{ razorpayOrderId: string; amount: number; currency: string }> {
    const rzp = getRazorpay();
    // Razorpay requires amount in smallest unit (paise for INR)
    const amountPaise = Math.round(params.amount * 100);

    console.log(`[Payment] Creating Razorpay order for local order #${params.receipt}, amount: ₹${params.amount}`);

    const rzpOrder = await rzp.orders.create({
        amount: amountPaise,
        currency: params.currency,
        receipt: params.receipt,
    });

    // Insert payment record in CREATED state
    await pool.query<ResultSetHeader>(`
        INSERT INTO payments (order_id, customer_id, razorpay_order_id, amount, currency, payment_status)
        VALUES (?, ?, ?, ?, ?, 'CREATED')
    `, [params.orderId, params.customerId, rzpOrder.id, params.amount, params.currency]);

    console.log(`[Payment] Razorpay order created: ${rzpOrder.id}`);
    return { razorpayOrderId: rzpOrder.id as string, amount: amountPaise, currency: params.currency };
}

// ─── Verify payment signature and confirm order ───────────────────────────────
export async function verifyAndConfirmPayment(params: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}): Promise<{ alreadyConfirmed: boolean; orderNumber: string }> {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = params;

    // 1. Verify HMAC signature (key_secret stays server-side only)
    const expectedSignature = crypto
        .createHmac('sha256', RAZORPAY_CONFIG.keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

    if (expectedSignature !== razorpay_signature) {
        console.error(`[Payment] Signature mismatch for ${razorpay_order_id}`);
        throw new Error('SIGNATURE_MISMATCH');
    }

    // 2. Find local payment record by razorpay_order_id
    const [payments] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM payments WHERE razorpay_order_id = ?', [razorpay_order_id]
    );
    if (payments.length === 0) throw new Error('PAYMENT_NOT_FOUND');
    const payment = payments[0];

    // 3. Idempotency: if already confirmed, return existing success
    if (payment.payment_status === 'SUCCESS') {
        console.log(`[Payment] Already confirmed: ${razorpay_order_id}, skipping`);
        const [orders] = await pool.query<RowDataPacket[]>('SELECT order_number FROM orders WHERE id = ?', [payment.order_id]);
        return { alreadyConfirmed: true, orderNumber: orders[0]?.order_number || '' };
    }

    // 4. Execute confirmation + stock deduction in a transaction
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        // Update payment record
        await conn.query(`
            UPDATE payments SET
                razorpay_payment_id = ?,
                razorpay_signature = ?,
                payment_status = 'SUCCESS',
                paid_at = NOW()
            WHERE id = ?
        `, [razorpay_payment_id, razorpay_signature, payment.id]);

        // Confirm order
        await conn.query(
            "UPDATE orders SET status = 'CONFIRMED' WHERE id = ? AND status = 'PENDING'",
            [payment.order_id]
        );

        // Deduct stock safely (no negative stock)
        const [items] = await conn.query<RowDataPacket[]>(
            'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
            [payment.order_id]
        );
        for (const item of items) {
            const [result] = await conn.query<ResultSetHeader>(
                'UPDATE products SET stock = stock - ? WHERE id = ? AND stock >= ?',
                [item.quantity, item.product_id, item.quantity]
            );
            if (result.affectedRows === 0) {
                // Stock went to zero between order and payment — log but don't fail
                // Business decision: confirm order anyway, admin must restock
                console.warn(`[Payment] Low stock on product ${item.product_id} at confirmation time`);
            }
        }

        await conn.commit();

        const [orders] = await pool.query<RowDataPacket[]>('SELECT order_number FROM orders WHERE id = ?', [payment.order_id]);
        const orderNumber = orders[0]?.order_number || '';
        console.log(`[Payment] Confirmed order ${orderNumber}`);
        return { alreadyConfirmed: false, orderNumber };
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}

// ─── Webhook handler ──────────────────────────────────────────────────────────
export async function handleWebhookEvent(rawBody: Buffer, signature: string): Promise<void> {
    // Verify webhook signature
    const expectedSig = crypto
        .createHmac('sha256', RAZORPAY_CONFIG.webhookSecret)
        .update(rawBody)
        .digest('hex');

    if (expectedSig !== signature) {
        console.error('[Webhook] Invalid signature');
        throw new Error('INVALID_WEBHOOK_SIGNATURE');
    }

    const event = JSON.parse(rawBody.toString());
    const eventName: string = event.event;
    console.log(`[Webhook] Received event: ${eventName}`);

    if (eventName === 'payment.captured') {
        const paymentObj = event.payload?.payment?.entity;
        if (!paymentObj) return;

        const rzpOrderId: string = paymentObj.order_id;
        const rzpPaymentId: string = paymentObj.id;

        // Idempotency: check if already processed
        const [existing] = await pool.query<RowDataPacket[]>(
            "SELECT id, payment_status FROM payments WHERE razorpay_order_id = ?", [rzpOrderId]
        );
        if (existing.length === 0) return;
        if (existing[0].payment_status === 'SUCCESS') {
            console.log(`[Webhook] Already processed, skipping: ${rzpOrderId}`);
            return;
        }

        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();
            await conn.query(`
                UPDATE payments SET
                    razorpay_payment_id = ?,
                    payment_method = ?,
                    payment_status = 'SUCCESS',
                    paid_at = NOW()
                WHERE razorpay_order_id = ?
            `, [rzpPaymentId, paymentObj.method || null, rzpOrderId]);

            const payment = existing[0];
            await conn.query(
                "UPDATE orders SET status = 'CONFIRMED' WHERE id = ? AND status = 'PENDING'",
                [payment.order_id]
            );

            const [items] = await conn.query<RowDataPacket[]>(
                'SELECT product_id, quantity FROM order_items WHERE order_id = ?', [payment.order_id]
            );
            for (const item of items) {
                await conn.query(
                    'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
                    [item.quantity, item.product_id]
                );
            }

            await conn.commit();
            console.log(`[Webhook] payment.captured processed for ${rzpOrderId}`);
        } catch (e) {
            await conn.rollback();
            throw e;
        } finally {
            conn.release();
        }
    } else if (eventName === 'payment.failed') {
        const paymentObj = event.payload?.payment?.entity;
        if (!paymentObj) return;
        await pool.query(
            "UPDATE payments SET payment_status = 'FAILED' WHERE razorpay_order_id = ?",
            [paymentObj.order_id]
        );
        console.log(`[Webhook] payment.failed recorded for ${paymentObj.order_id}`);
    }
}

// ─── Admin list/detail ────────────────────────────────────────────────────────
export async function listPayments(options: { page: number; limit: number; search?: string; status?: string }) {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const offset = (page - 1) * limit;

    let conditions = '1=1';
    const params: any[] = [];
    const countParams: any[] = [];

    if (options.search) {
        const like = `%${options.search}%`;
        conditions += ` AND (p.razorpay_order_id LIKE ? OR p.razorpay_payment_id LIKE ? OR o.order_number LIKE ? OR CONCAT(c.first_name,' ',c.last_name) LIKE ?)`;
        params.push(like, like, like, like);
        countParams.push(like, like, like, like);
    }
    if (options.status) {
        conditions += ' AND p.payment_status = ?';
        params.push(options.status);
        countParams.push(options.status);
    }

    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT p.*, o.order_number, c.first_name, c.last_name, c.email
        FROM payments p
        JOIN orders o ON o.id = p.order_id
        JOIN customers c ON c.id = p.customer_id
        WHERE ${conditions}
        ORDER BY p.created_at DESC
        LIMIT ? OFFSET ?
    `, params);

    const [countResult] = await pool.query<RowDataPacket[]>(`
        SELECT COUNT(*) AS total FROM payments p
        JOIN orders o ON o.id = p.order_id
        JOIN customers c ON c.id = p.customer_id
        WHERE ${conditions}
    `, countParams);

    const total = countResult[0].total as number;
    return { items: rows, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } };
}

export async function getPaymentById(id: number) {
    const [rows] = await pool.query<RowDataPacket[]>(`
        SELECT p.*, o.order_number, c.first_name, c.last_name, c.email
        FROM payments p
        JOIN orders o ON o.id = p.order_id
        JOIN customers c ON c.id = p.customer_id
        WHERE p.id = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
}

export async function getPaymentByOrderId(orderId: number) {
    const [rows] = await pool.query<RowDataPacket[]>(
        'SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC LIMIT 1', [orderId]
    );
    return rows.length > 0 ? rows[0] : null;
}
