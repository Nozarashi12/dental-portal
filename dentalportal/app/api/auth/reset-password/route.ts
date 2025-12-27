import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { verifyResetToken } from '@/lib/token'
import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()
    if (!token || !password) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { userId } = verifyResetToken(token)
    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId])

    return NextResponse.json({ message: 'Password reset successful' }, { status: 200 })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }
}
