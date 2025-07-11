
import { db } from '../../../..//db/kysely/client';
import { getAinaID, getUserID } from '@/app/lib/server-utils';
import { NextResponse } from 'next/server';
import { getFromCache, setInCache } from '@/app/lib/cache';

export async function GET() {
    let locations
    const CACHE_KEY = 'all_metrics_from_location'
    const cached = getFromCache(CACHE_KEY)

    if (cached) {
        console.log('found SensorsData in cache... using cache')
        locations = cached
        return NextResponse.json({ locations })
    }


    console.log('fetchSensorsData not in cache, querying db...')
    const userID = await getUserID()
    const ainaID = await getAinaID(userID)
    try {
        const result = await db
            .selectFrom('metric as m')
            .innerJoin('sensor_mala as sm', 'sm.sensor_id', 'm.sensor_id')
            .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
            .innerJoin('aina as a', 'a.id', 'ma.aina_id')
            .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
            .select(['m.value', 'm.timestamp', 'mt.type_name', 'ma.name as mala_name'])
            .where('a.id', '=', ainaID)
            .orderBy('m.timestamp asc')
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

        locations = Object.entries(grouped).map(([name, data]) => ({ name, data }))
        setInCache(CACHE_KEY, locations, 1000 * 60 * 20) //5 minutes

        return NextResponse.json({ locations })
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
} 