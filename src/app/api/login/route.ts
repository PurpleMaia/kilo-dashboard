import { NextResponse } from 'next/server';
import { loginUser, registerUser } from '@/app/lib/auth';
import { setSessionTokenCookie } from '@/app/lib/session';

export async function POST(request: Request) {
  const form = await request.formData();
  const username = form.get('username') as string;
  const password = form.get('password') as string;

  try {
    // Try to login, or register if user doesn't exist
    let user, token;
    try {
      console.log('trying to login...');
      ({ user, token } = await loginUser(username, password));
    } catch (e) {
      // If login fails, try to register
      console.log('no existing user... signing up user with example.com')
      const email = `${username}@example.com`; // Or get from form if you have it
      await registerUser(username, email, password);
      ({ user, token } = await loginUser(username, password));
    }
  
    // Set session cookie
    const { origin } = new URL(request.url)
    const response = NextResponse.redirect(`${origin}/dashboard`);
    setSessionTokenCookie(token);
    console.log(user, token)
    return response;
  } catch (error) {
    console.error('Login/Signup Error:', error);
    return NextResponse.json(
      { error: 'Login or registration failed.' },
      { status: 400 }
    );
  }
}