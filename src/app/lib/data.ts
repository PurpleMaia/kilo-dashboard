import { db } from '../../../db/kysely/client'
import {
    LatestSensorsList
} from "./types"
import { getFromCache, setInCache } from './cache';

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
export async function fetchSensorsData() {
    const CACHE_KEY = 'all_sensors_per_patch'
    const cached = getFromCache(CACHE_KEY)
    if (cached) {
        console.log('found SensorsData in cache... using cache')
        return cached
    }

    console.log('fetchSensorsData not in cache, querying db...')
    try {
        const result = await db
            .selectFrom('metric as m')
            .innerJoin('sensor_mala as sm', 'sm.sensor_id', 'm.sensor_id')
            .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
            .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
            .select(['m.value', 'm.timestamp', 'mt.type_name', 'ma.name as mala_name'])
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
        setInCache(CACHE_KEY, data, 1000 * 60 * 5)

        return data
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch the latest invoices.');
    }
}