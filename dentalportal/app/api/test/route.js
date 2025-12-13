import pool from '../../../lib/db';

export async function GET(req) {
  try {
    const [rows] = await pool.query('SHOW TABLES');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
  }
}
