import { NextResponse } from 'next/server';
import { getUserData } from '@/lib/server-utils';

export async function GET() {
  try {
    const user = await getUserData()    
    
    if (!user) {
      console.log('Unauthorized - no user')
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }
    
    console.log('I am: ', user)
    return NextResponse.json(user)
  } catch (error) {    
      console.error('Error in /api/me:', error);
          return NextResponse.json(
              { error: 'Internal server error' },
              { status: 500 }
      );
  }
}