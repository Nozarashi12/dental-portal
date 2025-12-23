import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

export async function GET(req: Request) {
  try {

    console.warn('⚠️ DEVELOPMENT MODE: Skipping authentication for certificates API')
    
    const [rows]: any = await pool.query(
      `SELECT
        c.id,
        c.user_id,
        c.course_id,
        u.name AS username,
        u.email,
        co.title AS course_title,
        c.status,
        c.issued_at
       FROM certificates c
       JOIN users u ON u.id = c.user_id
       JOIN courses co ON co.id = c.course_id
       ORDER BY c.id DESC`
    )

    return NextResponse.json({
      warning: 'Development mode: No authentication',
      data: rows
    })
  } catch (err: any) {
    console.error('Error fetching certificates:', err)
    // Don't return 401 in development
    return NextResponse.json(
      { 
        message: 'Development error',
        error: err.message 
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    // DEVELOPMENT ONLY: Skip auth check
    // await requireAdmin(req)
    
    console.warn('⚠️ DEVELOPMENT MODE: Skipping authentication for certificates API')
    
    const body = await req.json()
    const { user_id, course_id, status = 'approved' } = body

    if (!user_id || !course_id) {
      return NextResponse.json(
        { message: 'Missing user_id or course_id' },
        { status: 400 }
      )
    }

    // Validate user exists
    const [userRows]: any = await pool.query(
      'SELECT id, name FROM users WHERE id = ?',
      [user_id]
    )
    if (userRows.length === 0) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    // Validate course exists
    const [courseRows]: any = await pool.query(
      'SELECT id, title FROM courses WHERE id = ?',
      [course_id]
    )
    if (courseRows.length === 0) {
      return NextResponse.json(
        { message: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if certificate already exists
    const [existing]: any = await pool.query(
      `SELECT id FROM certificates 
       WHERE user_id = ? AND course_id = ?`,
      [user_id, course_id]
    )

    if (existing.length > 0) {
      return NextResponse.json(
        { message: 'Certificate already exists for this user and course' },
        { status: 409 }
      )
    }

    // Insert new certificate
    const [result]: any = await pool.query(
      `INSERT INTO certificates 
       (user_id, course_id, status, issued_at)
       VALUES (?, ?, ?, NOW())`,
      [user_id, course_id, status]
    )

    return NextResponse.json({
      warning: 'Development mode: Created without authentication',
      success: true,
      message: 'Certificate created successfully',
      id: result.insertId,
      username: userRows[0].name,
      course_title: courseRows[0].title
    })
  } catch (err: any) {
    console.error('Error creating certificate:', err)
    return NextResponse.json(
      { 
        message: 'Development error',
        error: err.message 
      },
      { status: 500 }
    )
  }
}