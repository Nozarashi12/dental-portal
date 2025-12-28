import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? 'srv1130.hstgr.io',
  user: process.env.DB_USER ?? 'u198044505_adithyan',
  password: process.env.DB_PASSWORD ?? 'SImplePass123',
  database: process.env.DB_NAME ?? 'u198044505_dental_portal',
  port: Number(process.env.DB_PORT ?? 3306),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
  queueLimit: 0,
})

export default pool
