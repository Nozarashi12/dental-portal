import { NextRequest, NextResponse } from 'next/server'
import db from '@/lib/db'
import { requireUser } from '@/lib/auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const user = await requireUser(req)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Await the params Promise
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

    // Check existing certificate
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
       WHERE c.user_id = ? AND c.course_id = ?`,
      [user.id, courseId]
    )

    if (certificateRows.length === 0) {
      // Create a pending certificate if it doesn't exist
      await db.query(
        `INSERT INTO certificates (user_id, course_id, status) 
         VALUES (?, ?, 'pending')`,
        [user.id, courseId]
      )

      return NextResponse.json({
        id: null,
        status: 'pending',
        username: user.name,
        email: user.email,
        course_title: courseRows[0].title,
        issued_at: null,
        message: 'Certificate request created (pending admin approval)'
      })
    }

    // Return existing certificate
    const certificate = certificateRows[0]
    return NextResponse.json({
      ...certificate,
      message: certificate.status === 'approved' 
        ? 'Certificate is ready' 
        : 'Certificate is pending approval'
    })
  } catch (err: any) {
    console.error('Certificate API error:', err)
    
    if (err.message === 'Unauthorized') {
      return NextResponse.json(
        { message: 'Please log in to view certificates' },
        { status: 401 }
      )
    }
    
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
    const user = await requireUser(req)
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Await the params Promise
    const { courseId } = await params
    
    const body = await req.json()
    const { action } = body

    if (action === 'download') {
      // Check if certificate exists and is approved
      const [certRows]: any = await db.query(
        `SELECT c.*, u.name, u.email, co.title 
         FROM certificates c
         JOIN users u ON u.id = c.user_id
         JOIN courses co ON co.id = c.course_id
         WHERE c.user_id = ? AND c.course_id = ? AND c.status = 'approved'`,
        [user.id, courseId]
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
          filename: `Certificate_${certRows[0].name}_${certRows[0].title.replace(/\s+/g, '_')}.pdf`
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