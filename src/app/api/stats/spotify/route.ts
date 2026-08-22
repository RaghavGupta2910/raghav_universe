import { NextRequest, NextResponse } from 'next/server';
import { getValidAccessToken } from '@/lib/spotify/client';
import { fetchLiveSpotifyUserData } from '@/lib/spotify/data';
import { loadServerSession } from '@/lib/spotify/session';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const timestamp = new Date().toISOString();

  const host = request.headers.get('host') || 'unknown';
  const cookieAccessToken = request.cookies.get('spotify_access_token')?.value;
  const cookieRefreshToken = request.cookies.get('spotify_refresh_token')?.value;
  const diskSession = loadServerSession();

  console.log('\n[SPOTIFY STATS DEBUG]');
  console.log(`request host: ${host}`);
  console.log(`cookie spotify_access_token present: ${Boolean(cookieAccessToken) ? 'YES' : 'NO'}`);
  console.log(`cookie spotify_refresh_token present: ${Boolean(cookieRefreshToken) ? 'YES' : 'NO'}`);
  console.log(`disk session present: ${Boolean(diskSession) ? 'YES' : 'NO'}`);

  try {
    const accessToken = await getValidAccessToken();
    console.log(`getValidAccessToken result: ${Boolean(accessToken) ? 'TOKEN' : 'NULL'}`);

    if (!accessToken) {
      console.log('Spotify API called: NO');
      return NextResponse.json({
        success: true,
        isConnected: false,
        data: {
          overview:
            'Acoustic resonance, curated musical archives, and harmonic balance providing counterweight to analytical mathematics.',
          ambientVibe:
            'Neoclassical piano phrasing, polyphonic acoustic woodwinds, and deep atmospheric compositions.',
          updatedAt: timestamp,
          isConnected: false,
          playlists: [],
          topArtists: [],
          topTracks: [],
          recentlyPlayed: [],
        },
      });
    }

    console.log('Spotify API called: YES');
    const liveData = await fetchLiveSpotifyUserData(accessToken);

    return NextResponse.json({
      success: true,
      isConnected: liveData.isConnected,
      data: {
        overview:
          'Acoustic resonance, curated musical archives, and harmonic balance providing counterweight to analytical mathematics.',
        ambientVibe:
          'Neoclassical piano phrasing, polyphonic acoustic woodwinds, and deep atmospheric compositions.',
        updatedAt: liveData.updatedAt,
        isConnected: liveData.isConnected,
        profile: liveData.profile,
        playlists: liveData.playlists,
        topArtists: liveData.topArtists,
        topTracks: liveData.topTracks,
        recentlyPlayed: liveData.recentlyPlayed,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to retrieve Spotify data';
    console.log(`Spotify API called: ERROR (${msg})`);
    return NextResponse.json({
      success: false,
      isConnected: false,
      error: msg,
      data: {
        overview:
          'Acoustic resonance, curated musical archives, and harmonic balance providing counterweight to analytical mathematics.',
        ambientVibe:
          'Neoclassical piano phrasing, polyphonic acoustic woodwinds, and deep atmospheric compositions.',
        updatedAt: timestamp,
        isConnected: false,
        playlists: [],
        topArtists: [],
        topTracks: [],
        recentlyPlayed: [],
      },
    });
  }
}
