import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    // Await the params Promise (KEEPING SAME STYLE)
    const { courseId } = await params

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID required' },
        { status: 400 }
      )
    }

    // Check if course exists
    const [courseRows]: any = await db.query(
      'SELECT id, title FROM courses WHERE id = ?',
      [courseId]
    )

    if (courseRows.length === 0) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      )
    }

    // Fetch certificate (no user dependency)
    const [certificateRows]: any = await db.query(
      `SELECT 
         c.id,
         c.status,
         c.issued_at,
         u.name AS username,
         u.email,
         co.title AS course_title
       FROM certificates c
       JOIN users u ON u.id = c.user_id
       JOIN courses co ON co.id = c.course_id
       WHERE c.course_id = ?
       ORDER BY c.id DESC
       LIMIT 1`,
      [courseId]
    )

    if (certificateRows.length === 0) {
      return NextResponse.json({
        id: null,
        status: 'pending',
        username: null,
        email: null,
        course_title: courseRows[0].title,
        issued_at: null,
        message: 'No certificate created yet'
      })
    }

    const certificate = certificateRows[0]

    return NextResponse.json({
      ...certificate,
      message:
        certificate.status === 'approved'
          ? 'Certificate is ready'
          : 'Certificate is pending approval'
    })
  } catch (err) {
    console.error('Certificate API error:', err)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params

    if (!courseId) {
      return NextResponse.json(
        { message: 'Course ID required' },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { action } = body

    if (action === 'download') {
      const [certRows]: any = await db.query(
        `SELECT 
           c.*,
           u.name,
           u.email,
           co.title
         FROM certificates c
         JOIN users u ON u.id = c.user_id
         JOIN courses co ON co.id = c.course_id
         WHERE c.course_id = ? AND c.status = 'approved'
         ORDER BY c.id DESC
         LIMIT 1`,
        [courseId]
      )

      if (certRows.length === 0) {
        return NextResponse.json(
          { message: 'Certificate not found or not approved' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        certificate: certRows[0],
        pdfData: {
          filename: `Certificate_${certRows[0].name}_${certRows[0].title.replace(
            /\s+/g,
            '_'
          )}.pdf`
        }
      })
    }

    return NextResponse.json(
      { message: 'Invalid action' },
      { status: 400 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}
