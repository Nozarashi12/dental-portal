import jwt from 'jsonwebtoken'

const RESET_SECRET = process.env.RESET_PASSWORD_SECRET!

export function generateResetToken(userId: number | string) {
  return jwt.sign({ userId }, RESET_SECRET, { expiresIn: '15m' })
}

export function verifyResetToken(token: string) {
  return jwt.verify(token, RESET_SECRET) as { userId: number }
}
