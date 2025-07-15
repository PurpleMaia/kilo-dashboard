import { fetchAinaLocations } from '@/app/lib/data';
import { NextRequest, NextResponse } from 'next/server';

// CORS headers specifically for Custom GPT
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Credentials': 'true',
};

// Handle preflight requests (OPTIONS)
export async function OPTIONS(request: NextRequest) {
  console.log('OPTIONS request received from:', request.headers.get('origin'));
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET() {
  try {
    console.log('Fetching aina locations...');
    const ainaList = await fetchAinaLocations();
    
    console.log('Fetched aina list:', ainaList);
    
    // Check if data was retrieved
    if (!ainaList) {
      console.error('No data returned from fetchAinaLocations');
      return NextResponse.json(
        { error: 'Failed to fetch aina locations' },
        { status: 500, headers: corsHeaders }
      );
    }

    // Return the data
    return NextResponse.json(
      { ainaList },
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching aina locations:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500, headers: corsHeaders }
    );
  }
}