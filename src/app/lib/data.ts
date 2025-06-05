import postgres from 'postgres'
// import { patches, sensors } from "./temp-data"
import {
    LatestSensorsList,
} from "./types"

const sql = postgres(process.env.POSTGRES_URL!)

// temporary fetching
// export function fetchPatches() {
//     return patches
// }

// export function fetchLatestSensorsData() {
//     return sensors
// }

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