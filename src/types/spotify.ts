export interface SpotifyProfile {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  profileUrl: string;
  followersCount: number;
  product?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  trackCount: number;
  spotifyUrl: string;
  ownerName: string;
  isPublic: boolean;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres: string[];
  imageUrl?: string;
  spotifyUrl: string;
  popularity: number;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumImageUrl?: string;
  durationMs: number;
  spotifyUrl: string;
  popularity: number;
  previewUrl?: string | null;
}

export interface SpotifyRecentTrack {
  id: string;
  name: string;
  artists: string[];
  albumName: string;
  albumImageUrl?: string;
  playedAt: string;
  spotifyUrl: string;
}

export interface SpotifyLiveState {
  isConnected: boolean;
  profile?: SpotifyProfile;
  playlists: SpotifyPlaylist[];
  topArtists: SpotifyArtist[];
  topTracks: SpotifyTrack[];
  recentlyPlayed: SpotifyRecentTrack[];
  updatedAt: string;
  error?: string;
}
