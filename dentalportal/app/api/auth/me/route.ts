import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ loggedIn: false })
  }

  try {
    const user = verifyToken(token)
    return NextResponse.json({
      loggedIn: true,
      user
    })
  } catch {
    return NextResponse.json({ loggedIn: false })
  }
}
