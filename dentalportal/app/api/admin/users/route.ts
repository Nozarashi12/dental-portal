// app/api/admin/users/route.ts
import pool from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  const [rows]: any = await pool.query(
    'SELECT id, name, email, role, created_at FROM users'
  )

  return Response.json(rows)
}
