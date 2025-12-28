// import pool from '@/lib/db';

// export const dynamic = 'force-dynamic'
// export const revalidate = 0

// export async function GET() {
//   try {
//     const [rows] = await pool.query(`
//       SELECT c.id,c.cover_image,c.overview,c.created_at, c.title, c.author, c.category, s.name AS specialty_name
//       FROM courses c
//       LEFT JOIN specialties s ON c.specialty_id = s.id
//       ORDER BY c.id DESC
//     `);

//     return new Response(JSON.stringify(rows), { status: 200 });
//   } catch (err: any) {
//     console.error(err);
//     return new Response(JSON.stringify({ message: err.message }), { status: 500 });
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { title, author, author_description, cover_image, overview, description, category, specialty_id } = body;

//     await pool.query(
//     `INSERT INTO courses
//      (title, author, author_description, cover_image, overview, description, category, specialty_id)
//      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//     [
//       body.title,
//       body.author,
//       body.author_description,
//       body.cover_image,
//       body.overview,
//       body.description,
//       body.category,
//       body.specialty_id ? Number(body.specialty_id) : null, // ✅ FIX
//     ]
//   )
//     return new Response(JSON.stringify({ success: true }), { status: 201 });
//   } catch (err: any) {
//     console.error(err);
//     return new Response(JSON.stringify({ success: false, message: err.message }), { status: 500 });
//   }
// }


import pool from '@/lib/db';

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  // 🔴 ONE-TIME DEBUG
  console.log('DEBUG env on server:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  });

  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.cover_image,
        c.overview,
        c.created_at,
        c.title,
        c.author,
        c.category,
        s.name AS specialty_name
      FROM courses c
      LEFT JOIN specialties s ON c.specialty_id = s.id
      ORDER BY c.id DESC
    `);

    return new Response(JSON.stringify(rows), { status: 200 });

  } catch (error: any) {
    console.error('API error (/api/admin/courses GET):', error);

    return new Response(
      JSON.stringify({
        message: 'Internal error',
        error: String(error?.message || error),
      }),
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  // 🔴 ONE-TIME DEBUG
  console.log('DEBUG env on server:', {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
  });

  try {
    const body = await req.json();

    await pool.query(
      `INSERT INTO courses
       (title, author, author_description, cover_image, overview, description, category, specialty_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.title,
        body.author,
        body.author_description,
        body.cover_image,
        body.overview,
        body.description,
        body.category,
        body.specialty_id ? Number(body.specialty_id) : null,
      ]
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 201 }
    );

  } catch (error: any) {
    console.error('API error (/api/admin/courses POST):', error);

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Internal error',
        error: String(error?.message || error),
      }),
      { status: 500 }
    );
  }
}

