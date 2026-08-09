import { pool } from './config/db.js';

async function migrate() {
    const conn = await pool.getConnection();
    try {
        console.log('Running Phase 6 migrations...');

        // Add discount + shipping snapshot columns to orders
        const ordersAlters = [
            "ALTER TABLE orders ADD COLUMN discount DECIMAL(10,2) NOT NULL DEFAULT 0.00",
            "ALTER TABLE orders ADD COLUMN shipping_name VARCHAR(255)",
            "ALTER TABLE orders ADD COLUMN shipping_phone VARCHAR(50)",
            "ALTER TABLE orders ADD COLUMN shipping_address VARCHAR(500)",
            "ALTER TABLE orders ADD COLUMN shipping_city VARCHAR(100)",
            "ALTER TABLE orders ADD COLUMN shipping_state VARCHAR(100)",
            "ALTER TABLE orders ADD COLUMN shipping_pincode VARCHAR(20)",
            "ALTER TABLE orders ADD COLUMN shipping_country VARCHAR(100)",
        ];

        for (const sql of ordersAlters) {
            try {
                await conn.query(sql);
                console.log('OK:', sql.substring(0, 60));
            } catch (e: any) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log('Already exists, skipping:', sql.substring(0, 60));
                } else {
                    console.error('Error:', e.message);
                }
            }
        }

        // Add indexes (ignore if already exist)
        const indexes = [
            "CREATE INDEX idx_orders_customer_id ON orders(customer_id)",
            "CREATE INDEX idx_orders_status ON orders(status)",
            "CREATE INDEX idx_orders_placed_at ON orders(placed_at)",
            "CREATE INDEX idx_order_items_order_id ON order_items(order_id)",
            "CREATE INDEX idx_order_items_product_id ON order_items(product_id)",
            "CREATE INDEX idx_addresses_customer_id ON addresses(customer_id)",
        ];

        for (const sql of indexes) {
            try {
                await conn.query(sql);
                console.log('OK:', sql.substring(0, 60));
            } catch (e: any) {
                if (e.code === 'ER_DUP_KEYNAME') {
                    console.log('Index already exists, skipping');
                } else {
                    console.error('Error:', e.message);
                }
            }
        }

        console.log('Phase 6 migration complete.');
    } finally {
        conn.release();
        process.exit(0);
    }
}

migrate();
