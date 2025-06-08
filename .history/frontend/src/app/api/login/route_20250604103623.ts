import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  // Forward credentials to your Java backend
  const javaRes = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL }/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: body.username,
      password: body.password,
    }),
  });

  const data = await javaRes.json();

  if (!javaRes.ok || !data.token) {
    return NextResponse.json({ message: data.message || "Invalid credentials" }, { status: 401 });
  }

 
  const res = NextResponse.json({ success: true });
  res.cookies.set('token', data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, 
  });

  return res;
}