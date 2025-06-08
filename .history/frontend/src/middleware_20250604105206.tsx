import { NextRequest, NextResponse } from 'next/server';

// List of routes that don't require authentication
const PUBLIC_PATHS = ['/login', '/_next','/eye-slash.svg','/mail-icon.svg', '/favicon.ico', '/api/login', '/api/logout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  
  if (PUBLIC_PATHS.some(path => pathname.startsWith(path))) {
   
    if (pathname === '/login' && token) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  
  return NextResponse.next();
}


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