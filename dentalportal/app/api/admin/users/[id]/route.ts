import pool from '@/lib/db'

export async function DELETE(req: Request, context: any) {
  // unwrap params
  const { params } = context
  const resolvedParams = await params
  const { id } = resolvedParams

  if (!id) return new Response('Missing user ID', { status: 400 })

  try {
    await pool.query('DELETE FROM users WHERE id=?', [id])
    return new Response('Deleted', { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response('Failed to delete user', { status: 500 })
  }
}

export async function PUT(req: Request, context: any) {
  const { params } = context
  const resolvedParams = await params
  const { id } = resolvedParams

  const body = await req.json()

  if (!id) return new Response('Missing user ID', { status: 400 })

  try {
    await pool.query(
      'UPDATE users SET name=?, email=?, role=? WHERE id=?',
      [body.name, body.email, body.role, id]
    )
    return new Response('Updated', { status: 200 })
  } catch (err) {
    console.error(err)
    return new Response('Failed to update user', { status: 500 })
  }
}
