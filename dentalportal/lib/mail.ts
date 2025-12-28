import nodemailer from 'nodemailer'

// Env variables with fallback values
const SMTP_HOST = process.env.SMTP_HOST || 'smtp.hostinger.com'
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587')
const SMTP_USER = process.env.SMTP_USER || 'info@rayyanlms.com'
const SMTP_PASS = process.env.SMTP_PASS || 'Rayyanlms#123'
const SMTP_FROM = process.env.SMTP_FROM || 'Rayyan LMS <info@rayyanlms.com>'
const SMTP_SECURE = process.env.SMTP_SECURE === 'true' // converts string to boolean

// Debug logs
console.log('DEBUG mail.ts:', { SMTP_HOST, SMTP_PORT, SMTP_USER })

// Create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_SECURE,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
})

export async function sendResetEmail(to: string, resetLink: string) {
  try {
    const info = await transporter.sendMail({
      from: SMTP_FROM,
      to,
      subject: 'Reset your password',
      html: `
        <p>You requested a password reset.</p>
        <p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>
      `,
    })
    console.log('Reset email sent:', info.messageId)
    return info
  } catch (err: any) {
    console.error('sendResetEmail error:', err)
    throw err
  }
}
