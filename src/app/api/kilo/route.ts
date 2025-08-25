import { getAuthData, getUserID } from '@/lib/server-utils'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '../../../../db/kysely/client'

// Server-side validation schema
const kiloSchema = z.object({
    observation: z.string().max(2000),
    timestamp: z.string().datetime().optional(),
})

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const observation = kiloSchema.parse(body)

        const user_id = await getUserID()

        if (!user_id) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            )
        }

        const data = {
            user_id,
            ...observation
        }

        const result = await db.insertInto('kilo')
            .values(data)
            .executeTakeFirstOrThrow()

        console.log('Saving observation:', data)

        return NextResponse.json({
            success: true,
            message: "Successfully inserted kilo into database"
        })
    } catch (error) {
        console.error('API Error:', error)

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                },
                { status: 400 }
            )
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        const { userID, ainaID } = await getAuthData()

        const recentObservations = await db.selectFrom('kilo')
            .innerJoin('user', 'user.id', 'kilo.user_id')
            .innerJoin('profile', 'profile.user_id', 'kilo.user_id')
            .innerJoin('aina', 'aina.id', 'profile.aina_id')
            .select(['kilo.id', 'user.username', 'kilo.observation', 'kilo.timestamp'])
            .where('aina.id', '=', ainaID)
            .limit(3)
            .execute()

        console.log('fetched:', recentObservations)

        return NextResponse.json({
            success: true,
            data: recentObservations
        })
    } catch (error) {
      console.error('GET API Error:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to fetch observations' },
            { status: 500 }
        )
    }
    
}