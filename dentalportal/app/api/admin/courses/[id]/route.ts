import pool from '@/lib/db'

type Params = {
  params: Promise<{ id: string }>
}

export async function DELETE(req: Request, { params }: Params) {
  const { id } = await params   // ✅ FIX

  await pool.query(
    'DELETE FROM courses WHERE id = ?',
    [id]
  )

  return Response.json({ success: true })
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params   // ✅ FIX
  const body = await req.json()

  await pool.query(
    `UPDATE courses SET
      title = ?,
      author = ?,
      author_description = ?,
      cover_image = ?,
      overview = ?,
      description = ?,
      category = ?,
      specialty_id = ?
     WHERE id = ?`,
    [
      body.title,
      body.author,
      body.author_description,
      body.cover_image,
      body.overview,
      body.description,
      body.category,
      body.specialty_id || null,
      id,
    ]
  )

  return Response.json({ success: true })
}
