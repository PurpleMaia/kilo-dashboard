// import postgres from 'postgres'

// const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })

// export async function fetchPatches() {
//     try {
        
//     }
// }
// TODO make definitions

// temporary fetching
import { patches, sensors } from "./temp-data"

export function fetchPatches() {
    return patches
}

export function fetchSensors() {
    return sensors
}

export function fetchDataFromSensorBasedOnTypeAndName(type: string, location: string){
    return {
        metrics: [
            {
                timestamp: 12,
                value: 12,
                type: 'soil'
            }
        ]
    }
}