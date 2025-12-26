import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'
import pool from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
      // Verify the JWT token
      const decoded = verifyToken(token)
      if (!decoded || !decoded.id) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      // Fetch user from database
      const [users] = await pool.query(
        'SELECT id, name, email, role, phone, specialty, college, city, bio, created_at, updated_at FROM users WHERE id = ?',
        [decoded.id]
      )

      const user = (users as any[])[0]
      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      return NextResponse.json({ user })
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const body = await request.json()

    // Allowed fields to update
    const allowedFields = ['name', 'phone', 'specialty', 'college', 'city', 'bio']
    const updateFields: string[] = []
    const updateValues: any[] = []

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateFields.push(`${field} = ?`)
        // Convert empty string to null
        updateValues.push(body[field] === '' ? null : body[field])
      }
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updateValues.push(decoded.id)
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')}, updated_at = NOW() WHERE id = ?`
    await pool.query(updateQuery, updateValues)

    // Fetch updated user
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, specialty, college, city, bio, created_at, updated_at FROM users WHERE id = ?',
      [decoded.id]
    )

    const user = (users as any[])[0]

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
