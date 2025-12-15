// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  
  // Clear the token cookie
  response.cookies.set({
    name: 'token',
    value: '',
    expires: new Date(0),
    path: '/',
  })
  
  // Also clear role cookie if exists
  response.cookies.set({
    name: 'role',
    value: '',
    expires: new Date(0),
    path: '/',
  })
  
  return response
}