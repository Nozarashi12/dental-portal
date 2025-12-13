import pool from '@/lib/db'

export async function PUT(req: Request, { params }: any) {
  const body = await req.json()

  await pool.query(
    `UPDATE classrooms
     SET title=?, speaker=?, description=?, author_description=?, course_id=?
     WHERE id=?`,
    [
      body.title,
      body.speaker,
      body.description,
      body.author_description,
      body.course_id,
      params.id,
    ]
  )

  return new Response('Updated', { status: 200 })
}

export async function DELETE(req: Request, { params }: any) {
  await pool.query(`DELETE FROM classrooms WHERE id=?`, [params.id])
  return new Response('Deleted', { status: 200 })
}
