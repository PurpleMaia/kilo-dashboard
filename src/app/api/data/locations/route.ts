
import { db } from '../../../../../db/kysely/client';
import { getAuthData } from '@/lib/server-utils';
import { NextResponse } from 'next/server';

export async function GET() {
    const { userID, ainaID }= await getAuthData()
    if (userID) {
        try {
            const result = await db
                .selectFrom('metric as m')
                .innerJoin('sensor_mala as sm', 'sm.sensor_id', 'm.sensor_id')
                .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
                .innerJoin('aina as a', 'a.id', 'ma.aina_id')
                .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
                .select(['m.value', 'm.timestamp', 'mt.type_name', 'ma.name as mala_name'])
                .where('a.id', '=', ainaID)
                .orderBy('m.timestamp', 'asc')
                .execute();
    
            // Group by metric type, then by mala name
            const grouped: Record<string, Record<string, Array<{ timestamp: string; value: number }>>> = {};
            for (const row of result) {
                const typeName = row.type_name || 'unknown';
                const malaName = row.mala_name || 'unknown';
                
                if (!grouped[malaName]) grouped[malaName] = {};
                if (!grouped[malaName][typeName]) grouped[malaName][typeName] = [];
                
                grouped[malaName][typeName].push({
                    timestamp: row.timestamp?.toISOString() || new Date().toISOString(),
                    value: row.value || 0,
                });
            }
    
            const locations = Object.entries(grouped).map(([siteName, data]) => ({ siteName, data }))
    
            return NextResponse.json({ locations })
        } catch (error) {
            console.error('Database Error:', error);
            return NextResponse.json({ error: 'Failed to fetch the latest invoices.' }, { status: 500 });
        }
    } else {
        console.error('Error fetching Aina ID');
        return NextResponse.json({ error: 'You are not registered to any ʻāina. Please select an ʻāina in your profile settings.' }, { status: 400 });
    }
}