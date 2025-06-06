import postgres from 'postgres'
// import { patches, sensors } from "./temp-data"
import {
    LatestSensorsList,
    SensorData
} from "./types"

const sql = postgres(process.env.POSTGRES_URL!)

// temporary fetching
// export function fetchPatches() {
//     return patches
// }

// export function fetchLatestSensorsData() {
//     return sensors
// }

// grab the latest data from each sensor type
export async function fetchLatestSensorsData() {
    try {
        const data = await sql<LatestSensorsList[]>`
            SELECT DISTINCT ON (s.name)
            s.name,            
            m.value
            FROM metric m
            JOIN sensor s ON m.sensor_id = s.id
            ORDER BY s.name, m.timestamp DESC;
        `
        return data;
    } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
    }
}

// grab all data from sensors from the past deployment
export async function fetchSensorsData() {
    try {
        // fetch all sensor data from past 3 days
        const data = await sql<SensorData[]>`
            SELECT s.name, value, timestamp from metric m
            join sensor s on s.id = m.sensor_id
            where timestamp >= NOW() - interval '5 days'
            order by s.name, timestamp desc
        `

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

        // Convert to array of { name, data }
        return Object.entries(grouped).map(([name, data]) => ({ name, data }));
    } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
    }
}