import { db } from '../../../../../db/kysely/client';
import { getAinaID, getUserID } from '@/app/lib/server-utils';
import { sql } from 'kysely';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const userID = await getUserID();
        const ainaID = await getAinaID(userID);

        const sensorCount = await db
            .selectFrom('sensor as s')
            .innerJoin('sensor_mala as sm', 's.id', 'sm.sensor_id')
            .innerJoin('mala as m', 'm.id', 'sm.mala_id')
            .innerJoin('aina as a', 'a.id', 'm.aina_id')
            .select(sql<number>`COUNT(DISTINCT s.name)`.as('count'))
            .where('a.id', '=', ainaID)
            .executeTakeFirstOrThrow();

        const latestFetch = await db
            .selectFrom('metric as m')
            .select('m.timestamp')
            .innerJoin('sensor_mala as sm', 'sm.sensor_id', 'm.sensor_id')
            .innerJoin('mala as ma', 'ma.id', 'sm.mala_id')
            .innerJoin('aina as a', 'a.id', 'ma.aina_id')
            .where('a.id', '=', ainaID)
            .orderBy('m.timestamp desc')
            .limit(1)
            .executeTakeFirstOrThrow();

        console.log(sensorCount, latestFetch)

        return NextResponse.json({ sensorCount, latestFetch });
    } catch {
        return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
    }
} 