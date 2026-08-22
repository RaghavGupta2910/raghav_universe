import {
  SpotifyProfile,
  SpotifyPlaylist,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyRecentTrack,
} from './spotify';

export interface MusicWorldData {
  overview: string;
  ambientVibe: string;
  updatedAt: string;
  isConnected: boolean;
  profile?: SpotifyProfile;
  playlists: SpotifyPlaylist[];
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  recentlyPlayed?: SpotifyRecentTrack[];
}
