import { pool } from './config/db.js';
import bcrypt from 'bcrypt';

async function seedAdmin() {
    try {
        console.log('Seeding admin credentials...');
        const conn = await pool.getConnection();

        // Create table if not exists
        await conn.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                password_hash VARCHAR(255) NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                role VARCHAR(50) NOT NULL DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            );
        `);

        const hash = await bcrypt.hash('admin123', 10);

        // Insert or update admin accounts
        const emails = ['admin@hooks-knots.com', 'admin@example.com', 'admin@hooks.com'];
        for (const email of emails) {
            await conn.query(
                `INSERT INTO admins (email, password_hash, first_name, last_name, role)
                 VALUES (?, ?, 'Admin', 'User', 'admin')
                 ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash)`,
                [email, hash]
            );
            console.log(`Admin user configured: Email: ${email} | Password: admin123`);
        }

        conn.release();
        console.log('Admin seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding admin credentials:', err);
        process.exit(1);
    }
}

seedAdmin();
