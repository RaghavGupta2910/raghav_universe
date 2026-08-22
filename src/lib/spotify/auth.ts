export const SPOTIFY_SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-top-read',
  'user-read-recently-played',
].join(' ');

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
  error?: string;
  error_description?: string;
}

function cleanEnv(val?: string): string {
  if (!val) return '';
  return val.trim().replace(/^["']|["']$/g, '');
}

export function getSpotifyCredentials() {
  const clientId =
    cleanEnv(process.env.SPOTIFY_CLIENT_ID) ||
    cleanEnv(process.env['SPOTIFY_CLIENT_ID ']);
  const clientSecret =
    cleanEnv(process.env.SPOTIFY_CLIENT_SECRET) ||
    cleanEnv(process.env['SPOTIFY_CLIENT_SECRET ']);

  let redirectUri =
    cleanEnv(process.env.SPOTIFY_REDIRECT_URI) ||
    cleanEnv(process.env['SPOTIFY_REDIRECT_URI ']);

  if (!redirectUri) {
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      redirectUri = `https://${cleanEnv(process.env.VERCEL_PROJECT_PRODUCTION_URL)}/api/spotify/callback`;
    } else if (process.env.VERCEL_URL) {
      redirectUri = `https://${cleanEnv(process.env.VERCEL_URL)}/api/spotify/callback`;
    } else if (process.env.NODE_ENV === 'production') {
      redirectUri = 'https://raghav-universe.vercel.app/api/spotify/callback';
    } else {
      redirectUri = 'http://127.0.0.1:3000/api/spotify/callback';
    }
  }

  return { clientId, clientSecret, redirectUri };
}

export function getAppBaseUrl(): string {
  const { redirectUri } = getSpotifyCredentials();
  try {
    return new URL(redirectUri).origin;
  } catch {
    return process.env.NODE_ENV === 'production'
      ? 'https://raghav-universe.vercel.app'
      : 'http://127.0.0.1:3000';
  }
}

export function buildSpotifyAuthUrl(state: string): string {
  const { clientId, redirectUri } = getSpotifyCredentials();

  if (!clientId) {
    throw new Error('SPOTIFY_CLIENT_ID is not configured in environment variables.');
  }

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope: SPOTIFY_SCOPES,
    redirect_uri: redirectUri,
    state,
    show_dialog: 'true',
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export async function exchangeSpotifyCode(code: string): Promise<SpotifyTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getSpotifyCredentials();

  if (!clientId || !clientSecret) {
    throw new Error('Spotify Client ID or Client Secret is missing.');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    cache: 'no-store',
    signal: AbortSignal.timeout(6000),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error('Spotify token exchange failed:', json.error_description || json.error);
    throw new Error(json.error_description || json.error || 'Failed to exchange authorization code');
  }

  return json;
}

export async function refreshSpotifyToken(refreshToken: string): Promise<SpotifyTokenResponse> {
  const { clientId, clientSecret } = getSpotifyCredentials();

  if (!clientId || !clientSecret) {
    throw new Error('Spotify Client ID or Client Secret is missing.');
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
    cache: 'no-store',
    signal: AbortSignal.timeout(6000),
  });

  const json = await res.json();

  if (!res.ok) {
    console.error('Spotify token refresh failed:', json.error_description || json.error);
    throw new Error(json.error_description || json.error || 'Failed to refresh Spotify token');
  }

  return json;
}
