import { NextResponse } from 'next/server';
import { buildSpotifyAuthUrl, getSpotifyCredentials, getAppBaseUrl } from '@/lib/spotify/auth';
import { createAndStoreOAuthState } from '@/lib/spotify/stateStore';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { clientId, redirectUri } = getSpotifyCredentials();
    if (!clientId) {
      console.log('[SPOTIFY DEBUG] LOGIN: authorization URL generated = NO, redirect URI = ' + redirectUri + ', state created = NO');
      return NextResponse.json(
        {
          error: 'Spotify Client ID not configured',
          message: 'Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in environment variables',
        },
        { status: 500 }
      );
    }

    // Cryptographically secure state stored in server-side state store
    const state = createAndStoreOAuthState();
    const authUrl = buildSpotifyAuthUrl(state);

    console.log('[SPOTIFY DEBUG] LOGIN:');
    console.log('authorization URL generated = YES');
    console.log(`redirect URI = ${redirectUri}`);
    console.log('state created = YES');
    console.log('state persisted = YES');

    const response = NextResponse.redirect(authUrl);
    const baseUrl = getAppBaseUrl();
    const isHttps = baseUrl.startsWith('https') || process.env.NODE_ENV === 'production';

    // Store state in HTTP-only cookie as additional layer
    response.cookies.set('spotify_auth_state', state, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown OAuth login error';
    console.log('[SPOTIFY DEBUG] LOGIN: authorization URL generated = NO');
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
