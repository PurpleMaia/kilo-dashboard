import { NextResponse } from 'next/server';
import { invalidateSession } from '@/app/lib/auth';
import { deleteSessionTokenCookie } from '@/app/lib/session';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const sessionCookie = (await cookies()).get('auth_session');
    
    // invalidate the session in the DB
    if (sessionCookie && sessionCookie.value) {
      await invalidateSession(sessionCookie.value);
    }
    
    // Clear the session cookie using the utility function
    await deleteSessionTokenCookie();
    
    console.log('Successfully signed out user');
    return NextResponse.json({ 
      success: true, 
      message: 'Successfully signed out' 
    });;
    
  } catch (error) {
    console.error('Signout Error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Sign out failed. Please try again.' 
      },
      { status: 500 }
    );
  } 
}