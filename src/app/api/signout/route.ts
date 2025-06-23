import { NextResponse } from 'next/server';
import { loginUser, registerUser, invalidateSession } from '@/app/lib/auth';
import { deleteSessionTokenCookie } from '@/app/lib/session';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
      const sessionCookie = (await cookies()).get('auth_session')
    
      // invalidate the session in the DB
      if (sessionCookie && sessionCookie.value) {
        await invalidateSession(sessionCookie.value);
      }
      
      // delete cookie from session
      deleteSessionTokenCookie()
    
      console.log('successfully cleared cookies')
      const { origin } = new URL(request.url)
      return NextResponse.redirect(`${origin}/`)
  } catch (error) {
    console.error('Signout Error:', error);
    return NextResponse.json(
      { error: 'Sign out failed.' },
      { status: 400 }
    );
  } 
}