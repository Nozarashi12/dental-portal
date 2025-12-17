import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET single certificate
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)
    const { id } = await params

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
       WHERE c.id = ?`,
      [id]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Certificate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: err.message || 'Unauthorized or error' },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// UPDATE certificate
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)
    const { id } = await params
    const body = await req.json()
    const { status, issued_at } = body

    if (!status || !['pending', 'approved'].includes(status)) {
      return NextResponse.json(
        { message: 'Valid status is required' },
        { status: 400 }
      )
    }

    // Check if certificate exists
    const [existing]: any = await pool.query(
      'SELECT * FROM certificates WHERE id = ?',
      [id]
    )

    if (existing.length === 0) {
      return NextResponse.json(
        { message: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Build update query
    let query = 'UPDATE certificates SET status = ?'
    const values: any[] = [status]
    
    // Handle issued_at
    if (status === 'approved') {
      let issuedAtValue: string | null = null
      
      if (issued_at) {
        // Format the date for MySQL (YYYY-MM-DD HH:MM:SS)
        const date = new Date(issued_at)
        if (isNaN(date.getTime())) {
          return NextResponse.json(
            { message: 'Invalid date format' },
            { status: 400 }
          )
        }
        issuedAtValue = date.toISOString().slice(0, 19).replace('T', ' ')
      } else if (!existing[0].issued_at) {
        // If no issued_at exists and no date provided, use current time
        issuedAtValue = new Date().toISOString().slice(0, 19).replace('T', ' ')
      } else {
        // Keep existing issued_at if it exists
        issuedAtValue = existing[0].issued_at
      }
      
      query += ', issued_at = ?'
      values.push(issuedAtValue)
    } else {
      // For pending status, set issued_at to NULL
      query += ', issued_at = NULL'
    }
    
    query += ' WHERE id = ?'
    values.push(id)

    await pool.query(query, values)

    return NextResponse.json({
      success: true,
      message: 'Certificate updated successfully'
    })
  } catch (err: any) {
    console.error('Error updating certificate:', err)
    
    // Handle MySQL specific errors
    if (err.code === 'ER_TRUNCATED_WRONG_VALUE') {
      return NextResponse.json(
        { 
          message: 'Invalid date format. Please use ISO format (YYYY-MM-DDTHH:MM:SS.SSSZ)',
          error: err.message
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        message: err.message || 'Server error',
        error: err.message,
        code: err.code
      },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}

// DELETE certificate
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req)
    const { id } = await params

    // Check if certificate exists
    const [existing]: any = await pool.query(
      'SELECT * FROM certificates WHERE id = ?',
      [id]
    )

    if (existing.length === 0) {
      return NextResponse.json(
        { message: 'Certificate not found' },
        { status: 404 }
      )
    }

    // Delete certificate
    await pool.query('DELETE FROM certificates WHERE id = ?', [id])

    return NextResponse.json({
      success: true,
      message: 'Certificate deleted successfully'
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: err.message || 'Server error' },
      { status: err.message === 'Unauthorized' ? 401 : 500 }
    )
  }
}