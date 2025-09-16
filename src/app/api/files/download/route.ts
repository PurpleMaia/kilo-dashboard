import { NextResponse } from 'next/server';
import { db } from '../../../../../db/kysely/client';
import { sql } from 'kysely';
import { recentTests } from '../../../../../data/sample_data';


export async function GET() {
    try {        
        // const userID = await getUserID();
        // const ainaID = await getAinaID(userID);

        // subquery to get the latest values and timestamp
        const recentReadingsByMetricType = await db
            .with('ranked_metrics', (db) =>
            db
                .selectFrom('metric as m')
                .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
                .innerJoin('mala as ma', 'ma.id', 'm.mala_id')
                .innerJoin('aina as a', 'a.id', 'ma.aina_id')
                .innerJoin('sensor as s', 's.id', 'm.sensor_id')
                .select([
                'm.value',
                'm.timestamp',
                'ma.name as mala_name',
                'mt.type_name as metric_type',
                's.name as sensor_name',
                sql<number>`ROW_NUMBER() OVER (
                    PARTITION BY m.metric_type, m.mala_id 
                    ORDER BY m.timestamp ASC
                )`.as('rn')
                ])
                .where('a.id', '=', 2)
            )
            .selectFrom('ranked_metrics')
            .selectAll()
            .where('rn', '<=', 5)      
            .where((eb) => 
                eb.or([
                    eb('mala_name', '=', 'Top Loʻi Patch')
                    , eb('mala_name', '=', 'Mid Patch (Awa)')
                    , eb('mala_name', '=', 'Bottom Patch')                        
                ])                                        
            )
            .orderBy(['metric_type', 'rn'])
            .execute();

        const sensorData: SensorData[] = recentReadingsByMetricType.map((item) => ({
            name: item.sensor_name ?? '',
            location: item.mala_name ?? '',
            latestValue: item.value ?? '',
            metricType: item.metric_type ?? '',
            unit: '', // Add logic to fetch unit if available
            category: '', // Add logic to fetch category if available
            timestamp: item.timestamp ? item.timestamp.toISOString() : '',
        }));
        const csvContent = convertDataToCSV(sensorData);
        const jsonContent = convertDataToJSON(recentTests);
        // const pdfContent = convertSamplesToPDF(recentTests);
                
        const exportData = {
            sensorData: csvContent,
            sampleTests: jsonContent,
            // sampleTestsPDF: pdfContent,
        };
        
        const response = new NextResponse(JSON.stringify(exportData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        return response;
    } catch (error) {
        console.error('Export error:', error);
        return NextResponse.json(
            { error: 'Failed to export data' },
            { status: 500 }
        );
    }
}

interface SensorData {
    name: string;
    location: string;
    latestValue: string | number;
    metricType: string;
    unit: string;
    category: string;
    timestamp: string;
}

function convertDataToCSV(data: SensorData[]): string {
    if (!data || data.length === 0) {
        return 'No data available';
    }

    // Create CSV headers based on the data structure
    const headers = ['Sensor Name', 'Location', 'Latest Value', 'Metric Type', 'Unit', 'Category', 'Timestamp'];
    let csvContent = headers.join(',') + '\n';

    // Add data rows
    data.forEach((sensor) => {
        const row = [            
            `"${sensor.name}"`,
            `"${sensor.location}"`,
            `"${sensor.latestValue}"`,
            `"${sensor.metricType}"`,
            `"${sensor.unit}"`,
            `"${sensor.category}"`,
            `"${sensor.timestamp}"`,
        ];
        csvContent += row.join(',') + '\n';
    });

    return csvContent;
}


function convertDataToJSON(data: object) {
    return JSON.stringify(data, null, 2);
}