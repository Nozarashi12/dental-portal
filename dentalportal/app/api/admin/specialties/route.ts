import pool from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM specialties ORDER BY name');
    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
