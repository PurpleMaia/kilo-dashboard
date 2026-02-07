/**
 * Google OAuth Callback Endpoint
 *
 * This endpoint completes the OAuth flow:
 * 1. Google redirects user here with authorization code and state
 * 2. We verify the state matches (CSRF protection)
 * 3. We exchange authorization code for access token
 * 4. We fetch user info from Google
 * 5. We find or create user in our database
 * 6. We link OAuth account to user
 * 7. We create a session
 * 8. We redirect to dashboard
 *
 * Educational Notes:
 * - The authorization code is single-use and expires quickly (usually 10 minutes)
 * - Token exchange happens server-to-server (more secure than client-side)
 * - We store the Google user ID (sub) to identify the same user across logins
 * - Account linking allows users to login with Google OR password
 */

import { NextRequest, NextResponse } from "next/server";
import { validateGoogleAuthorizationCode } from "@/lib/auth/oauth";
import { cookies } from "next/headers";
import { db } from "@/db/kysely/client";
import { createSession } from "@/lib/auth/session";
import { fetchUserRole } from "@/lib/auth/login";
import { randomUUID } from "crypto";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    // URLs for redirects
    const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
    const dashboardUrl = new URL("/", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");

    try {
        // Step 1: Verify required parameters are present
        if (!code || !state) {
            console.error("[oauth/callback] Missing code or state parameter");
            loginUrl.searchParams.set("error", "missing_parameters");
            return NextResponse.redirect(loginUrl);
        }

        // Step 2: Verify state parameter matches (CSRF protection)
        // The state we stored when starting OAuth flow
        const cookieStore = await cookies();
        const storedState = cookieStore.get("google_oauth_state")?.value;
        const storedCodeVerifier = cookieStore.get("google_oauth_code_verifier")?.value;

        if (!storedState || storedState !== state) {
            console.error("[oauth/callback] State mismatch - possible CSRF attack");
            loginUrl.searchParams.set("error", "invalid_state");
            return NextResponse.redirect(loginUrl);
        }

        if (!storedCodeVerifier) {
            console.error("[oauth/callback] Missing code verifier - PKCE flow broken");
            loginUrl.searchParams.set("error", "missing_code_verifier");
            return NextResponse.redirect(loginUrl);
        }

        // Step 3: Delete OAuth cookies (single-use)
        cookieStore.delete("google_oauth_state");
        cookieStore.delete("google_oauth_code_verifier");

        console.log("[oauth/callback] Exchanging authorization code for tokens...");

        // Step 4: Exchange authorization code for access token and fetch user info
        // Arctic handles: sending code to Google with code_verifier, validating tokens
        const googleUser = await validateGoogleAuthorizationCode(code, storedCodeVerifier);

        console.log("[oauth/callback] Received user info from Google:", {
            sub: googleUser.sub,
            email: '[REDACTED]',
            name: googleUser.name,
        });

        // Step 5: Check if this Google account is already linked to a user
        const existingOAuthAccount = await db
            .selectFrom("oauth_accounts")
            .select(["user_id", "provider", "provider_user_id"])
            .where("provider", "=", "google")
            .where("provider_user_id", "=", googleUser.sub)
            .executeTakeFirst();

        let userId: string;

        if (existingOAuthAccount) {
            // Scenario A: This Google account is already linked - just log them in
            console.log("[oauth/callback] Existing OAuth account found, user_id:", existingOAuthAccount.user_id);
            userId = existingOAuthAccount.user_id;
        } else {
            // Step 6: Check if a user with this email already exists
            const existingUser = await db
                .selectFrom("users")
                .select(["id", "email", "username"])
                .where("email", "=", googleUser.email)
                .executeTakeFirst();

            if (existingUser) {
                // Scenario B: User exists with this email, link OAuth account to them
                console.log("[oauth/callback] User exists with email, linking OAuth account...");
                userId = existingUser.id;

                await db
                    .insertInto("oauth_accounts")
                    .values({
                        user_id: userId,
                        provider: "google",
                        provider_user_id: googleUser.sub,
                        email: googleUser.email,
                    })
                    .execute();

                console.log("[oauth/callback] OAuth account linked to existing user");
            } else {
                // Scenario C: New user - create user account and link OAuth account
                console.log("[oauth/callback] Creating new user account...");

                // Generate username from email (everything before @)
                // If username exists, append random suffix
                let username = googleUser.email.split("@")[0];
                const existingUsername = await db
                    .selectFrom("users")
                    .select("username")
                    .where("username", "=", username)
                    .executeTakeFirst();

                if (existingUsername) {
                    // Username taken, append random 4 digits
                    username = `${username}_${Math.floor(1000 + Math.random() * 9000)}`;
                }

                userId = randomUUID();

                // Create user account
                // OAuth users don't have passwords, so we use empty string
                // In production, you might want to use a random hash or NULL
                await db
                    .insertInto("users")
                    .values({
                        id: userId,
                        username: username,
                        email: googleUser.email,
                        password_hash: "", // OAuth users don't have password
                        system_role: "user",
                    })
                    .execute();

                // Link OAuth account to new user
                await db
                    .insertInto("oauth_accounts")
                    .values({
                        user_id: userId,
                        provider: "google",
                        provider_user_id: googleUser.sub,
                        email: googleUser.email,
                    })
                    .execute();

                console.log("[oauth/callback] New user created with linked OAuth account");
            }
        }

        // Step 7: Fetch user role (for multi-tenant support)
        const role = await fetchUserRole(userId);

        console.log("[oauth/callback] User role:", role || "no organization");

        // Step 8: Create session using existing session infrastructure
        // This uses the same session system as password-based login
        let response = NextResponse.redirect(dashboardUrl);
        response = await createSession(userId, "user", response);

        console.log("[oauth/callback] Session created, redirecting to dashboard");

        return response;
    } catch (error) {
        console.error("[oauth/callback] OAuth callback error:", error);

        // If anything goes wrong, redirect to login with error message
        loginUrl.searchParams.set("error", "oauth_failed");
        return NextResponse.redirect(loginUrl);
    }
}
