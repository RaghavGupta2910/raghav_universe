import { NextRequest, NextResponse } from 'next/server';
import { exchangeSpotifyCode, getAppBaseUrl } from '@/lib/spotify/auth';
import { saveServerSession } from '@/lib/spotify/session';
import { validateAndConsumeOAuthState } from '@/lib/spotify/stateStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const baseUrl = getAppBaseUrl();
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');

  const storedState = request.cookies.get('spotify_auth_state')?.value;
  const isStateValid = validateAndConsumeOAuthState(state, storedState);

  if (error) {
    return NextResponse.redirect(
      new URL(`/?world=music&error=${encodeURIComponent(error)}`, baseUrl)
    );
  }

  if (!isStateValid) {
    return NextResponse.redirect(
      new URL('/?world=music&error=state_mismatch', baseUrl)
    );
  }

  if (!code) {
    return NextResponse.redirect(
      new URL('/?world=music&error=no_code_provided', baseUrl)
    );
  }

  try {
    const tokenData = await exchangeSpotifyCode(code);

    const now = Date.now();
    const expiresAt = now + tokenData.expires_in * 1000;
    const refreshToken = tokenData.refresh_token || '';

    if (refreshToken) {
      saveServerSession({
        accessToken: tokenData.access_token,
        refreshToken,
        expiresAt,
        scope: tokenData.scope,
      });
    }

    const redirectUrl = new URL('/?world=music&spotify=connected', baseUrl);
    const response = NextResponse.redirect(redirectUrl);
    const isHttps = baseUrl.startsWith('https') || process.env.NODE_ENV === 'production';

    response.cookies.set('spotify_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: tokenData.expires_in,
      path: '/',
    });

    if (refreshToken) {
      response.cookies.set('spotify_refresh_token', refreshToken, {
        httpOnly: true,
        secure: isHttps,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 365,
        path: '/',
      });
    }

    response.cookies.set('spotify_expires_at', expiresAt.toString(), {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });

    response.cookies.delete('spotify_auth_state');

    return response;
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'token_exchange_failed';
    return NextResponse.redirect(
      new URL(`/?world=music&error=${encodeURIComponent(msg)}`, baseUrl)
    );
  }
}
