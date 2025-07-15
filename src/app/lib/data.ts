import { db } from '../../../db/kysely/client'
import {
    LatestSensorsList
} from "./types"
import { getFromCache, setInCache } from './cache';
import { getUserID, getAinaID } from './server-utils';
import { sql } from 'kysely';

export interface MalaData {
    name: string;
    data: Record<string, Array<{ timestamp: string; value: number }>>;
}

// grab the latest data from each sensor type
export async function fetchLatestSensorsData(): Promise<LatestSensorsList[]> {
    try {
        const data = await db
            .selectFrom('sensor as s')
            .innerJoin('metric as m', 'm.sensor_id', 's.id')
            .select(['s.name', 'm.value'])
            .distinctOn('s.name')
            .orderBy(['s.name', 'm.timestamp desc'])
            .execute();
        
        return data as LatestSensorsList[];
    } catch (error) {
        console.error('API Error:', error);
        throw new Error('Failed to fetch the latest sensor data.');
    }
}

// grab all data from sensors from the past deployment
export async function fetchSensorsData(): Promise<MalaData[]> {
    const CACHE_KEY = 'all_sensors_per_patch'
    const cached = getFromCache(CACHE_KEY)
    if (cached) {
        console.log('found SensorsData in cache... using cache')
        return cached as MalaData[]
    }

    console.log('fetchSensorsData not in cache, querying db...')
    try {
        const userID = await getUserID()
        const ainaID = await getAinaID(userID)

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

        const data = Object.entries(grouped).map(([name, data]) => ({ name, data }))
        setInCache(CACHE_KEY, data, 1000 * 60 * 20) //5 minutes

        return data
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}

export async function fetchSensorDataByAinaName(ainaID: number) {
    // subquery to get the latest values and timestamp
    const rankedMetrics = db
    .selectFrom('metric')
    .select([
        'metric.id', 'metric.sensor_id', 'metric.metric_type', 'metric.timestamp', 'metric.value',
        sql<number>`ROW_NUMBER() OVER (PARTITION BY metric.sensor_id, metric.metric_type ORDER BY metric.timestamp DESC)`.as('rn'),
    ])
    .as('m')

    // query on the latest values
    const sensors = await db
    .selectFrom(rankedMetrics)
    .innerJoin('sensor as s', 's.id', 'm.sensor_id')
    .innerJoin('metric_type', 'metric_type.id', 'm.metric_type')
    .innerJoin('sensor_mala as sm', 'sm.sensor_id', 's.id')
    .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
    .innerJoin('aina as a', 'a.id', 'ma.aina_id')
    .select([
        's.name as name',
        'ma.name as location',
        'm.value as latestValue',
        'metric_type.type_name as metricType',
        'metric_type.unit',
        'metric_type.category',
        'm.timestamp',
    ])        
    .where((eb) =>
        eb('m.rn', '>=', 1).and('m.rn', '<=', 5).and('a.id', '=', ainaID) // collecting latest 5 batches from each sensor (can edit from a couple days)
    )     
    .orderBy('s.name')
    .execute()    

    return sensors
}

export async function fetchAinaIDByName(ainaName: string) {
    const result = await db
        .selectFrom('aina')
        .select(['aina.id', 'aina.name'])
        .where('aina.name', 'ilike', ainaName)
        .executeTakeFirst()

    return result
}

export async function fetchAinaLocations() {
    const result = await db
        .selectFrom('aina')
        .select('aina.name')        
        .execute()

    console.log(result)
    
    return result
}