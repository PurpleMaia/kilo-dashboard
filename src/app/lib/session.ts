import { cookies } from 'next/headers';

export const sessionCookieName = 'auth_session';

export async function setSessionTokenCookie(token: string): Promise<void> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    (await cookies()).set(sessionCookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });
}

export async function deleteSessionTokenCookie(): Promise<void> {
    (await cookies()).set(sessionCookieName, "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });
}

