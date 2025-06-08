import { NextRequest, NextResponse } from 'next/server';

// List of routes that don't require authentication
const PUBLIC_PATHS = ['/login', '/_next', '/favicon.ico', '/api/login', '/api/logout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Allow all public paths
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
    // If already logged in and on /login, redirect to /
    if (pathname === '/login' && token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If not logged in, redirect all other paths to /login
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // If logged in, allow access to other pages
  return NextResponse.next();
}

// Tell Next.js what paths to run the middleware on (apply to all except static files, etc.)
export const config = {
  matcher: [
    /*
      Match all request paths except for:
      - static files
      - api routes (except login/logout)
    */
    "/((?!_next/static|_next/image|favicon.ico|api/.*).*)",
  ],
};