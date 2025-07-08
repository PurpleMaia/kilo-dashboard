import { NextResponse } from 'next/server';
import { db } from '../../../../../db/kysely/client';
import { getUserID } from '@/app/lib/server-utils';

export async function POST(request: Request) {
    try {
        const form = await request.formData();
        const finalAina = form.get('finalAina') as string;
        const selectedAina = form.get('selectedAina') as string;
        const customAina = form.get('customAina') as string;
        
        console.log('finalAina:', finalAina);
        console.log('selectedAina:', selectedAina);
        console.log('customAina:', customAina);
        
        const userID = await getUserID()
        console.log('User ID from session:', userID);
        
        const selectedAinaValue = finalAina || selectedAina;
        console.log('Selected aina value:', selectedAinaValue);
        const ainaID = await getAinaID(customAina, selectedAina)

        // Save the selected aina to the database with the user ID
        await db.insertInto('profile')
            .values({ 
                user_id: userID, 
                role: '', // TODO will implement role system here later
                aina_id: ainaID
            })
            .execute();
        
        return NextResponse.json({ 
            success: true, 
            aina: selectedAinaValue,            
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { error: 'Registration failed' },
            { status: 500 }
        );
    }
}

async function getAinaID(customAina: string, selectedAina: string): Promise<number> {    
    if (!customAina) {
        return parseInt(selectedAina) // user selected the aina
    } else { 
        // Check if custom aina already exists
        const existingAina = await db
            .selectFrom('aina')
            .select(['id', 'name'])
            .where('name', 'ilike' , `%${customAina}%`)
            .executeTakeFirst()
            
        if (existingAina) {
            return existingAina.id // use existing aina
        }                
        
        try {
            const inserted = await db
                .insertInto('aina')
                .values({
                    name: customAina,
                    created_at: new Date(),
                })
                .returning('id')
                .executeTakeFirst()
                
            if (!inserted) {
                throw new Error('Failed to insert aina')
            }
                
            return inserted.id// user inserted their own
        } catch (error) {
            console.error('Error inserting aina:', error)
            throw error
        }
    }
}