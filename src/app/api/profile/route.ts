import { NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { getUserID } from '@/app/lib/server-utils';

export async function GET(request: Request) {
    const userID = await getUserID()
    try {
        const result = await db
        .selectFrom('user as u')
        .innerJoin('profile as p', 'p.user_id', 'u.id')
        .innerJoin('aina as a', 'p.aina_id', 'a.id')
        .select([
            'u.username',
            'u.email',
            'u.created_at',
            'p.role',
            'a.name',
        ])
        .where('u.id', '=', userID)
        .executeTakeFirst();

        console.log(result)

        return NextResponse.json(result)
    } catch {
        return NextResponse.json(
            { error: 'Unable to fetch user data' },
            { status: 401 }
        );
    }
}