import { NextRequest, NextResponse } from 'next/server';


const PUBLIC_PATHS = ['/login', '/api/login', '/api/logout'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;


  if (PUBLIC_PATHS.includes(pathname)) {
    // If already logged in and on /login, redirect to /
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
    // Exclude:
    // - _next/static (Next.js static files)
    // - _next/image (Next.js image optimization)
    // - favicon.ico
    // - everything inside /public (like /Images, /Icons, etc.)
    "/((?!_next/static|_next/image|favicon.ico|Images/|Icons/|api/.*).*)",
  ],
};