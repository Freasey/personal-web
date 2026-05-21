import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE_NAME, verifySessionCookie } from '@/lib/auth/session'

export const config = {
  matcher: ['/dashboard/:path*'],
}

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === '/dashboard/login') {
    return NextResponse.next()
  }

  const cookie = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const isValid = await verifySessionCookie(cookie)

  if (!isValid) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/dashboard/login'
    loginUrl.search = ''
    const from = request.nextUrl.pathname + request.nextUrl.search
    if (from && from !== '/dashboard/login') {
      loginUrl.searchParams.set('from', from)
    }
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}
