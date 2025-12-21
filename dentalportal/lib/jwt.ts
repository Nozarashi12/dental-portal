import jwt from 'jsonwebtoken'
import { jwtVerify } from 'jose'

// Server-only JWT helper functions
// This file should only be imported by server-side code (API routes, middleware)

// Ensure JWT_SECRET is available at runtime
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not defined. Please set it in your hosting environment.')
  }
  return secret
}

export interface JWTPayload {
  id: number
  email: string
  role: string
}

// Sign a JWT token
export function signToken(payload: JWTPayload): string {
  const secret = getJwtSecret()
  return jwt.sign(payload, secret, { expiresIn: '1h' })
}

// Verify a JWT token (for use in API routes)
export function verifyToken(token: string): JWTPayload {
  const secret = getJwtSecret()
  return jwt.verify(token, secret) as JWTPayload
}

// Verify a JWT token (for use in middleware with jose)
export async function verifyTokenJose(token: string): Promise<JWTPayload> {
  const secret = getJwtSecret()
  const secretKey = new TextEncoder().encode(secret)
  const { payload } = await jwtVerify(token, secretKey)
  return payload as unknown as JWTPayload
}
