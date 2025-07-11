import { db } from '../../../../../db/kysely/client';
import { getAinaID, getUserID } from '@/app/lib/server-utils';
import { sql } from 'kysely';
import { NextResponse } from 'next/server';
import { getFromCache, setInCache } from '@/app/lib/cache';

export async function GET() {
    let sensorCount, latestFetch 

    const SENSOR_COUNT_CACHE_KEY = 'sensor_count'
    const LATEST_CACHE_KEY = 'latest'
    const count_cached = getFromCache(SENSOR_COUNT_CACHE_KEY)
    const latest_cached = getFromCache(LATEST_CACHE_KEY)

    if (count_cached && latest_cached) {
        console.log('found api/sensors/latest data in cache, using cache...')
        sensorCount = count_cached
        latestFetch = latest_cached
        return NextResponse.json({ sensorCount, latestFetch })
    }
    
    console.log('api/sensors/latest data not in cache, querying db...')
    try {
        const userID = await getUserID();
        const ainaID = await getAinaID(userID);

        const sensorCount = await db
            .selectFrom('sensor as s')
            .innerJoin('sensor_mala as sm', 's.id', 'sm.sensor_id')
            .innerJoin('mala as m', 'm.id', 'sm.mala_id')
            .innerJoin('aina as a', 'a.id', 'm.aina_id')
            .select(sql<number>`COUNT(DISTINCT s.name)`.as('count'))
            .where('a.id', '=', ainaID)
            .executeTakeFirstOrThrow();

        const latestFetch = await db
            .selectFrom('metric as m')
            .select('m.timestamp')
            .innerJoin('sensor_mala as sm', 'sm.sensor_id', 'm.sensor_id')
            .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
            .innerJoin('aina as a', 'a.id', 'ma.aina_id')
            .where('a.id', '=', ainaID)
            .orderBy('m.timestamp desc')
            .limit(1)
            .executeTakeFirstOrThrow();

        console.log(sensorCount, latestFetch)

        setInCache(SENSOR_COUNT_CACHE_KEY, sensorCount, 1000 * 60 * 5)
        setInCache(LATEST_CACHE_KEY, latestFetch, 1000 * 60 * 5)

        return NextResponse.json({ sensorCount, latestFetch });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
} 