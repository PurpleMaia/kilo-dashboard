// lib/auth-server.ts - Server-side auth with caching
import { cookies } from 'next/headers';
import { cache } from 'react';
import { getAinaID } from '../server-utils';
import { validateSessionToken } from './utils';

export interface AuthData {
  user: {
    id: string;
    username: string;
    email: string;
    email_verified: boolean;
  } | null;
  session: {
    id: string;
    user_id: string;
    expiresAt: Date;
  } | null;
  aina: number | null;
}

const fetchAuth = async (): Promise<AuthData> => {
  const sessionCookie = (await cookies()).get('auth_session');
  if (!sessionCookie) {
    return { user: null, session: null, aina: null };
  }

  try {
    const sessionValidation = await validateSessionToken(sessionCookie.value);
    if (sessionValidation.user) {
      const aina = await getAinaID(sessionValidation.user.id);
      return { ...sessionValidation, aina };
    }
  } catch (error) {
    console.error('Session validation failed:', error);
  }

  return { user: null, session: null, aina: null };
};


const getCurrentUser = async () => {
  const authData = await getAuth();
  return authData.user;
};

const getCurrentAina = async () => {
  const authData = await getAuth();
  return authData.aina;
}

export const getAuth = cache(fetchAuth)
export const getUser = cache(getCurrentUser);
export const getAina = cache(getCurrentAina);