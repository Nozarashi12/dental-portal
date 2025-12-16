import pool from '@/lib/db'

export async function PUT(req: Request, { params }: { params: any }) {
  const resolvedParams = await params
  const { id } = resolvedParams

  const body = await req.json()

  // Convert datetime-local strings to MySQL DATETIME format
  const formatDateTime = (dt: string | null) => {
    if (!dt) return null
    const d = new Date(dt)
    return d.toISOString().slice(0, 19).replace('T', ' ')
  }

  await pool.query(
    `UPDATE classrooms
     SET title=?,
         speaker=?,
         description=?,
         author_description=?,
         course_id=?,
         video_url=?,
         learning_objectives=?,
         published_date=?,
         expiration_date=?,
         discussion_enabled=?,
         google_classroom_link=?,
         assessment_link=?
     WHERE id=?`,
    [
      body.title,
      body.speaker,
      body.description,
      body.author_description,
      body.course_id,
      body.video_url,
      body.learning_objectives,
      formatDateTime(body.published_date),
      formatDateTime(body.expiration_date),
      body.discussion_enabled ? 1 : 0,
      body.discussion_enabled ? body.google_classroom_link : null,
      body.assessment_link,
      id,
    ]
  )

  return new Response('Updated', { status: 200 })
}
