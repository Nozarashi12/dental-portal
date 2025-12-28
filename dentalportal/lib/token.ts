import jwt from 'jsonwebtoken'

const RESET_SECRET = process.env.JWT_SECRET! // use JWT_SECRET for reset tokens

export function generateResetToken(userId: number | string) {
  return jwt.sign({ userId }, RESET_SECRET, { expiresIn: process.env.RESET_TOKEN_EXPIRES_IN || '1h' })
}

export function verifyResetToken(token: string) {
  return jwt.verify(token, RESET_SECRET) as { userId: number }
}
