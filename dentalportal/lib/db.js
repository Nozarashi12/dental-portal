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
  return missing;
}

loadEnvIfMissing();

const missingEnv = assertRequiredEnv();

const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306;
const resolvedPort = Number.isFinite(port) ? port : 3306;

const pool =
  missingEnv.length > 0
    ? {
        query: async () => {
          throw new Error(
            `Missing required environment variables: ${missingEnv.join(', ')}`
          );
        },
      }
    : mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: resolvedPort,
      });

export default pool;
