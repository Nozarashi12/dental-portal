import dotenv from 'dotenv';
dotenv.config();

import pool from './lib/db.js';

async function test() {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    console.log('Tables:', rows);
  } catch (err) {
    console.error('DB connection error:', err);
  }
}

test();
