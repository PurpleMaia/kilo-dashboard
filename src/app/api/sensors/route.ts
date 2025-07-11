import { db } from '../../../..//db/kysely/client';
import { getAinaID, getUserID } from '@/app/lib/server-utils';
import { NextResponse } from 'next/server';
import { sql } from 'kysely';
import { getFromCache, setInCache } from '@/app/lib/cache';


export async function GET() {
    let sensors 
    const CACHE_KEY = 'sensors_info'
    const cached = getFromCache(CACHE_KEY)

    if (cached) {
        console.log('found api/sensors data in cache, using cache...')
        sensors = cached
        return NextResponse.json({ sensors })
    }

    console.log('api/sensors not in cache, querying db...')
    try {
        const userID = await getUserID();
        const ainaID = await getAinaID(userID);

        const sensors = await db
        .selectFrom('sensor as s')
        .innerJoin('metric as m', 'm.sensor_id', 's.id')
        .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
        .innerJoin('sensor_mala as sm', 'sm.sensor_id', 's.id')
        .innerJoin('mala', 'mala.id', 'sm.mala_id')
        .innerJoin('aina', 'aina.id', 'mala.aina_id')
        .select([
            's.id as id',
            's.name as name',
            'mt.type_name as typeName',
            'mt.unit as unit',
            'mt.category as category',
            sql<string>`string_agg(distinct mala.name, ', ' ORDER BY mala.name)`.as('locations'),            
        ])
        .groupBy([
            's.id',
            's.name',
            'mt.type_name',
            'mt.unit',
            'mt.category',
        ])
        .orderBy('s.name')
        .where('aina.id', '=', ainaID)
        .execute()

        setInCache(CACHE_KEY, sensors, 1000 * 60 * 5)

        // console.log(sensors)

        return NextResponse.json({ sensors });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
} 