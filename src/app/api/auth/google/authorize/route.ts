/**
 * Google OAuth Authorization Endpoint
 *
 * This endpoint starts the OAuth flow:
 * 1. User clicks "Sign in with Google" button
 * 2. Browser makes GET request to this endpoint
 * 3. We generate a state parameter (CSRF protection)
 * 4. We store state in a cookie
 * 5. We redirect user to Google's consent screen
 * 6. User approves (or denies)
 * 7. Google redirects to our callback endpoint with authorization code
 *
 * Educational Notes:
 * - The state parameter prevents CSRF attacks
 * - We use a cookie (not session storage) because the user will be redirected to Google
 * - The redirect to Google is what actually starts the OAuth flow
 */

import { NextResponse } from "next/server";
import { generateState, generateCodeVerifier, getGoogleAuthorizationUrl } from "@/lib/auth/oauth";
import { cookies } from "next/headers";

export async function GET() {
    try {
        // Step 1: Generate random state parameter for CSRF protection
        const state = generateState();

        // Step 2: Generate PKCE code verifier for additional security
        const codeVerifier = generateCodeVerifier();

        // Step 3: Generate Google authorization URL with state and code verifier
        // Arctic includes: client_id, redirect_uri, scope, state, PKCE code_challenge
        const authorizationUrl = await getGoogleAuthorizationUrl(state, codeVerifier);

        // Step 4: Store state and code verifier in cookies so we can verify/use them in the callback
        const cookieStore = await cookies();
        cookieStore.set("google_oauth_state", state, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10, // 10 minutes
            path: "/",
        });
        cookieStore.set("google_oauth_code_verifier", codeVerifier, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 10, // 10 minutes
            path: "/",
        });

        // Step 5: Redirect user to Google's consent screen        
        // After consent, Google redirects to: /api/auth/google/callback?code=XXX&state=YYY
        return NextResponse.redirect(authorizationUrl);
    } catch (error) {
        console.error("Error generating Google authorization URL:", error);

        // If something goes wrong, redirect back to login with error message
        const loginUrl = new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
        loginUrl.searchParams.set("error", "oauth_error");
        return NextResponse.redirect(loginUrl);
    }
}
