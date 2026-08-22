import { NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/spotify/client';
import { fetchLiveSpotifyUserData } from '@/lib/spotify/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    const accessToken = await getValidAccessToken();

    if (!accessToken) {
      return NextResponse.json({
        isConnected: false,
        playlists: [],
        topArtists: [],
        topTracks: [],
        recentlyPlayed: [],
        updatedAt: timestamp,
      });
    }

    const liveData = await fetchLiveSpotifyUserData(accessToken);
    return NextResponse.json(liveData);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch Spotify telemetry';
    return NextResponse.json({
      isConnected: false,
      playlists: [],
      topArtists: [],
      topTracks: [],
      recentlyPlayed: [],
      updatedAt: timestamp,
      error: msg,
    });
  }
}
