import { pool } from './config/db.js';

async function migrate() {
    const conn = await pool.getConnection();
    try {
        console.log('Running Coupons migration...');

        const creates = [
            `CREATE TABLE IF NOT EXISTS coupons (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(50) NOT NULL UNIQUE,
                discount_type VARCHAR(50) NOT NULL DEFAULT 'PERCENTAGE',
                discount_value DECIMAL(10,2) NOT NULL,
                min_order_amount DECIMAL(10,2),
                max_discount_amount DECIMAL(10,2),
                usage_limit INT,
                used_count INT NOT NULL DEFAULT 0,
                expires_at TIMESTAMP NULL,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );`
        ];

        for (const sql of creates) {
            try {
                await conn.query(sql);
                console.log('OK: CREATE coupons table');
            } catch (e: any) {
                console.error('Error creating table:', e.message);
            }
        }

        const alters = [
            "ALTER TABLE orders ADD COLUMN coupon_id INT NULL",
            "ALTER TABLE orders ADD CONSTRAINT fk_orders_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON UPDATE CASCADE ON DELETE SET NULL"
        ];

        for (const sql of alters) {
            try {
                await conn.query(sql);
                console.log('OK:', sql.substring(0, 60));
            } catch (e: any) {
                if (e.code === 'ER_DUP_FIELDNAME' || e.code === 'ER_CANT_CREATE_TABLE' || e.message.includes('Duplicate')) {
                    console.log('Already exists, skipping:', sql.substring(0, 60));
                } else {
                    console.error('Error:', e.message);
                }
            }
        }

        console.log('Coupons migration complete.');
    } finally {
        conn.release();
        process.exit(0);
    }
}

migrate();
