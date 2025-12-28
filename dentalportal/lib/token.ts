import jwt, { SignOptions } from 'jsonwebtoken'

// Secrets
const JWT_SECRET =
  process.env.JWT_SECRET ||
  'e9f7c3a2d4b8f6a1c9e5b0d7a2f4e8c6b1d9a0f3c5e7b2a4d6f8c9e1'

const RESET_PASSWORD_SECRET =
  process.env.RESET_PASSWORD_SECRET ||
  'e9f7c3a2d4b8f6a1c9e5b0d7a2f4e8c6b1d9a0f3c5e7b2a4d6f8c9e1'

// ⬇️ IMPORTANT PART
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '1d') as SignOptions['expiresIn']
const RESET_TOKEN_EXPIRES_IN = (process.env.RESET_TOKEN_EXPIRES_IN || '1h') as SignOptions['expiresIn']

// Debug (safe)
console.log('DEBUG token.ts:', {
  JWT_EXPIRES_IN,
  RESET_TOKEN_EXPIRES_IN,
})

export function generateJWT(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

export function generateResetToken(userId: number) {
  return jwt.sign(
    { userId },
    RESET_PASSWORD_SECRET,
    {
      expiresIn: RESET_TOKEN_EXPIRES_IN,
    }
  )
}

export function verifyResetToken(token: string) {
  return jwt.verify(token, RESET_PASSWORD_SECRET) as { userId: number }
}
