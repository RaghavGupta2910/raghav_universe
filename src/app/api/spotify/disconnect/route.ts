import { NextResponse } from 'next/server';
import { clearServerSession } from '@/lib/spotify/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  clearServerSession();

  const response = NextResponse.json({ success: true, message: 'Disconnected from Spotify' });

  response.cookies.delete('spotify_access_token');
  response.cookies.delete('spotify_refresh_token');
  response.cookies.delete('spotify_expires_at');
  response.cookies.delete('spotify_auth_state');

  return response;
}
