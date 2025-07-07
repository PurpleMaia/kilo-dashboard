import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../db/kysely/client';
import { getUserID, getAinaID } from '@/app/lib/server-utils';

export async function POST(request: NextRequest) {
  try {
    const userID = await getUserID();
    const ainaID = await getAinaID(userID);
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const testType = formData.get('testType') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!testType || !['soil', 'water', 'ecoli'].includes(testType)) {
      return NextResponse.json({ error: 'Invalid test type' }, { status: 400 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to database
    const result = await db
      .insertInto('ag_test_files')
      .values({
        user_id: userID,
        aina_id: ainaID,
        test_type: testType,
        file_name: file.name,
        file_content: buffer, // Store the actual file bytes
        file_size: file.size,
        mime_type: file.type,
      })
      .returning(['id'])
      .executeTakeFirst();

    return NextResponse.json({
      success: true,
      fileId: result?.id
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

