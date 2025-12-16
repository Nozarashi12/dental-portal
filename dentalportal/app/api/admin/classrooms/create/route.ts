import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      title,
      speaker,
      description,
      author_description,
      course_id,
      video_url,
      learning_objectives,
      published_date,
      expiration_date,
      discussion_enabled,
      assessment_link,
      google_classroom_link, // ✅ ADDED
    } = body

    await pool.query(
      `INSERT INTO classrooms (
        course_id,
        title,
        video_url,
        description,
        learning_objectives,
        speaker,
        author_description,
        published_date,
        expiration_date,
        discussion_enabled,
        google_classroom_link,
        assessment_link
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        course_id,
        title,
        video_url,
        description,
        learning_objectives,
        speaker,
        author_description,
        published_date,
        expiration_date || null,
        discussion_enabled ?? 1,
        discussion_enabled ? google_classroom_link : null,
        assessment_link || null,
      ]
    )

    return new Response(JSON.stringify({ success: true }), { status: 201 })
  } catch (err: any) {
    console.error('CREATE CLASSROOM ERROR:', err)
    return new Response(
      JSON.stringify({ success: false, message: err.message }),
      { status: 500 }
    )
  }
}
