import { spotifyGet } from './client';
import {
  SpotifyLiveState,
  SpotifyProfile,
  SpotifyPlaylist,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyRecentTrack,
} from '@/types/spotify';

interface RawSpotifyUser {
  id: string;
  display_name: string;
  email?: string;
  images?: Array<{ url: string }>;
  external_urls: { spotify: string };
  followers?: { total: number };
  product?: string;
}

interface RawSpotifyPlaylists {
  items: Array<{
    id: string;
    name: string;
    description: string;
    images?: Array<{ url: string }>;
    tracks?: { total: number };
    external_urls: { spotify: string };
    owner?: { display_name: string };
    public?: boolean;
  }>;
}

interface RawSpotifyArtists {
  items: Array<{
    id: string;
    name: string;
    genres?: string[];
    images?: Array<{ url: string }>;
    external_urls: { spotify: string };
    popularity?: number;
  }>;
}

interface RawSpotifyTracks {
  items: Array<{
    id: string;
    name: string;
    artists?: Array<{ name: string }>;
    album?: {
      name: string;
      images?: Array<{ url: string }>;
    };
    duration_ms?: number;
    external_urls: { spotify: string };
    popularity?: number;
    preview_url?: string | null;
  }>;
}

interface RawSpotifyRecentlyPlayed {
  items: Array<{
    track: {
      id: string;
      name: string;
      artists?: Array<{ name: string }>;
      album?: {
        name: string;
        images?: Array<{ url: string }>;
      };
      external_urls: { spotify: string };
    };
    played_at: string;
  }>;
}

/**
 * Fetches and normalizes all user Spotify telemetry using a valid Access Token
 */
export async function fetchLiveSpotifyUserData(accessToken: string): Promise<SpotifyLiveState> {
  const timestamp = new Date().toISOString();

  // 1. Fetch Profile
  const rawProfile = await spotifyGet<RawSpotifyUser>('/me', accessToken);
  if (!rawProfile) {
    return {
      isConnected: false,
      playlists: [],
      topArtists: [],
      topTracks: [],
      recentlyPlayed: [],
      updatedAt: timestamp,
      error: 'Unauthorized or token expired',
    };
  }

  const profile: SpotifyProfile = {
    id: rawProfile.id,
    displayName: rawProfile.display_name || 'Spotify User',
    email: rawProfile.email,
    avatarUrl: rawProfile.images?.[0]?.url,
    profileUrl: rawProfile.external_urls?.spotify || `https://open.spotify.com/user/${rawProfile.id}`,
    followersCount: rawProfile.followers?.total || 0,
    product: rawProfile.product,
  };

  // 2. Fetch Playlists, Top Artists, Top Tracks, and Recently Played in parallel
  const [rawPlaylists, rawArtists, rawTracks, rawRecent] = await Promise.all([
    spotifyGet<RawSpotifyPlaylists>('/me/playlists?limit=20', accessToken).catch(() => null),
    spotifyGet<RawSpotifyArtists>('/me/top/artists?limit=20&time_range=medium_term', accessToken).catch(() => null),
    spotifyGet<RawSpotifyTracks>('/me/top/tracks?limit=20&time_range=medium_term', accessToken).catch(() => null),
    spotifyGet<RawSpotifyRecentlyPlayed>('/me/player/recently-played?limit=20', accessToken).catch(() => null),
  ]);

  // Normalize Playlists
  const playlists: SpotifyPlaylist[] = (rawPlaylists?.items || [])
    .filter((p) => Boolean(p && p.id && p.name))
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description || '',
      imageUrl: p.images?.[0]?.url,
      trackCount: p.tracks?.total || 0,
      spotifyUrl: p.external_urls?.spotify || `https://open.spotify.com/playlist/${p.id}`,
      ownerName: p.owner?.display_name || profile.displayName,
      isPublic: Boolean(p.public),
    }));

  // Normalize Top Artists
  const topArtists: SpotifyArtist[] = (rawArtists?.items || [])
    .filter((a) => Boolean(a && a.id && a.name))
    .map((a) => ({
      id: a.id,
      name: a.name,
      genres: a.genres || [],
      imageUrl: a.images?.[0]?.url,
      spotifyUrl: a.external_urls?.spotify || `https://open.spotify.com/artist/${a.id}`,
      popularity: a.popularity || 0,
    }));

  // Normalize Top Tracks
  const topTracks: SpotifyTrack[] = (rawTracks?.items || [])
    .filter((t) => Boolean(t && t.id && t.name))
    .map((t) => ({
      id: t.id,
      name: t.name,
      artists: (t.artists || []).map((art) => art.name),
      albumName: t.album?.name || '',
      albumImageUrl: t.album?.images?.[0]?.url,
      durationMs: t.duration_ms || 0,
      spotifyUrl: t.external_urls?.spotify || `https://open.spotify.com/track/${t.id}`,
      popularity: t.popularity || 0,
      previewUrl: t.preview_url,
    }));

  // Normalize Recently Played
  const recentlyPlayed: SpotifyRecentTrack[] = (rawRecent?.items || [])
    .filter((r) => Boolean(r && r.track && r.track.id))
    .map((r) => ({
      id: r.track.id,
      name: r.track.name,
      artists: (r.track.artists || []).map((art) => art.name),
      albumName: r.track.album?.name || '',
      albumImageUrl: r.track.album?.images?.[0]?.url,
      playedAt: r.played_at,
      spotifyUrl: r.track.external_urls?.spotify || `https://open.spotify.com/track/${r.track.id}`,
    }));

  return {
    isConnected: true,
    profile,
    playlists,
    topArtists,
    topTracks,
    recentlyPlayed,
    updatedAt: timestamp,
  };
}
