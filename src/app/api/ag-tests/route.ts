import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { getUserID, getAinaID } from '@/app/lib/server-utils';

export async function GET(request: NextRequest) {
    try {
      const userID = await getUserID();
      const ainaID = await getAinaID(userID);
      const { searchParams } = new URL(request.url);
      const testType = searchParams.get('type');
  
      let query = db
        .selectFrom('ag_test_files')
        .select(['id', 'test_type', 'file_name', 'file_size', 'mime_type', 'uploaded_at'])
        .where('user_id', '=', userID)
        .where('aina_id', '=', ainaID);
  
      if (testType) {
        query = query.where('test_type', '=', testType);
      }
  
      const files = await query
        .orderBy('uploaded_at', 'desc')
        .execute();
  
      return NextResponse.json({ files });
  
    } catch (error) {
      console.error('Fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch files' },
        { status: 500 }
      );
    }
  }