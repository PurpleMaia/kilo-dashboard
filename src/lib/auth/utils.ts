import { randomBytes, pbkdf2Sync, createHash, timingSafeEqual } from 'crypto';
import { db } from '../../db/kysely/client';
import { Session, User, Aina, LoginResponse } from '../types';

import * as base64 from 'hi-base64'

export function generateSessionToken(): string {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    const token = base64.encode(bytes).replace(/=+$/, '').toLowerCase();
    return token;
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export async function createSession(token: string, user_id: string): Promise<Session> {
    const sessionId = hashToken(token);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    
    await db.insertInto('usersession')
        .values({
            id: sessionId,
            user_id: user_id,
            expires_at: expiresAt
        })
        .execute();
        
    return { id: sessionId, user_id, expiresAt };
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = hashToken(token);
    const row = await db.selectFrom('usersession')
        .innerJoin('user', 'user.id', 'usersession.user_id')
        .innerJoin('profile', 'profile.user_id', 'user.id')
        .innerJoin('aina', 'profile.aina_id', 'aina.id')
        .select([
            'usersession.id as session_id',
            'usersession.user_id',
            'usersession.expires_at',
            'user.id as user_id',
            'user.username',
            'user.email',
            'user.email_verified',
            'aina.id as aina_id',
            'aina.name as aina_name',
            'aina.name as created_at',
        ])
        .where('usersession.id', '=', sessionId)
        .limit(1)
        .executeTakeFirst();
    // sql`SELECT user_session.id, user_session.user_id, user_session.expires_at, app_user.id FROM user_session INNER JOIN user ON app_user.id = user_session.user_id WHERE id = ${sessionId}`;
    if (!row) {
        return { session: null, user: null };
    }
    const session: Session = {
        id: row?.session_id || '',
        user_id: row?.user_id || '',
        expiresAt: new Date(row?.expires_at || ''),
    };
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
        // github_id: row?.github_id || '',
        // google_id: row?.google_id || '',
    };
    
    if (Date.now() >= session.expiresAt.getTime()) {
        await db.deleteFrom('usersession')
            .where('id', '=', session.id)
            .executeTakeFirst();
        return { session: null, user: null };
    }
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
        session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
        await db.updateTable('usersession')
            .set({
                expires_at: session.expiresAt
            })
            .where('id', '=', session.id)
            .executeTakeFirst();
    }
    return { user, session };
}

export async function invalidateSession(sessionId: string): Promise<void> {
    await db.deleteFrom('usersession')
        .where('id', '=', sessionId)
        .executeTakeFirst();
}

export async function invalidateAllSessions(userId: string): Promise<void> {
    await db.deleteFrom('usersession')
        .where('usersession.user_id', '=', userId)
        .executeTakeFirst();
}

export type SessionValidationResult =
    | { session: Session; user: User }
    | { session: null; user: null };

export function generateUserId(): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}

// hash password logic
const SALT_LENGTH = 16;
const HASH_ITERATIONS = 100_000;
const HASH_ALGO = 'sha256';
const HASH_LENGTH = 32;

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGO);
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  const testHash = pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_LENGTH, HASH_ALGO);
  return timingSafeEqual(hash, testHash);
}

// --- User Registration ---

export async function registerUser(username: string, email: string, password: string) {
  // Check if user exists
  const existing = await db.selectFrom('user').selectAll().where('username', '=', username).executeTakeFirst();
  if (existing) throw new Error('Username already taken');

  const password_hash = hashPassword(password);
  const id = randomBytes(12).toString('hex');

  const result = await db.insertInto('user').values({
    id,
    username,
    email,
    password_hash,
    email_verified: false,
  }).returning(['id', 'username', 'email', 'email_verified']).executeTakeFirst() 

  if (!result) {
    throw new Error('DB Insert failed')
  }

  const token = generateSessionToken();
  await createSession(token, result?.id);

  const user: User = {
    id: result.id,
    username: result.username,
    email: result.email,
    email_verified: result.email_verified,
    aina: null
  }

  return { user, token };
}

/**
 * Fetches user information from database, generates session token and inserts session to database 
 * @param {string} username
 * @param {string} password
 * @returns { LoginResponse } User object & session token
 */
export async function loginUser(username: string, password: string): Promise<LoginResponse> {
  const row = await db
    .selectFrom('user')
    .innerJoin('profile', 'profile.user_id', 'user.id')
    .innerJoin('aina', 'profile.aina_id', 'aina.id')
    .select([
      'aina.id as aina_id',
      'aina.name as aina_name',
      'aina.created_at',
      'user.id as user_id',
      'user.username',
      'user.email',
      'user.email_verified',
      'user.password_hash',
    ])
    .where('username', '=', username)
    .executeTakeFirst();

  if (!row) {
    throw new Error('DB Query failed')
  }

  const aina: Aina = {
    id: row.aina_id,
    name: row.aina_name || '',
    createdAt: new Date(row?.created_at || '')
  }
  const user: User = {
    id: row.user_id,
    username: row?.username || '',
    email: row?.email || '',
    email_verified: row?.email_verified || false,     
    aina: aina  
  };

  if (!user || !row?.password_hash) throw new Error('Invalid credentials');
  if (!verifyPassword(password, row?.password_hash)) throw new Error('Invalid credentials');

  // Generate session token and store session
  const token = generateSessionToken();
  await createSession(token, user.id);

  return { user, token };
}

