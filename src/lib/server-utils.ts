import { cookies } from "next/headers";
import { hashToken } from "./auth/utils";
import { User, Aina } from "./types";
import { db } from "../db/kysely/client";

export async function getUserID(): Promise<string> {
    // Get the session to find the user ID        
    const sessionCookie = (await cookies()).get('auth_session');
        
    if (!sessionCookie?.value) {
        throw Error('No session found')
    }
  
    // Hash the token from the cookie to match what's stored in the database
    const sessionId = hashToken(sessionCookie.value);
  
    console.log('sessionCookie', sessionCookie)
    console.log('sessionId', sessionId)
    
    // Get the user ID from the session
    const session = await db.selectFrom('usersession')
        .select(['user_id', 'expires_at'])
        .where('id', '=', sessionId)
        .executeTakeFirst();
        
    if (!session) {
        throw Error('No session found in db')
    }
    
    // Check if session is expired
    if (new Date() > new Date(session.expires_at)) {
        throw Error('Session expired')
    }
  
    const userId = session.user_id;
  
    return userId
  }
  
export async function getAinaID(userID: string): Promise<number> {

const result = await db.selectFrom('profile').select('aina_id').where('user_id', '=', userID).executeTakeFirst();
if (!result || result.aina_id == null) throw new Error('Aina ID not found');
return result.aina_id;
}

/**
 * Fetches necessary IDs for API calls userID & tied ainaID
 * @returns userID, ainaID | null
 */
export async function getAuthData(): Promise<{userID: string, ainaID: number | null}> {
    const sessionCookie = (await cookies()).get('auth_session');
    if (!sessionCookie?.value) {
        throw Error('No session found')
    }

    const sessionId = hashToken(sessionCookie.value);

    const result = await db
        .selectFrom('usersession as us')
        .innerJoin('profile as p', 'p.user_id', 'us.user_id')
        .select(['us.user_id', 'us.expires_at', 'p.aina_id'])
        .where('us.id', '=', sessionId)
        .executeTakeFirst();

    if (!result) {
        throw Error('Invalid session')
    }

    return {
        userID: result?.user_id,
        ainaID: result?.aina_id
    }
}

/**
 * Fetches user profile information based on the current session cookie
 * @returns {User | null} user data if found, if not then null
 */
export async function getUserData(): Promise<User | null> {
    const sessionCookie = (await cookies()).get('auth_session');
    if (!sessionCookie?.value) {
        return null
    }

    const sessionId = hashToken(sessionCookie.value);

    const row = await db
        .selectFrom('usersession as us')
        .innerJoin('user as u', 'u.id', 'us.user_id')
        .innerJoin('profile as p', 'p.user_id', 'u.id')
        .innerJoin('aina as a', 'a.id', 'p.aina_id')
        .select([
            'u.id as user_id',
            'u.username',
            'u.email',
            'u.email_verified',
            'us.expires_at',
            'a.id as aina_id',
            'a.name as aina_name',
            'a.created_at as created_at'
        ])
        .where('us.id', '=', sessionId)
        .executeTakeFirst();

    if (!row) {
        throw Error('Invalid session')
    }

    const aina: Aina = {
        id: row?.aina_id,
        name: row?.aina_name || '',
        createdAt: new Date(row?.created_at || '')
    }
    const user: User = {
        id: row?.user_id || '',
        username: row?.username || '',
        email: row?.email || '',
        email_verified: row?.email_verified || false, 
        aina: aina        
    };

    return user
}