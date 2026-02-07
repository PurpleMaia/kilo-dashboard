import { LocationData, SensorDataPoint } from "@/lib/types";
import { NextResponse } from "next/server";
export async function GET() {

    // const siteID = '16249000' // Waimanalo Stream
    const siteID = '16701800' // Wailuku River in Hilo
    const parameterCodes = ['00060', '00065'] // Discharge, Gage Height
    const period = 'PT12H' // past 12 hours

    const response = await fetch(`https://waterservices.usgs.gov/nwis/iv/?sites=${siteID}&agencyCd=USGS&parameterCd=${parameterCodes.join(",")}&format=json&period=${period}`, {
        headers: { "Accept": "application/json" }
    })  

    const json = await response.json()

    // retrieve raw data points from json
    const raw_metrics = json.value.timeSeries    

    // store site name for indexing
    // const site_name = 'USGS Waimanalo Str'
    const site_name = 'USGS Wailuku River'
    // raw_metrics[0].sourceInfo.siteName
    
    // parse json for only necessary data to graph
    const data: Record<string, SensorDataPoint[]> = {}
    for (const metric of raw_metrics) {

        const metricType: string = metric.variable.variableName.replace(/, \w+.*$/, '')
        const raw_data = metric.values[0].value

        const dataPoints: SensorDataPoint[] = []
        for (const data_point of raw_data) {
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