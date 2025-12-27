import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenJose } from '@/lib/jwt'

const PUBLIC_ROUTES = ['/', '/client/login', '/client/signup', '/client/faq']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // 🔒 ONLY protect /api/admin/users
  if (pathname === '/api/admin/users') {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    try {
      const payload = await verifyTokenJose(token)

      if (payload.role !== 'admin') {
        return NextResponse.json(
          { error: 'Forbidden' },
          { status: 403 }
        )
      }

      // ✅ Admin → allow
      return NextResponse.next()
    } catch (err) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      )
    }
  }

  // ✅ Everything else is allowed WITHOUT token check
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',   // needed so middleware runs for API
    '/admin/:path*',
    '/client/:path*',
    '/profile/:path*',
    '/classroom/:path*',
  ],
}
