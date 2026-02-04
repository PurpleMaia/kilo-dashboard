
import { db } from '../../../../db/kysely/client';
import { getAuthData } from '@/lib/server-utils';
import { sql } from 'kysely';
import { NextResponse } from 'next/server';

export async function GET() {
    const { userID }= await getAuthData()
    if (userID) {
        try {
            const recentReadingsByMetricType = await db
                .with('ranked_metrics', (db) =>
                db
                    .selectFrom('metric as m')
                    .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
                    .innerJoin('mala as ma', 'ma.id', 'm.mala_id')
                    .innerJoin('aina as a', 'a.id', 'ma.aina_id')
                    .innerJoin('sensor as s', 's.id', 'm.sensor_id')
                    .select([
                    'm.value',
                    'm.timestamp',
                    'ma.name as mala_name',
                    'mt.type_name as metric_type',
                    's.name as sensor_name',
                    sql<number>`ROW_NUMBER() OVER (
                        PARTITION BY m.metric_type, m.mala_id 
                        ORDER BY m.timestamp ASC
                    )`.as('rn')
                    ])
                    .where('a.id', '=', 2)
                )
                .selectFrom('ranked_metrics')
                .selectAll()
                .where('rn', '<=', 5)      
                .where((eb) => 
                    eb.or([
                        eb('mala_name', '=', 'Top Loʻi Patch')
                        , eb('mala_name', '=', 'Mid Patch (Awa)')
                        , eb('mala_name', '=', 'Bottom Patch')                        
                    ])                                        
                )
                .orderBy(['metric_type', 'rn'])
                .execute();
    
            // Group by metric type, then by mala name
            const grouped: Record<string, Record<string, Array<{ timestamp: string; value: number }>>> = {};
            for (const row of recentReadingsByMetricType) {
                const typeName = row.metric_type || 'unknown';
                const malaName = row.mala_name || 'unknown';

                // TEMP: Skip Loʻi-1 entries (invalid data)
                if (malaName === 'Loʻi-1') continue
                
                if (!grouped[malaName]) grouped[malaName] = {};
                if (!grouped[malaName][typeName]) grouped[malaName][typeName] = [];
                
                grouped[malaName][typeName].push({
                    timestamp: row.timestamp?.toISOString() || new Date().toISOString(),
                    value: row.value || 0,
                });

                // Show only latest 5 points
                if (grouped[malaName][typeName].length > 5) {
                    grouped[malaName][typeName] = grouped[malaName][typeName].slice(-5);
                }
            }            
    
            const locations = Object.entries(grouped).map(([siteName, data]) => ({ siteName, data }))
            console.log(locations)
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