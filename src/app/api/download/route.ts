import { NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { getAinaID, getUserID } from '@/app/lib/server-utils';
import { sql } from 'kysely';
import { recentTests } from '../../../../data/sample_data';


export async function GET() {
    try {        
        const userID = await getUserID();
        const ainaID = await getAinaID(userID);

        // subquery to get the latest values and timestamp
        const rankedMetrics = db
        .selectFrom('metric')
        .select([
            'metric.id', 'metric.sensor_id', 'metric.metric_type', 'metric.timestamp', 'metric.value',
            sql<number>`ROW_NUMBER() OVER (PARTITION BY metric.sensor_id, metric.metric_type ORDER BY metric.timestamp DESC)`.as('rn'),
        ])
        .as('m')

        // query on the latest values
        const sensors = await db
        .selectFrom(rankedMetrics)
        .innerJoin('sensor as s', 's.id', 'm.sensor_id')
        .innerJoin('metric_type', 'metric_type.id', 'm.metric_type')
        .innerJoin('sensor_mala as sm', 'sm.sensor_id', 's.id')
        .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
        .innerJoin('aina as a', 'a.id', 'ma.aina_id')
        .select([
            's.name as name',
            'ma.name as location',
            'm.value as latestValue',
            'metric_type.type_name as metricType',
            'metric_type.unit',
            'metric_type.category',
            'm.timestamp',
        ])        
        .where((eb) =>
            eb('m.rn', '>=', 1).and('m.rn', '<=', 5).and('a.id', '=', ainaID) // collecting latest 5 batches from each sensor (can edit from a couple days)
        )     
        .orderBy('s.name')
        .execute()    

        // Filter out null values
        const filteredSensors = sensors
            .filter(sensor => 
                sensor.name && sensor.location && sensor.metricType && sensor.timestamp
            )
            .map(sensor => ({
                name: sensor.name!,
                location: sensor.location!,
                latestValue: sensor.latestValue!,
                metricType: sensor.metricType!,
                unit: sensor.unit || '',
                category: sensor.category || '',
                timestamp: sensor.timestamp!.toISOString()
            }));
        
        const csvContent = convertDataToCSV(filteredSensors);
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