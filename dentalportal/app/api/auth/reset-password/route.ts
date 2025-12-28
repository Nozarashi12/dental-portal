import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { verifyResetToken } from '@/lib/token'
import pool from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Invalid request' },
        { status: 400 }
      )
    }

    // 1️⃣ Verify JWT signature
    const { userId } = verifyResetToken(token)

    // 2️⃣ Verify token exists in DB and not expired
    const [rows]: any = await pool.query(
      `SELECT id FROM users 
       WHERE id = ? 
       AND reset_token = ? 
       AND reset_token_expiry > NOW()`,
      [userId, token]
    )

    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // 3️⃣ Hash new password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4️⃣ Update password & clear token
    await pool.query(
      `UPDATE users
       SET password = ?, reset_token = NULL, reset_token_expiry = NULL
       WHERE id = ?`,
      [hashedPassword, userId]
    )

    return NextResponse.json(
      { message: 'Password reset successful' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 400 }
    )
  }
}
