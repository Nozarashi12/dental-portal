import { NextResponse } from 'next/server'
import getPool from '@/lib/db'
import { generateResetToken } from '@/lib/token'
import { sendResetEmail } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 })

    const pool = await getPool()
    const [rows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email])

    if (rows.length === 0) {
      return NextResponse.json({ message: 'Reset link sent if account exists' })
    }

    const userId = rows[0].id
    const token = generateResetToken(userId)

    await pool.query(
      `UPDATE users SET reset_token = ?, reset_token_expiry = DATE_ADD(NOW(), INTERVAL 1 HOUR) WHERE id = ?`,
      [token, userId]
    )

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/client/reset-password?token=${token}`

    try {
      await sendResetEmail(email, resetLink)
    } catch (emailError) {
      console.error('Email send error:', emailError)
      return NextResponse.json({ error: 'Failed to send email', details: emailError.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Reset link sent if account exists' })
  } catch (error: any) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}
