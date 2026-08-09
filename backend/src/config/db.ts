import mysql from 'mysql2/promise';
import { DB_CONFIG } from './config.js';

export const pool = mysql.createPool({
    host: DB_CONFIG.host,
    port: DB_CONFIG.port,
    user: DB_CONFIG.user,
    password: DB_CONFIG.password,
    database: DB_CONFIG.database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
