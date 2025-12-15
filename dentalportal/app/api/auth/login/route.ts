import pool from '@/lib/db'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined')
}

const JWT_SECRET = process.env.JWT_SECRET

export async function POST(req: Request) {
  const { email, password } = await req.json()

  try {
    const [users]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (!users.length) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const user = users[0]
    const match = await bcrypt.compare(password, user.password)

    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    )

    const response = NextResponse.json({
      role: user.role,
      token, // 👈 useful for UI state
    })

    // ✅ COOKIE FOR MIDDLEWARE
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60,
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
