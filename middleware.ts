import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (pathname === '/') {
    if (search.includes('data=')) {
      return NextResponse.redirect(
        new URL(`/sso-login-complete${search}`, request.url),
      )
    }
    return NextResponse.redirect(new URL('/app', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/',
}
