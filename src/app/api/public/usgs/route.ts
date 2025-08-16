/**
 * Map of all USGS Survey Stations:
 * https://waterdata.usgs.gov/state/Hawaii/
 * 
 * Discharge: 00060
 * Gage Height: 00065
 * Water Temperature: 00010
 * 
 * Each public monitoring site varies on what metrics they survey
 * 
 * Waimanalo Str Survery Station retrieves (16249000):
 * - Gage height, feet
 * - Discharge, cubic feet per second
 * - 0 nu Count of samples collected by autosampler, number
 * - 6.0 FNU Turbidity, water, unfiltered, monochrome near ...
 * 
 * Example: Get most recent value for Gage Height at Waimanalo Str
 * https://waterservices.usgs.gov/nwis/iv/?sites=16249000&agencyCd=USGS&parameterCd=00065&format=json
 * - within a span of a day append:
 *    &period=P1D
 * 
 * For now, this GET function retrieves only Discharge (Streamflow) & Gage Height
 */

import { LocationData, SensorDataPoint } from "@/lib/types";
import { NextResponse } from "next/server";
export async function GET() {

    const response = await fetch('https://waterservices.usgs.gov/nwis/iv/?sites=16249000&agencyCd=USGS&parameterCd=00060,00065&format=json&period=P1D', {
        headers: { "Accept": "application/json" }
    })  

    const json = await response.json()

    // retrieve raw data points from json
    const raw_metrics = json.value.timeSeries    

    // store site name for indexing
    const site_name = raw_metrics[0].sourceInfo.siteName
    
    // parse json for only necessary data to graph
    const data: Record<string, SensorDataPoint[]> = {}
    for (let metric of raw_metrics) {

        const metricType: string = metric.variable.variableName.replace(/, \w+.*$/, '')
        const raw_data = metric.values[0].value

        let dataPoints: SensorDataPoint[] = []
        for (let data_point of raw_data) {
            const timestamp: string = data_point.dateTime
            const value = Number(data_point.value)

            dataPoints.push({
                timestamp: timestamp,
                value: value
            })
        }
                
        data[metricType] = dataPoints
    }

    const locationData: LocationData = {
        siteName: site_name,
        data: data
    }

    return NextResponse.json(locationData)
}