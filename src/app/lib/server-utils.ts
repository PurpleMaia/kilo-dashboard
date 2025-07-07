import { cookies } from "next/headers";
import { hashToken } from "./auth";
import { db } from "../../../db/kysely/client";

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