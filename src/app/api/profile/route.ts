import { NextResponse } from 'next/server';
import { db } from '../../../../db/kysely/client';
import { getFromCache, setInCache } from '@/lib/data/cache';

export async function GET() {
    let user_info
    const CACHE_KEY = 'user_info'
    const cached = getFromCache(CACHE_KEY)

    if (cached) {
        console.log('found api/profile data in cache, using cache...')
        user_info = cached
        console.log(user_info)
        return NextResponse.json({ user_info })
    }

    console.log('api/profile not in cache, querying db...')

    try {
        const user = await getUser()
        if (!user) {
            return NextResponse.json(
                { error: 'User not authenticated' },
                { status: 401 }
            );
        }
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
        .where('u.id', '=', user?.id)
        .executeTakeFirst();
        const needsAinaSetup = !result?.aina_name

        user_info = {
            username: result?.username ?? null,
            email: result?.email ?? null,
            created_at: result?.created_at ?? null,
            role: result?.role ?? null,
            aina_name: result?.aina_name ?? null,
            needsAinaSetup,
          }

          setInCache(CACHE_KEY, user_info, 1000 * 60 * 30)
        
        console.log(user_info)

        return NextResponse.json({ user_info });
    } catch {
        return NextResponse.json(
            { error: 'Unable to fetch user data' },
            { status: 401 }
        );
    }
}