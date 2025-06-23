import postgres from 'postgres';
import { randomBytes, createHash, hash } from 'crypto';
import { db } from '../../../db/kysely/client';

import * as base64 from 'hi-base64'

const sql = postgres(process.env.DATABASE_URL!)

export interface Session {
  id: string;
  user_id: string;
  expiresAt: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
}

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
    await sql`INSERT INTO public.usersession (id, user_id, expires_at) VALUES (${sessionId}, ${user_id}, ${expiresAt})`;
    return { id: sessionId, user_id, expiresAt };
}

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
    const sessionId = hashToken(token);
    const row = await db.selectFrom('usersession')
        .innerJoin('user', 'user.id', 'usersession.user_id')
        .selectAll()
        .where('usersession.id', '=', sessionId)
        .executeTakeFirst();
    // sql`SELECT user_session.id, user_session.user_id, user_session.expires_at, app_user.id FROM user_session INNER JOIN user ON app_user.id = user_session.user_id WHERE id = ${sessionId}`;
    if (row === null) {
        return { session: null, user: null };
    }
    const session: Session = {
        id: row?.id || '',
        user_id: row?.user_id || '',
        expiresAt: new Date(row?.expires_at || ''),
    };
    const user: User = {
        id: row?.user_id || '',
        username: row?.username || '',
        email: row?.email || '',
        email_verified: row?.email_verified || false,
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
    return { session, user };
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

export interface Session {
    id: string;
    user_id: string;
    expiresAt: Date;
}

export interface User {
    id: string;
    username: string;
    email: string;
    email_verified: boolean;
    // github_id: string;
    // google_id: string;
}

export function generateUserId(): string {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);

    return Array.from(bytes, b => alphabet[b % alphabet.length]).join('');
}