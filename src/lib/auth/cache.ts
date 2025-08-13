import { cookies } from 'next/headers';
import { cache } from 'react';
import { User, validateSessionToken } from './utils';

const fetchAuth = async () => {
  console.log('- User data cache miss, querying db for user data...')
  const sessionCookie = (await cookies()).get('auth_session');
  if (!sessionCookie) {
    console.log('No session cookie found...')
    return null;
  }

  try {
    const sessionValidation = await validateSessionToken(sessionCookie.value);
    if (sessionValidation.user) {
      console.log('Session validation SUCCESS for:', sessionCookie.value)
      return sessionValidation.user;
    }
  } catch (error) {
    console.error('Session validation FAILED for:', error);
  }

  return null;
};

export const getUserDataFromServer = async (): Promise<User | null> =>  {
  const authData = await getAuthServerCache();
  return authData
};

export const getAuthServerCache = cache(fetchAuth)