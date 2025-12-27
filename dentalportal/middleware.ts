import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenJose } from '@/lib/jwt'

const PUBLIC_ROUTES = ['/', '/client/login', '/client/signup', '/client/faq']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ Allow exact public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  const token = req.cookies.get('token')?.value

  // ❌ No token
  if (!token) {
    // API → JSON error
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Pages → redirect
    return NextResponse.redirect(new URL('/client/login', req.url))
  }

  try {
    const payload = await verifyTokenJose(token)

    // 🔒 Admin UI routes
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // 🔐 ONLY this API is admin-only
    if (pathname === '/api/admin/users' && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // ✅ Everything else allowed
    return NextResponse.next()
  } catch (err) {
    if (pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/client/login', req.url))
  }
}

export const config = {
  matcher: [
    '/client/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/classroom/:path*',
    '/api/:path*', // ✅ API routes still allowed
  ],
}
