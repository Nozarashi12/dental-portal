import { NextResponse } from 'next/server'
import getPool from '@/lib/db'
import { generateResetToken } from '@/lib/token'
import { sendResetEmail } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const pool = await getPool()

    const [rows]: any = await pool.query(
      'SELECT id FROM users WHERE email = ? LIMIT 1',
      [email]
    )

    // Do not reveal whether email exists
    if (!rows || rows.length === 0) {
      return NextResponse.json({
        message: 'If the email exists, a reset link has been sent',
      })
    }

    const userId = rows[0].id
    const token = generateResetToken(userId)

    await pool.query(
      `UPDATE users
       SET reset_token = ?,
           reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR)
       WHERE id = ?`,
      [token, userId]
    )

    const resetLink =
      `${process.env.NEXT_PUBLIC_APP_URL}/client/reset-password?token=${token}`

    await sendResetEmail(email, resetLink)

    return NextResponse.json({
      message: 'If the email exists, a reset link has been sent',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
