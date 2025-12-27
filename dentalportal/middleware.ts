import { NextRequest, NextResponse } from 'next/server'
import { verifyTokenJose } from '@/lib/jwt'

const PUBLIC_ROUTES = ['/', '/client/login', '/client/signup', '/client/faq']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ✅ Allow exact public routes ONLY
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next()
  }

  // 🔐 Get token
  const token = req.cookies.get('token')?.value

  if (!token) {
    return NextResponse.redirect(new URL('/client/login', req.url))
  }

  try {
    const payload = await verifyTokenJose(token)

    // 🔒 Admin-only routes
    if (pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    if (pathname === '/api/admin/users' && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }


    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', req.url))
  }
}

export const config = {
  matcher: [
    '/client/:path*',
    '/admin/:path*',
    '/profile/:path*',
    '/classroom/:path*',
    
  ],
}
