import pool from '../../../lib/db';

export async function GET(req) {
  try {
    const diagnostics = {
      envPresent: {
        DB_HOST: Boolean(process.env.DB_HOST),
        DB_USER: Boolean(process.env.DB_USER),
        DB_PASSWORD: Boolean(process.env.DB_PASSWORD),
        DB_NAME: Boolean(process.env.DB_NAME),
        DB_PORT: Boolean(process.env.DB_PORT),
        JWT_SECRET: Boolean(process.env.JWT_SECRET),
        NODE_ENV: Boolean(process.env.NODE_ENV),
      },
      envValues: {
        DB_HOST: process.env.DB_HOST || null,
        DB_USER: process.env.DB_USER || null,
        DB_NAME: process.env.DB_NAME || null,
        DB_PORT: process.env.DB_PORT || null,
        NODE_ENV: process.env.NODE_ENV || null,
      },
    };

    const [rows] = await pool.query('SELECT 1 as ok');
    return new Response(
      JSON.stringify({ ok: true, db: rows?.[0] ?? null, diagnostics }),
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Database error',
        message: err?.message || String(err),
        code: err?.code || null,
      }),
      { status: 500 }
    );
  }
}
