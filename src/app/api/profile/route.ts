import { NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { getUserID } from '@/app/lib/server-utils';

export async function GET(request: Request) {
    const userID = await getUserID()
    try {
        const result = await db
        .selectFrom('user as u')
        .leftJoin('profile as p', 'p.user_id', 'u.id')
        .leftJoin('aina as a', 'p.aina_id', 'a.id')
        .select([
            'u.username',
            'u.email',
            'u.created_at',
            'p.role',
            'a.name as aina_name',
        ])
        .where('u.id', '=', userID)
        .executeTakeFirst();
        const needsAinaSetup = !result?.aina_name

        console.log("needsAinaSetup:", needsAinaSetup)

        return NextResponse.json({
            username: result?.username ?? null,
            email: result?.email ?? null,
            created_at: result?.created_at ?? null,
            role: result?.role ?? null,
            aina_name: result?.aina_name ?? null,
            needsAinaSetup,
          });
    } catch {
        return NextResponse.json(
            { error: 'Unable to fetch user data' },
            { status: 401 }
        );
    }
}