import { NextResponse } from 'next/server'
import pool from '@/lib/db'
import { generateResetToken } from '@/lib/token'
import { sendResetEmail } from '@/lib/mail'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const [rows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email])
    if (rows.length === 0) {
      // Security: do not reveal existence
      return NextResponse.json({ message: 'If the email exists, a reset link has been sent' }, { status: 200 })
    }

    const user = rows[0]
    const token = generateResetToken(user.id)
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/client/reset-password?token=${token}`

    await sendResetEmail(email, resetLink)

    return NextResponse.json({ message: 'Reset link sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
