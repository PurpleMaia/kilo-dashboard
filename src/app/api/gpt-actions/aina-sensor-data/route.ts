import { fetchSensorDataByAinaName } from '@/app/lib/data';
import { NextRequest, NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Missing ʻāina name' },
        { status: 400, headers: corsHeaders }
      );
    }

    console.log('Fetching sensor data for:', name);
    
    // Replace with your actual function
    const sensorData = await fetchSensorDataByAinaName(name);

    return NextResponse.json(
      sensorData,
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500, headers: corsHeaders }
    );
  }
}