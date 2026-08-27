import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  // Protected paths
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/provider') ||
    pathname.startsWith('/admin');

  if (isProtectedRoute && !token) {
    // In strict production, redirect to login if not authenticated
    // const loginUrl = new URL('/login', request.url);
    // loginUrl.searchParams.set('from', pathname);
    // return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/provider/:path*', '/admin/:path*'],
};
