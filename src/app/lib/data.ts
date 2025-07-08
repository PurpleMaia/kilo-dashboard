import postgres from 'postgres'
import { db } from '../../../db/kysely/client'
import {
    LatestSensorsList,
    SensorData
} from "./types"

// import { patches, sensors } from "./temp-data"
const sql = postgres(process.env.DATABASE_URL!)

// grab the latest data from each sensor type
export async function fetchLatestSensorsData(): Promise<LatestSensorsList[]> {
    try {
        // return await fetcher<SensorData[]>('/sensors/latest')
        const data = await sql<LatestSensorsList[]>`
            SELECT DISTINCT ON (s.name)
            s.name,            
            m.value
            FROM metric m
            JOIN sensor s ON m.sensor_id = s.id
            ORDER BY s.name, m.timestamp DESC;
        `
        return data
    } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch the latest sensor data.');
    }
}

// grab all data from sensors from the past deployment
export async function fetchSensorsData() {
    try {
        // const data = await fetcher<SensorData[]>('/sensors/graph')
        // fetch all sensor data from past 5 days (for now commented out for Phase I)
        const data = await sql<SensorData[]>`
            select m.value, m."timestamp", mt.type_name from metric m 
            join metric_type mt on mt.id = m.metric_type 
            where not mt.type_name = 'unknown'
        `

        // group by metric type and return different groups
        const grouped: Record<string, any[]> = {};
        for (const row of data) {
            if (!grouped[row.type_name]) grouped[row.type_name] = [];
            grouped[row.type_name].push({
            timestamp: row.timestamp,
            value: row.value,
            // name: row.name,
            });
        }
        
        return Object.entries(grouped).map(([name, data]) => ({ name, data }));
    } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
    }
}