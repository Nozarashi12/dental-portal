import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/db'

type Params = {
  params: Promise<{ courseId: string }>
}

export async function GET(
  request: NextRequest,
  { params }: Params
) {
  try {
    const { courseId } = await params;
    
    // Validate courseId
    if (!courseId || isNaN(parseInt(courseId))) {
      return NextResponse.json(
        { error: 'Invalid course ID' },
        { status: 400 }
      )
    }

    const [rows]: any[] = await pool.query(
      `SELECT 
        c.*,
        co.title AS course_title
      FROM classrooms c
      JOIN courses co ON c.course_id = co.id
      WHERE c.course_id = ?
      ORDER BY c.created_at ASC`,
      [parseInt(courseId)]
    )

    return NextResponse.json(rows)
  } catch (err: any) {
    console.error('Error fetching classrooms by course:', err)
    return NextResponse.json(
      { error: 'Failed to fetch classrooms', details: err.message },
      { status: 500 }
    )
  }
}