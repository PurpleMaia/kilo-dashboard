import { db } from '../../../../../db/kysely/client';
import { getAinaID, getUserID } from '@/app/lib/server-utils';
import { sql } from 'kysely';
import { NextResponse } from 'next/server';

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

        // 2) join out to sensor and metric_type, filter to rn = 1
        const sensors = await db
        .selectFrom(rankedMetrics)
        .innerJoin('sensor as s', 's.id', 'm.sensor_id')
        .innerJoin('metric_type', 'metric_type.id', 'm.metric_type')
        .innerJoin('sensor_mala as sm', 'sm.sensor_id', 's.id')
        .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
        .innerJoin('aina as a', 'a.id', 'ma.aina_id')
        .select([
            's.name as name',
            'metric_type.type_name as typeName',
            'metric_type.unit',
            'metric_type.category',
            'm.value as latestValue',
            // 'm.timestamp as latestTimestamp',
            's.id',
        ])        
        .where((eb) =>
            eb('m.rn', '=', 1).and('a.id', '=', ainaID)
        )     
        .orderBy('s.name')
        .execute()    
        .then(results => {
            // Group by sensor name and take the first (latest) record for each
            const uniqueSensors = new Map();
            results.forEach(sensor => {
              if (!uniqueSensors.has(sensor.name)) {
                uniqueSensors.set(sensor.name, sensor);
              }
            });
            return Array.from(uniqueSensors.values());
          });

        console.log(sensors)

        return NextResponse.json({ sensors });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
} 