import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.json({ loggedIn: false })
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json({
      loggedIn: true,
      user
    })
  } catch {
    return NextResponse.json({ loggedIn: false })
  }
}
