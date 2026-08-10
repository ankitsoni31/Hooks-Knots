import mysql from 'mysql2/promise';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

async function run() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });
    
    const dbName = process.env.DB_NAME || 'hooks_knots';
    console.log('Creating database ' + dbName);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);
    
    console.log('Loading schema.sql...');
    const schema = await fs.readFile('../database/schema.sql', 'utf8');
    await connection.query(schema);
    
    console.log('Loading seed.sql...');
    const seed = await fs.readFile('../database/seed.sql', 'utf8');
    await connection.query(seed);
    
    console.log('Loading migrate_phase6.sql...');
    const migrate = await fs.readFile('../database/migrate_phase6.sql', 'utf8');
    await connection.query(migrate);

    console.log('Database initialized successfully.');
    await connection.end();
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

run();
