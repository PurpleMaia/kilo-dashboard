import { cookies } from 'next/headers';
import { cache } from 'react';
import { validateSessionToken } from '../auth/utils';
import { User } from '../types';

interface AuthCache {
  user: User | null
  sessionToken: string
  timestamp: number
}

// globally-accessed server cache that persists its state
let authCache: AuthCache | null = null
const fetchAuth = async () => {
  const sessionCookie = (await cookies()).get('auth_session');

  // Wipe out cache if no session cookie found
  if (!sessionCookie) {
    console.log('No session cookie found, clearing cache...')
    authCache = null
    return null;
  }

  // custom catchers to invalidate the authCache
  const currentSessionToken = sessionCookie.value
  const shouldInvalidate = 
    !authCache ||  // cache is cleared
    authCache.sessionToken !== currentSessionToken // session changed

  // set authCache based on valid session
  if (shouldInvalidate) {
    try {
      const sessionValidation = await validateSessionToken(currentSessionToken);
      if (sessionValidation.user) {
        console.log('Session validation for:', sessionValidation.user.id)
        authCache = {
          user: sessionValidation.user,
          sessionToken: sessionCookie.value,
          timestamp: Date.now()
        }
      }
    } catch (error) {
      console.error('Session validation failed:', error);
    }
  } else {
    console.log('Using cached user data...')
  }

  return authCache?.user || null;
};

/**
 * @returns {User} User data (including aina) stored in cache
 */
export const getUserDataFromServer = async (): Promise<User | null> =>  {
  const authData = await getAuthServerCache();
  return authData
};

/**
 * Sets the server-side user cache
 * @param {User} user 
 * @param {string} sessionToken 
 */
export const setServerCache = (user: User, sessionToken: string) => {
  authCache = {
    user,
    sessionToken,
    timestamp: Date.now()
  }
}

/**
 * Manually clears the server cache by setting it to null
 */
export const clearServerCache = () => {
  authCache = null
}

export const getAuthServerCache = cache(fetchAuth)