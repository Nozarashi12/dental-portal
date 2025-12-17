// File: /app/api/admin/statistics/route.ts
import { NextResponse } from 'next/server'
import pool from '@/lib/db'

export async function GET() {
  try {
    // Aggregate statistics
    const [statsResult]: any = await pool.query(`
      SELECT 
        -- Total courses
        (SELECT COUNT(*) FROM courses) AS totalCourses,

        -- Unique categories
        (SELECT COUNT(DISTINCT category) FROM courses WHERE category != '') AS totalCategories,

        -- Unique authors
        (SELECT COUNT(DISTINCT author) FROM courses WHERE author != '') AS totalAuthors,

        -- Total classrooms
        (SELECT COUNT(*) FROM classrooms) AS totalClassrooms,

        -- Courses that have at least one classroom
        (SELECT COUNT(DISTINCT course_id) FROM classrooms) AS coursesWithClassrooms
    `)

    const stats = statsResult[0] || {}

    return NextResponse.json({
      totalCourses: stats.totalCourses || 0,
      totalCategories: stats.totalCategories || 0,
      totalAuthors: stats.totalAuthors || 0,
      totalClassrooms: stats.totalClassrooms || 0,
      coursesWithClassrooms: stats.coursesWithClassrooms || 0,
      lastUpdated: new Date().toISOString(),
    })

  } catch (err: any) {
    console.error('Statistics API error:', err)
    return NextResponse.json(
      {
        totalCourses: 0,
        totalCategories: 0,
        totalAuthors: 0,
        totalClassrooms: 0,
        coursesWithClassrooms: 0,
        lastUpdated: new Date().toISOString(),
        error: 'Failed to fetch statistics'
      },
      { status: 500 }
    )
  }
}
