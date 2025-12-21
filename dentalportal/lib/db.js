import mysql from 'mysql2/promise';

// Hardcoded database configuration
const pool = mysql.createPool({
  host: 'srv1130.hstgr.io',
  user: 'u198044505_adithyan',
  password: 'SImplePass123',
  database: 'u198044505_dental_portal',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;