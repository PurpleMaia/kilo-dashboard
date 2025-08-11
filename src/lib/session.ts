import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const sessionCookieName = 'auth_session';

export async function setSessionTokenCookie(response: NextResponse, token: string): Promise<NextResponse<unknown>> {
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    response.cookies.set(sessionCookieName, token, {
        httpOnly: true,
        sameSite: "lax",
        expires: expiresAt,
        path: "/"
    });

    return response
}

export async function deleteSessionTokenCookie(): Promise<void> {
    (await cookies()).set(sessionCookieName, "", {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 0,
        path: "/"
    });
}

