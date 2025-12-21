import { NextResponse } from 'next/server'
import { signToken, verifyToken } from '@/lib/jwt'

export async function GET() {
  try {
    // Test JWT_SECRET availability
    const secret = process.env.JWT_SECRET
    
    // Test token signing
    const testPayload = { id: 1, email: 'test@example.com', role: 'client' }
    const token = signToken(testPayload)
    
    // Test token verification
    const decoded = verifyToken(token)
    
    return NextResponse.json({
      success: true,
      secretPresent: !!secret,
      secretLength: secret?.length || 0,
      tokenGenerated: !!token,
      tokenVerified: !!decoded,
      payload: decoded
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error?.message || 'Unknown error',
      stack: error?.stack || null
    }, { status: 500 })
  }
}
