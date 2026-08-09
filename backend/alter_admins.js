import { pool } from './dist/config/db.js';

async function alterTable() {
    try {
        const conn = await pool.getConnection();
        
        try {
            console.log('Adding theme column...');
            await conn.query("ALTER TABLE admins ADD COLUMN theme VARCHAR(20) DEFAULT 'system'");
        } catch(e) {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
        }

        try {
            console.log('Adding notifications_enabled column...');
            await conn.query("ALTER TABLE admins ADD COLUMN notifications_enabled BOOLEAN DEFAULT TRUE");
        } catch(e) {
            if (e.code !== 'ER_DUP_FIELDNAME') throw e;
        }

        conn.release();
        console.log('Database altered successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error altering table:', err);
        process.exit(1);
    }
}

alterTable();
