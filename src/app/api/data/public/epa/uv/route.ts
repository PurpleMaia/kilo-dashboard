// UV Index hourly (based on Zip Code)
// https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/96795/JSON

// UV Index daily forecast for next day & any alerts for this forecast day
// https://data.epa.gov/efservice/getEnvirofactsUVDAILY/ZIP/96795/JSON

import { LocationData, SensorDataPoint } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET() {

    const response = await fetch('https://data.epa.gov/efservice/getEnvirofactsUVHOURLY/ZIP/96795/JSON', {
        headers: { "Accept": "application/json" }
    })

    const raw_data = await response.json()

    const site_name = 'EPA UV Index'

    const data: Record<string, SensorDataPoint[]> = {}

    const dataPoints: SensorDataPoint[] = []
    for (const data_point of raw_data) {        
        const timestamp: string = data_point.DATE_TIME
        const value = Number(data_point.UV_VALUE)

        dataPoints.push({
            timestamp: timestamp,
            value: value
        })
    }

    data['UV Index'] = dataPoints

    const locationData: LocationData = {
        siteName: site_name,
        data: data
    }

    return NextResponse.json(locationData)


}