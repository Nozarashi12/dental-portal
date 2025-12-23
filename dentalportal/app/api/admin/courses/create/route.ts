import pool from '@/lib/db';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      title,
      author,
      author_description,
      cover_image,
      overview,
      description,
      category,
      specialty_id,
    } = body;

    await pool.query(
      `INSERT INTO courses 
      (title, author, author_description, cover_image, overview, description, category, specialty_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        author,
        author_description,
        cover_image,
        overview,
        description,
        category,
        specialty_id,
      ]
    );

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err: any) {
    console.error(err);
    return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
  }
}
