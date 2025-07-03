import { NextResponse } from 'next/server';
import { registerUser } from '@/app/lib/auth';
import { sessionCookieName } from '@/app/lib/session';

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // Basic validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Register the user and get the session token
    const { token } = await registerUser(username, email, password);

    // Create response
    const response = NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
    );

    // Set the session cookie
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      expires: expiresAt,
      path: "/"
    });

    console.log('Session cookie set during registration:', token);
    return response;

  } catch (error) {
    console.error('Registration Error:', error);
    
    if (error instanceof Error && error.message === 'Username already taken') {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
} 