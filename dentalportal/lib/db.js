import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // should be 'localhost'
  user: process.env.DB_USER,       // 'lms_user'
  password: process.env.DB_PASSWORD, // 'StrongPassword123!'
  database: process.env.DB_NAME,     // 'lms_db'
  port: process.env.DB_PORT || 3306,
});

export default pool;
