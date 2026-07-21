/**
 * Spotify OAuth (PKCE) — connect the user's Spotify account.
 *
 * Track 2 — Backend / Data. Linear: TOP-15.
 * TODO(TOP-15): implement the Authorization Code + PKCE flow with
 * `expo-auth-session` / `expo-web-browser`. Store/refresh tokens securely
 * (recommend `expo-secure-store` — list as a dependency, do not install here).
 *
 * Requires env: SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI (see .env.example).
 */

export interface SpotifyAuthState {
  isConnected: boolean;
  accessToken?: string;
  expiresAt?: number;
}

/** Kick off the OAuth flow. Returns the resulting auth state. */
export async function connectSpotify(): Promise<SpotifyAuthState> {
  // TODO(TOP-15): open the Spotify authorize URL and exchange the code.
  throw new Error('connectSpotify not implemented (TOP-15)');
}

/** Return a valid access token, refreshing if needed. */
export async function getAccessToken(): Promise<string> {
  // TODO(TOP-15): read from secure store, refresh when expired.
  throw new Error('getAccessToken not implemented (TOP-15)');
}

/** Clear stored tokens / disconnect. */
export async function disconnectSpotify(): Promise<void> {
  // TODO(TOP-15)
  throw new Error('disconnectSpotify not implemented (TOP-15)');
}
