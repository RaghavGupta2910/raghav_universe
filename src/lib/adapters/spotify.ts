import { MusicWorldData } from '@/types/music';
import { getValidAccessToken } from '@/lib/spotify/client';
import { fetchLiveSpotifyUserData } from '@/lib/spotify/data';

export interface SpotifySyncResult {
  success: boolean;
  isConnected: boolean;
  data: MusicWorldData;
  error?: string;
}

/**
 * Server-Side Spotify Data Adapter delegating to the official Spotify Web API client
 */
export async function fetchLiveSpotifyData(): Promise<SpotifySyncResult> {
  const timestamp = new Date().toISOString();

  try {
    const accessToken = await getValidAccessToken();

    if (!accessToken) {
      return {
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
      };
    }

    const liveData = await fetchLiveSpotifyUserData(accessToken);

    return {
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
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Spotify fetch error';
    return {
      success: false,
      isConnected: false,
      error: message,
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
    };
  }
}
