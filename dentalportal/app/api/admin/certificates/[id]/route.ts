import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { requireAdmin } from '@/lib/auth'

// GET single certificate
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DEVELOPMENT ONLY: Skip auth check
    // await requireAdmin(req)
    
    console.warn('⚠️ DEVELOPMENT MODE: Skipping authentication')
    
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

    return NextResponse.json({
      warning: 'Development mode: No authentication',
      data: rows[0]
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: 'Development error' },
      { status: 500 }
    )
  }
}

// UPDATE certificate
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DEVELOPMENT ONLY: Skip auth check
    // await requireAdmin(req)
    
    console.warn('⚠️ DEVELOPMENT MODE: Skipping authentication')
    
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
        // Format the date for MySQL
        const date = new Date(issued_at)
        if (isNaN(date.getTime())) {
          return NextResponse.json(
            { message: 'Invalid date format' },
            { status: 400 }
          )
        }
        issuedAtValue = date.toISOString().slice(0, 19).replace('T', ' ')
      } else if (!existing[0].issued_at) {
        issuedAtValue = new Date().toISOString().slice(0, 19).replace('T', ' ')
      } else {
        issuedAtValue = existing[0].issued_at
      }
      
      query += ', issued_at = ?'
      values.push(issuedAtValue)
    } else {
      query += ', issued_at = NULL'
    }
    
    query += ' WHERE id = ?'
    values.push(id)

    await pool.query(query, values)

    return NextResponse.json({
      warning: 'Development mode: Updated without authentication',
      success: true,
      message: 'Certificate updated successfully'
    })
  } catch (err: any) {
    console.error('Error updating certificate:', err)
    return NextResponse.json(
      { message: 'Development error' },
      { status: 500 }
    )
  }
}

// DELETE certificate
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // DEVELOPMENT ONLY: Skip auth check
    // await requireAdmin(req)
    
    console.warn('⚠️ DEVELOPMENT MODE: Skipping authentication - DELETING DATA')
    
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
      warning: 'Development mode: Deleted without authentication',
      success: true,
      message: 'Certificate deleted successfully'
    })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { message: 'Development error' },
      { status: 500 }
    )
  }
}