import pool from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    
    if (!query.trim()) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const [rows] = await pool.query(`
      SELECT 
        c.id, 
        c.title, 
        c.author, 
        c.cover_image,
        c.category,
        c.overview,
        s.name AS specialty_name
      FROM courses c
      LEFT JOIN specialties s ON c.specialty_id = s.id
      WHERE 
        c.title LIKE ? OR 
        c.author LIKE ? OR 
        c.category LIKE ? OR
        c.overview LIKE ? OR
        c.description LIKE ? OR
        s.name LIKE ?
      ORDER BY c.id DESC
      LIMIT 10
    `, [
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
      `%${query}%`,
    ]);

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}