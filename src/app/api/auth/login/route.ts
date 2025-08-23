import { NextResponse } from 'next/server';
import { loginUser } from '@/lib/auth/utils';
import { sessionCookieName } from '@/lib/auth/session';

export async function POST(request: Request) {
  const form = await request.formData();
  const username = form.get('username') as string;
  const password = form.get('password') as string;

  try {
    // Try to login (no auto-registration)
    const { token, user } = await loginUser(username, password);
  
    // Create response with success status
    const response = NextResponse.json(
      { success: true, user: user },
      { status: 200 }
    );
    
    // Set the session cookie on the response
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/"
    });
    
    console.log('Session cookie set:', token);    
    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Invalid username or password.' },
      { status: 401 }
    );
  }
}