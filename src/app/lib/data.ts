import postgres from 'postgres'
import { db } from '../../../db/kysely/client'
import {
    LatestSensorsList,
    SensorData
} from "./types"

// import { patches, sensors } from "./temp-data"
// const sql = postgres(process.env.DATABASE_URL!)

// grab the latest data from each sensor type
export async function fetchLatestSensorsData(): Promise<LatestSensorsList[]> {
    try {
        return await fetcher<SensorData[]>('/sensors/latest')
        // const data = await sql<LatestSensorsList[]>`
        //     SELECT DISTINCT ON (s.name)
        //     s.name,            
        //     m.value
        //     FROM metric m
        //     JOIN sensor s ON m.sensor_id = s.id
        //     ORDER BY s.name, m.timestamp DESC;
        // `
    } catch (error) {
    console.error('API Error:', error);
    throw new Error('Failed to fetch the latest sensor data.');
    }
}

// grab all data from sensors from the past deployment
export async function fetchSensorsData() {
    try {
        const data = await fetcher<SensorData[]>('/sensors/graph')
        // fetch all sensor data from past 5 days (for now commented out for Phase I)
        // const data = await sql<SensorData[]>`
        //     SELECT s.name, value, timestamp from metric m
        //     join sensor s on s.id = m.sensor_id
        //     -- where timestamp >= NOW() - interval '5 days'
        //     order by s.name, timestamp desc
        // `

        // group by sensor name and return different objects
        const grouped: Record<string, any[]> = {};
        for (const row of data) {
            if (!grouped[row.name]) grouped[row.name] = [];
            grouped[row.name].push({
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