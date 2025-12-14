import pool from '@/lib/db'

type Params = {
  params: Promise<{ id: string }>
}

// Add GET method to fetch single course
export async function GET(req: Request, { params }: Params) {
  try {
    const { id } = await params
    
    const [rows]: any[] = await pool.query(
      `SELECT 
        c.*,
        s.name AS specialty_name,
        (SELECT COUNT(*) FROM classrooms WHERE course_id = c.id) as classroom_count
      FROM courses c
      LEFT JOIN specialties s ON c.specialty_id = s.id
      WHERE c.id = ?`,
      [id]
    )

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Course not found' }),
        { status: 404 }
      )
    }

    return new Response(JSON.stringify(rows[0]), { status: 200 })
  } catch (err: any) {
    console.error('Error fetching course:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch course', details: err.message }),
      { status: 500 }
    )
  }
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