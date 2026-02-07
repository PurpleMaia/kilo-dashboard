/**
 * OAuth Authentication Module
 *
 * This module handles OAuth 2.0 authentication using the Arctic library.
 * Arctic handles the OAuth protocol details (authorization URLs, token exchange, etc.)
 * while we maintain control over user creation, account linking, and session management.
 *
 * Educational Notes:
 * - OAuth 2.0 is an authorization framework that lets users grant limited access
 *   to their resources on one site to another site without sharing passwords
 * - The flow: Authorization Request → User Consent → Authorization Code → Token Exchange → Access Token
 * - State parameter prevents CSRF attacks by ensuring the callback matches the request
 */

import { Google, generateCodeVerifier, generateState } from "arctic";

// Initialize Google OAuth provider
// Arctic handles: authorization URL generation, PKCE, token exchange
const google = new Google(
    process.env.GOOGLE_CLIENT_ID || "",
    process.env.GOOGLE_CLIENT_SECRET || "",
    process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"
);

/**
 * Generate a cryptographically secure random state parameter using Arctic's built-in function.
 * 
 * The state parameter is used to prevent CSRF attacks:
 * 1. We generate a random string and store it in the user's session/cookie
 * 2. We include it in the OAuth authorization URL
 * 3. Google returns it unchanged in the callback
 * 4. We verify the returned state matches what we stored
 *
 * This ensures the callback actually came from OUR authorization request,
 * not from a malicious site trying to trick the user
 */
export { generateState };

/**
 * Generate a cryptographically secure PKCE code verifier using Arctic's built-in function.
 *
 * PKCE (Proof Key for Code Exchange) adds an extra layer of security:
 * 1. We generate a random code verifier and store it securely
 * 2. We send a hash (code challenge) of it to the authorization endpoint
 * 3. When exchanging the code for tokens, we send the original verifier
 * 4. The server verifies the verifier matches the challenge
 *
 * This prevents authorization code interception attacks.
 */
/**
 * Generates a cryptographically secure PKCE code verifier for OAuth.
 * This function is re-exported from the Arctic library.
 */
export { generateCodeVerifier };

/**
 * Get the Google OAuth authorization URL
 *
 * This is step 1 of the OAuth flow:
 * - User clicks "Sign in with Google"
 * - We redirect them to this URL
 * - Google shows consent screen
 * - User approves
 * - Google redirects back to our callback URL with authorization code
 *
 * @param state - CSRF protection token (should be stored in cookie)
 * @param codeVerifier - PKCE code verifier (should be stored in cookie)
 * @returns Authorization URL to redirect user to
 */
export async function getGoogleAuthorizationUrl(state: string, codeVerifier: string): Promise<string> {
    // Arctic generates the full authorization URL with:
    // - client_id: identifies our application to Google
    // - redirect_uri: where Google sends user after consent
    // - scope: what data we're requesting (profile, email)
    // - state: CSRF protection token
    // - PKCE parameters: code_challenge derived from codeVerifier
    const url = google.createAuthorizationURL(state, codeVerifier, ["openid", "profile", "email"]);
    return url.toString();
}

/**
 * Exchange authorization code for access token and fetch user info
 *
 * This is step 2 of the OAuth flow:
 * - Google redirected user to our callback with authorization code
 * - We exchange that code for an access token (server-to-server)
 * - We use the access token to fetch user profile information
 *
 * @param code - Authorization code from Google callback
 * @param codeVerifier - PKCE code verifier (retrieved from cookie)
 * @returns User information from Google
 */
export async function validateGoogleAuthorizationCode(code: string, codeVerifier: string) {
    // Arctic handles the token exchange:
    // - Sends authorization code to Google's token endpoint
    // - Includes the code_verifier for PKCE verification
    // - Receives access token and ID token
    // - Validates tokens
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);

    // Fetch user information using the access token
    // Google's userinfo endpoint returns: id, email, name, picture, etc.
    const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
            Authorization: `Bearer ${tokens.accessToken()}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch user information from Google");
    }

    const googleUser = await response.json() as GoogleUser;
    return googleUser;
}

/**
 * Google user information structure
 *
 * This is what Google returns from the userinfo endpoint.
 * We use this to create/link user accounts in our database.
 */
export interface GoogleUser {
    sub: string;           // Google's unique user ID (use this as provider_user_id)
    email: string;         // User's email address
    email_verified: boolean; // Whether Google verified the email
    name: string;          // Full name
    given_name?: string;   // First name
    family_name?: string;  // Last name
    picture?: string;      // Profile picture URL
}

export { google };
