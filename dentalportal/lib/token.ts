import jwt from 'jsonwebtoken'

// Env variables with fallback values
const JWT_SECRET = process.env.JWT_SECRET || 'e9f7c3a2d4b8f6a1c9e5b0d7a2f4e8c6b1d9a0f3c5e7b2a4d6f8c9e1'
const RESET_PASSWORD_SECRET = process.env.RESET_PASSWORD_SECRET || 'e9f7c3a2d4b8f6a1c9e5b0d7a2f4e8c6b1d9a0f3c5e7b2a4d6f8c9e1'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d'
const RESET_TOKEN_EXPIRES_IN = process.env.RESET_TOKEN_EXPIRES_IN || '1h'

// Debug logs
console.log('DEBUG token.ts:', {
  JWT_SECRET: JWT_SECRET.slice(0, 6) + '...',
  RESET_PASSWORD_SECRET: RESET_PASSWORD_SECRET.slice(0, 6) + '...',
})

export function generateJWT(payload: any) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

export function generateResetToken(userId: number) {
  return jwt.sign({ userId }, RESET_PASSWORD_SECRET, { expiresIn: RESET_TOKEN_EXPIRES_IN })
}

export function verifyResetToken(token: string) {
  try {
    return jwt.verify(token, RESET_PASSWORD_SECRET) as { userId: number }
  } catch (err) {
    console.error('verifyResetToken error:', err)
    throw new Error('Invalid or expired reset token')
  }
}
