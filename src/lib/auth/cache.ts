import { cookies } from 'next/headers';
import { cache } from 'react';
import { SessionValidationResult, validateSessionToken } from './utils';

const fetchAuth = async (): Promise<SessionValidationResult> => {
  const sessionCookie = (await cookies()).get('auth_session');
  if (!sessionCookie) {
    return { user: null, session: null };
  }

  try {
    const sessionValidation = await validateSessionToken(sessionCookie.value);
    if (sessionValidation.user) {
      return sessionValidation;
    }
  } catch (error) {
    console.error('Session validation failed:', error);
  }

  return { user: null, session: null };
};

export const getUser = async () => {
  const authData = await getAuthServerCache();
  return authData.user;
};

export const getAuthServerCache = cache(fetchAuth)