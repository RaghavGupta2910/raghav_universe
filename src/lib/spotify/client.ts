import { cookies } from 'next/headers';
import { refreshSpotifyToken } from './auth';
import { loadServerSession, saveServerSession, clearServerSession } from './session';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

/**
 * Retrieves a valid access token from cookies, local file session, or environment,
 * automatically refreshing the access token when expired.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const now = Date.now();

  // 1. Try reading from cookies
  let accessTokenCookie: string | undefined;
  let refreshTokenCookie: string | undefined;
  let expiresAtCookie: string | undefined;

  try {
    const cookieStore = await cookies();
    accessTokenCookie = cookieStore.get('spotify_access_token')?.value;
    refreshTokenCookie = cookieStore.get('spotify_refresh_token')?.value;
    expiresAtCookie = cookieStore.get('spotify_expires_at')?.value;
  } catch {
    // cookies() may not be available in non-request contexts
  }

  // 2. Try reading from persistent server file session
  const fileSession = loadServerSession();

  const accessToken = accessTokenCookie || fileSession?.accessToken;
  const refreshToken =
    refreshTokenCookie ||
    fileSession?.refreshToken ||
    process.env.SPOTIFY_REFRESH_TOKEN;
  const expiresAt = expiresAtCookie
    ? parseInt(expiresAtCookie, 10)
    : fileSession?.expiresAt || 0;

  // 3. If access token is present and valid for at least another 60 seconds
  if (accessToken && expiresAt > now + 60000) {
    return accessToken;
  }

  // 4. If access token is missing or expired, attempt seamless token refresh
  if (refreshToken) {
    console.log('refresh attempted: YES');
    try {
      const refreshed = await refreshSpotifyToken(refreshToken);
      if (refreshed.access_token) {
        const newExpiresAt = now + refreshed.expires_in * 1000;
        const newRefreshToken = refreshed.refresh_token || refreshToken;

        // Persist refreshed tokens to disk session
        saveServerSession({
          accessToken: refreshed.access_token,
          refreshToken: newRefreshToken,
          expiresAt: newExpiresAt,
          scope: refreshed.scope,
        });

        return refreshed.access_token;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.includes('invalid_grant') || msg.includes('revoked')) {
        console.warn('Spotify refresh token invalid or revoked. Clearing session.');
        clearServerSession();
      }
      return null;
    }
  } else {
    console.log('refresh attempted: NO');
  }

  return null;
}

/**
 * Performs an authenticated request to Spotify's Web API with a strict 5-second timeout
 */
export async function spotifyGet<T>(endpoint: string, accessToken: string): Promise<T | null> {
  const url = endpoint.startsWith('http') ? endpoint : `${SPOTIFY_API_BASE}${endpoint}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  });

  if (!res.ok) {
    if (res.status === 401) {
      return null;
    }
    const errText = await res.text();
    throw new Error(`Spotify API ${endpoint} failed (${res.status}): ${errText}`);
  }

  return (await res.json()) as T;
}
