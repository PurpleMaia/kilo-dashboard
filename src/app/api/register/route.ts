import { NextResponse } from 'next/server';
import { registerUser } from '@/app/lib/auth';

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

    // Register the user
    await registerUser(username, email, password);

    return NextResponse.json(
      { success: true, message: 'User registered successfully' },
      { status: 201 }
    );

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