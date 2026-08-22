import { MusicWorldData } from '@/types/music';

/**
 * MUSIC WORLD CONFIGURATION
 *
 * Adheres strictly to the Data Integrity Rule:
 * - Does not invent fake playlists or fabricated listening statistics.
 * - Reflects authentic live Spotify state or displays unauthenticated connection status.
 */
export const MUSIC_DATA: MusicWorldData = {
  overview:
    'Acoustic resonance, curated musical archives, and harmonic balance providing counterweight to analytical mathematics.',
  ambientVibe:
    'Neoclassical piano phrasing, polyphonic acoustic woodwinds, and deep atmospheric compositions.',
  updatedAt: new Date().toISOString(),
  isConnected: false,
  playlists: [],
  topArtists: [],
  topTracks: [],
};
