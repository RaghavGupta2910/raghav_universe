import { NextResponse } from 'next/server';
import { buildSpotifyAuthUrl, getSpotifyCredentials, getAppBaseUrl } from '@/lib/spotify/auth';
import { createAndStoreOAuthState } from '@/lib/spotify/stateStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { clientId } = getSpotifyCredentials();
    if (!clientId) {
      return NextResponse.json(
        {
          error: 'Spotify Client ID not configured',
          message: 'Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in environment variables',
        },
        { status: 500 }
      );
    }

    const state = createAndStoreOAuthState();
    const authUrl = buildSpotifyAuthUrl(state);

    const response = NextResponse.redirect(authUrl);
    const baseUrl = getAppBaseUrl();
    const isHttps = baseUrl.startsWith('https') || process.env.NODE_ENV === 'production';

    response.cookies.set('spotify_auth_state', state, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown OAuth login error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
