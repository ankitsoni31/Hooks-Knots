import { pool } from './config/db.js';

async function migrate() {
    try {
        console.log('Adding OTP verification columns to customers table...');
        const conn = await pool.getConnection();

        await conn.query(`
            ALTER TABLE customers
            ADD COLUMN is_verified BOOLEAN NOT NULL DEFAULT FALSE,
            ADD COLUMN otp_hash VARCHAR(255) NULL,
            ADD COLUMN otp_expires_at TIMESTAMP NULL,
            ADD COLUMN otp_attempts INT NOT NULL DEFAULT 0,
            ADD COLUMN last_otp_sent_at TIMESTAMP NULL;
        `);

        // Update existing customers to be verified so we don't break existing accounts
        await conn.query(`UPDATE customers SET is_verified = TRUE WHERE is_verified = FALSE;`);

        conn.release();
        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
