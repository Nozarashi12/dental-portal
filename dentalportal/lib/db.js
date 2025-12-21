import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

const requiredDbEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

function loadEnvIfMissing() {
  const isMissing = requiredDbEnvVars.some((k) => !process.env[k]);
  if (!isMissing) return;

  dotenv.config({ path: '.env.local' });
  dotenv.config({ path: '.env' });
}

function assertRequiredEnv() {
  const missing = requiredDbEnvVars.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}

loadEnvIfMissing();
assertRequiredEnv();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
});

export default pool;
