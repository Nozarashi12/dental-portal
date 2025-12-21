// app/api/auth/signup/route.ts
import pool from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'
import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  const { name, email, password, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  try {
    const [existing]: any = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    )

    if (existing.length) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const [result]: any = await pool.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role || 'client']
    )

    const token = signToken({
      id: result.insertId,
      email,
      role: role || 'client'
    })

    // ✅ FIX: Return token in JSON response (just like login API does)
    const response = NextResponse.json({ 
      role: role || 'client', 
      token: token // ✅ ADD THIS LINE - CRITICAL!
    })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60
    })

    return response
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}