import { cookies } from 'next/headers';
import { cache } from 'react';
import { User, validateSessionToken } from './utils';

const fetchAuth = async () => {
  const sessionCookie = (await cookies()).get('auth_session');
  if (!sessionCookie) {
    return null;
  }

  try {
    const sessionValidation = await validateSessionToken(sessionCookie.value);
    if (sessionValidation.user) {
      return sessionValidation.user;
    }
  } catch (error) {
    console.error('Session validation failed:', error);
  }

  return null;
};

export const getUserDataFromServer = async (): Promise<User | null> =>  {
  const authData = await getAuthServerCache();
  return authData
};

export const getAuthServerCache = cache(fetchAuth)