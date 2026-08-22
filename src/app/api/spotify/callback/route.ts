import { NextRequest, NextResponse } from 'next/server';
import { exchangeSpotifyCode } from '@/lib/spotify/auth';
import { saveServerSession } from '@/lib/spotify/session';
import { validateAndConsumeOAuthState } from '@/lib/spotify/stateStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const storedState = request.cookies.get('spotify_auth_state')?.value;
  const isStateValid = validateAndConsumeOAuthState(state, storedState);

  console.log('[SPOTIFY DEBUG] CALLBACK:');
  console.log('callback reached = YES');
  console.log('code received =', Boolean(code) ? 'YES' : 'NO');
  console.log('state received =', Boolean(state) ? 'YES' : 'NO');
  console.log('state validated =', isStateValid ? 'PASS' : 'FAIL');

  // 1. Handle error returned directly from Spotify
  if (error) {
    console.error('Spotify Authorization error param:', error);
    return NextResponse.redirect(
      new URL(`/?world=music&error=${encodeURIComponent(error)}`, 'http://127.0.0.1:3000')
    );
  }

  // 2. Validate state to prevent CSRF attacks
  if (!isStateValid) {
    console.warn('Spotify OAuth state mismatch. Validation failed.');
    return NextResponse.redirect(
      new URL('/?world=music&error=state_mismatch', 'http://127.0.0.1:3000')
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?world=music&error=no_code_provided', 'http://127.0.0.1:3000')
    );
  }

  try {
    // 3. Exchange authorization code for tokens
    const tokenData = await exchangeSpotifyCode(code);

    const now = Date.now();
    const expiresAt = now + tokenData.expires_in * 1000;
    const refreshToken = tokenData.refresh_token || '';

    // 4. Save session persistently to local server session file
    console.log('[SPOTIFY DEBUG] SESSION:');
    console.log('session creation attempted = YES');

    if (refreshToken) {
      saveServerSession({
        accessToken: tokenData.access_token,
        refreshToken,
        expiresAt,
        scope: tokenData.scope,
      });
      console.log('session created = YES');
      console.log('cookie/session identifier created = YES');
    } else {
      console.log('session creation succeeded = NO (missing refresh token)');
    }

    // 5. Construct redirect response to the MUSIC world on canonical 127.0.0.1 origin
    const redirectUrl = new URL('/?world=music&spotify=connected', 'http://127.0.0.1:3000');
    console.log('[SPOTIFY DEBUG] REDIRECT:');
    console.log(`callback redirect destination = ${redirectUrl.pathname}${redirectUrl.search}`);

    const response = NextResponse.redirect(redirectUrl);

    // 6. Set HTTP-Only cookies with broad Path and Lax SameSite
    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: false, // Allow local development
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    });

    if (refreshToken) {
      response.cookies.set('spotify_refresh_token', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365, // 1 year
        path: '/',
      });
    }

    response.cookies.set('spotify_expires_at', expiresAt.toString(), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    // Clear one-time CSRF state cookie
    response.cookies.delete('spotify_auth_state');

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'token_exchange_failed';
    console.error('Spotify token exchange exception:', msg);
    return NextResponse.redirect(
      new URL(`/?world=music&error=${encodeURIComponent(msg)}`, 'http://127.0.0.1:3000')
    );
  }
}
