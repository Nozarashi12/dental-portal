import pool from '@/lib/db'

export async function GET() {
  const [rows] = await pool.query(
    `SELECT c.*, co.title AS course_title
     FROM classrooms c
     JOIN courses co ON c.course_id = co.id
     ORDER BY c.created_at DESC`
  )

  return Response.json(rows)
}
