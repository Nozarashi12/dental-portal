import pool from '@/lib/db'

export async function POST(req: Request) {
  const body = await req.json()

  await pool.query(
    `INSERT INTO classrooms (title, speaker, description, author_description, course_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      body.title,
      body.speaker,
      body.description,
      body.author_description,
      body.course_id,
    ]
  )

  return new Response('Created', { status: 201 })
}
