import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
type JwtPayload = {
  id: number
  role: 'admin' | 'client'
  email: string
}

// Get user from request (reads HTTP-only cookie)
export async function getUserFromRequest(req: Request | NextRequest) {
  try {
    const cookieHeader = req.headers.get('cookie')
    if (!cookieHeader) return null

    const match = cookieHeader.split(';').find(c => c.trim().startsWith('token='))
    if (!match) return null

    const token = match.split('=')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload
    return decoded
  } catch (err) {
    console.error('JWT verification failed:', err)
    return null
  }
}

// Guard admin routes
export async function requireAdmin(req: Request | NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized')
  }
  return user
}

// Guard logged-in user
export async function requireUser(req: Request | NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) throw new Error('Unauthorized')
  return user
}
