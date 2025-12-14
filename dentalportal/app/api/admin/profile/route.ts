import pool from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  const [rows]: any = await pool.query(
    `SELECT id, name, email FROM users WHERE role='admin' LIMIT 1`
  )
  return Response.json(rows[0])
}

export async function PUT(req: Request) {
  const body = await req.json()
  const { name, password } = body

  if (password) {
    const hashed = await bcrypt.hash(password, 10)
    await pool.query(
      `UPDATE users SET name=?, password=? WHERE role='admin'`,
      [name, hashed]
    )
  } else {
    await pool.query(
      `UPDATE users SET name=? WHERE role='admin'`,
      [name]
    )
  }

  return new Response('Profile Updated', { status: 200 })
}
