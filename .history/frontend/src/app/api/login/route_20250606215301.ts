import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Forward login request to your Java backend
  const apiRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/cookie/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    credentials: 'include'
  });

  // Relay Set-Cookie header if present
  const responseHeaders: HeadersInit = {};
  const setCookie = apiRes.headers.get('set-cookie');
  if (setCookie) {
    responseHeaders['set-cookie'] = setCookie;
  }

  const data = await apiRes.json();
  return new NextResponse(JSON.stringify(data), {
    status: apiRes.status,
    headers: responseHeaders
  });
}