import { NextResponse } from 'next/server';
import { getUserData } from '@/lib/server-utils';

export async function GET() {
  try {
    const user = getUserData()

    if (!user) {
        console.log('No user found');
        return NextResponse.json(
            { error: 'No session found or session invalid' },
            { status: 401 }
        );
    }
    
    return NextResponse.json(user)
  } catch (error) {
        console.error('Error in /api/me:', error);
            return NextResponse.json(
                { error: 'Internal server error' },
                { status: 500 }
        );
  }
}