import { db } from '../../../../../db/kysely/client';
import { getAuthData } from '@/lib/server-utils';
import { NextResponse } from 'next/server';
import { sql } from 'kysely';


export async function GET() {
    const authData = await getAuthData()
    const ainaID = authData.ainaID
    if (ainaID) {
        try {        
            const sensors = await db
            .selectFrom('sensor as s')
            .innerJoin('metric as m', 'm.sensor_id', 's.id')
            .innerJoin('metric_type as mt', 'mt.id', 'm.metric_type')
            .innerJoin('mala as ma', 'ma.id', 'm.mala_id')
            .innerJoin('aina as a', 'a.id', 'ma.aina_id')
            .select([
                's.id as id',
                's.name as name',
                'mt.type_name as typeName',
                'mt.unit as unit',
                'mt.category as category',
                sql<string>`string_agg(distinct ma.name, ', ' ORDER BY ma.name)`.as('locations'),
            ])
            .groupBy([
                's.id',
                's.name',
                'mt.type_name',
                'mt.unit',
                'mt.category',
            ])
            .orderBy('s.name')
            .where('a.id', '=', ainaID)
            .execute();

            return NextResponse.json({ sensors });
        } catch {
            return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
        }
    } else {
        return NextResponse.json({error: 'No Aina'}, {status: 401})
    }
} 