import jwt, { SignOptions } from 'jsonwebtoken'

// ==============================
// Secrets
// ==============================
const JWT_SECRET: jwt.Secret =
  process.env.JWT_SECRET ??
  'e9f7c3a2d4b8f6a1c9e5b0d7a2f4e8c6b1d9a0f3c5e7b2a4d6f8c9e1'

const RESET_PASSWORD_SECRET: jwt.Secret =
  process.env.RESET_PASSWORD_SECRET ??
  'e9f7c3a2d4b8f6a1c9e5b0d7a2f4e8c6b1d9a0f3c5e7b2a4d6f8c9e1'

// ==============================
// Expiry sanitizer (🔥 FIX)
// ==============================
function sanitizeExpiresIn(
  value: string | undefined,
  fallback: SignOptions['expiresIn']
): SignOptions['expiresIn'] {
  if (!value) return fallback

  const cleaned = value.trim()

  // number (seconds)
  if (/^\d+$/.test(cleaned)) {
    return Number(cleaned)
  }

  // valid JWT timespan: 1d, 2h, 30m, etc
  if (/^\d+[smhd]$/.test(cleaned)) {
    return cleaned
  }

  console.warn(`Invalid expiresIn value "${value}", using fallback`)
  return fallback
}

const JWT_EXPIRES_IN = sanitizeExpiresIn(process.env.JWT_EXPIRES_IN, '1d')
const RESET_TOKEN_EXPIRES_IN = sanitizeExpiresIn(process.env.RESET_TOKEN_EXPIRES_IN, '1h')

// ==============================
// Debug (safe)
// ==============================
console.log('DEBUG token.ts', {
  JWT_EXPIRES_IN,
  RESET_TOKEN_EXPIRES_IN,
})

// ==============================
// JWT helpers
// ==============================
export function generateJWT(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

export function verifyJWT(token: string) {
  return jwt.verify(token, JWT_SECRET)
}

// ==============================
// Reset password helpers
// ==============================
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
  try {
    return jwt.verify(token, RESET_PASSWORD_SECRET) as { userId: number }
  } catch (err) {
    console.error('verifyResetToken error:', err)
    throw new Error('Invalid or expired reset token')
  }
}
