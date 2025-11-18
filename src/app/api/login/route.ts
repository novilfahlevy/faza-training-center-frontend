// app/api/login/route.js
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encrypt } from '@/lib/auth';
import { loginPeserta } from '@/mainHttpClient';


export async function POST(request) {
  const { email, password } = await request.json();

  // 1. Verify Credentials
  const data = await loginPeserta({ email, password });

  if (!data) {
    return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }

  // 2. Create the Session Payload
  const payload = { userId: data.user.user_id, email: data.user.email };
  const encryptedToken = await encrypt(payload);

  // 3. Define Cookie Expiry (1 day)
  const oneDay = 24 * 60 * 60 * 1000;
  const expires = new Date(Date.now() + oneDay);

  // 4. Set the HTTP-only Cookie
  cookies().set('auth_token', encryptedToken, {
    httpOnly: true, // Prevents client-side JS access
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    expires: expires,
    sameSite: 'strict',
    path: '/',
  });

  return NextResponse.json({ message: 'Login successful' }, { status: 200 });
}