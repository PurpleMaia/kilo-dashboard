import { db } from '../../../../../db/kysely/client';
import { sql } from 'kysely';
import { NextResponse } from 'next/server';
import { getAuthData } from '@/lib/server-utils';

export async function GET() {
    const data = await getAuthData()
    const ainaID = data.ainaID
    if (ainaID) {
        try  {                        
            const sensorCount = await db
                .selectFrom('sensor as s')
                .innerJoin('metric as m', 'm.sensor_id', 's.id')
                .innerJoin('mala as ma', 'ma.id', 'm.mala_id')
                .innerJoin('aina as a', 'a.id', 'ma.aina_id')
                .select(sql<number>`COUNT(DISTINCT s.name)`.as('count'))
                .where('a.id', '=', ainaID)
                .executeTakeFirstOrThrow();
    
            const latestFetch = await db
                .selectFrom('metric as m')
                .select('m.timestamp')                
                .innerJoin('mala as ma', 'ma.id', 'm.mala_id')
                .innerJoin('aina as a', 'a.id', 'ma.aina_id')
                .where('a.id', '=', ainaID)
                .orderBy('m.timestamp', 'desc')
                .limit(1)
                .executeTakeFirstOrThrow();
    
            console.log(sensorCount, latestFetch)            
    
            return NextResponse.json({ sensorCount, latestFetch });
        } catch (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: 'Failed to fetch the latest invoices.' }, { status: 500 });
        }
    } else {
        console.error('Error fetching Aina ID');
        return NextResponse.json({ error: 'You are not registered to any ʻāina. Please select an ʻāina in your profile settings.' }, { status: 400 });
    }
} 