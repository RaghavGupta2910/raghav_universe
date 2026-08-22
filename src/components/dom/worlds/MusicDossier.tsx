'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MusicWorldData } from '@/types/music';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { FEATURED_PLAYLIST_IDS } from '@/lib/spotify/featured';
import {
  ArrowRight,
  ExternalLink,
  Music2,
  Radio,
  User,
  AlertCircle,
  RefreshCw,
  LogOut,
  Disc3,
  Clock,
  Sparkles,
} from 'lucide-react';

/**
 * Format ISO timestamp to natural relative time (e.g. "2h ago", "Today")
 */
function formatRelativeTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 5) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

export function MusicDossier() {
  const router = useRouter();
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  const [data, setData] = useState<MusicWorldData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMusicStats() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/stats/spotify', {
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.data) {
          setData(json.data);
        } else {
          throw new Error('Spotify telemetry payload missing');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unable to connect to Spotify API';
        setError(msg);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadMusicStats();
  }, []);

  const handleDisconnect = async () => {
    try {
      await fetch('/api/spotify/disconnect', { method: 'POST' });
      setData(null);
      router.refresh();
    } catch {
      // ignore
    }
  };

  // Partition playlists into Featured vs Other Collections
  const { featuredPlaylists, otherPlaylists } = useMemo(() => {
    if (!data?.playlists || data.playlists.length === 0) {
      return { featuredPlaylists: [], otherPlaylists: [] };
    }

    const all = data.playlists;

    if (FEATURED_PLAYLIST_IDS && FEATURED_PLAYLIST_IDS.length > 0) {
      const featured = FEATURED_PLAYLIST_IDS.map((id) =>
        all.find((p) => p.id === id)
      ).filter(Boolean) as typeof all;

      const remaining = all.filter((p) => !FEATURED_PLAYLIST_IDS.includes(p.id));

      return {
        featuredPlaylists: featured.length > 0 ? featured : all.slice(0, 3),
        otherPlaylists: featured.length > 0 ? remaining : all.slice(3),
      };
    }

    // Default: Highlight top 3 playlists
    return {
      featuredPlaylists: all.slice(0, 3),
      otherPlaylists: all.slice(3),
    };
  }, [data?.playlists]);

  return (
    <div className="space-y-24 font-sans relative pb-28 select-text">
      {/* ========================================================================= */}
      {/* 01. EDITORIAL HERO SECTION                                                */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-2 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-purple-400/80 tracking-widest uppercase border-b border-purple-900/30 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            <span>SECTOR 03 {'//'} MUSIC</span>
          </div>
          <span className="text-slate-500">COORDINATES: 27.0 AU</span>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
            MUSIC
          </h1>
          <p className="font-serif text-lg sm:text-xl font-light text-slate-300 italic max-w-xl leading-relaxed">
            &ldquo;A little window into what I listen to.&rdquo;
          </p>
        </div>

        {/* Profile & Connection Header Badge */}
        {data?.isConnected && data.profile && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-purple-950/40 pt-4">
            <div className="flex items-center gap-3">
              {data.profile.avatarUrl ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-emerald-500/40">
                  <Image
                    src={data.profile.avatarUrl}
                    alt={data.profile.displayName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full border border-emerald-500/40 bg-emerald-950/30 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
              )}

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-sans text-sm font-semibold text-slate-100">
                    {data.profile.displayName}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[10px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Connected to Spotify
                  </span>
                </div>
                <a
                  href={data.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-400 hover:text-emerald-300 transition-colors"
                >
                  <span>Open Spotify Profile</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/40 px-3 py-1 font-mono text-[10px] text-slate-400 hover:text-rose-300 hover:border-rose-900/60 transition-all"
              title="Disconnect Spotify Session"
            >
              <LogOut className="h-3 w-3" />
              <span>Disconnect</span>
            </button>
          </div>
        )}
      </section>

      {/* Loading State */}
      {isLoading && (
        <div className="p-12 border border-slate-800/60 rounded-xl bg-slate-950/40 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3 animate-pulse">
          <RefreshCw className="h-4 w-4 animate-spin text-purple-400" />
          <span>Opening Raghav&apos;s musical archive...</span>
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="border border-rose-900/40 bg-rose-950/20 p-6 rounded-xl space-y-2 font-mono text-xs">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertCircle className="h-4 w-4" />
            <span>MUSIC ARCHIVE TEMPORARILY UNAVAILABLE</span>
          </div>
          <p className="text-slate-300 text-[11px] leading-relaxed">
            Could not retrieve Spotify data ({error}). Please check back shortly.
          </p>
        </div>
      )}

      {/* Unauthenticated State */}
      {!isLoading && !error && !data?.isConnected && (
        <div className="border border-purple-900/30 bg-purple-950/20 p-8 sm:p-10 rounded-2xl space-y-6 max-w-2xl">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-purple-400 block">
                SPOTIFY CONNECTION
              </span>
              <h2 className="font-serif text-3xl font-extrabold text-slate-100">
                Connect Spotify
              </h2>
              <p className="font-serif text-sm font-light text-slate-300 italic leading-relaxed">
                &ldquo;Listen along with what&apos;s playing in Raghav&apos;s universe.&rdquo;
              </p>
            </div>
            <div className="h-12 w-12 rounded-full border border-purple-500/40 bg-purple-900/30 flex items-center justify-center">
              <Radio className="h-6 w-6 text-purple-400 animate-pulse" />
            </div>
          </div>

          <div className="border-t border-purple-900/30 pt-4">
            <a
              href="/api/spotify/login"
              className="inline-flex items-center gap-2.5 rounded-full border border-emerald-500/60 bg-emerald-950/60 px-6 py-2.5 font-mono text-xs text-emerald-300 hover:bg-emerald-900/50 hover:text-emerald-100 hover:border-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)]"
            >
              <Music2 className="h-4 w-4 text-emerald-400" />
              <span className="font-semibold uppercase tracking-wider">Connect Spotify</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      )}

      {/* Authenticated Presentation */}
      {!isLoading && !error && data?.isConnected && (
        <>
          {/* ===================================================================== */}
          {/* 02. MY PLAYLISTS (PRIMARY CENTERPIECE)                                */}
          {/* ===================================================================== */}
          {data.playlists && data.playlists.length > 0 && (
            <section className="space-y-8 border-t border-purple-900/30 pt-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] text-purple-400 uppercase tracking-widest">
                  <Sparkles className="h-3 w-3" />
                  <span>CURATED COLLECTIONS</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                  My Playlists
                </h2>
              </div>

              {/* Featured Large Playlists */}
              {featuredPlaylists.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPlaylists.map((pl) => (
                    <a
                      key={pl.id}
                      href={pl.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-purple-900/40 bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-5 backdrop-blur-md hover:border-emerald-500/60 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300"
                    >
                      <div className="space-y-4">
                        {/* Playlist Cover Image */}
                        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-slate-900 border border-slate-800">
                          {pl.imageUrl ? (
                            <Image
                              src={pl.imageUrl}
                              alt={pl.name}
                              fill
                              unoptimized
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-purple-950/30">
                              <Disc3 className="h-16 w-16 text-purple-400/40" />
                            </div>
                          )}

                          {/* Hover Spotify Overlay Badge */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 font-mono text-[10px] font-bold text-slate-950 shadow-lg">
                              <Music2 className="h-3 w-3" />
                              <span>PLAY ON SPOTIFY</span>
                            </span>
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="space-y-1.5">
                          <h3 className="font-serif text-xl font-bold text-slate-100 group-hover:text-emerald-300 transition-colors line-clamp-1">
                            {pl.name}
                          </h3>
                          {pl.description && (
                            <p className="font-sans text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {pl.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Footer Metadata */}
                      <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-4 font-mono text-[10px] text-slate-400">
                        <span>{pl.trackCount} {pl.trackCount === 1 ? 'track' : 'tracks'}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-400/80 group-hover:text-emerald-300">
                          <span>Open</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {/* Other Playlist Cards */}
              {otherPlaylists.length > 0 && (
                <div className="space-y-3 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500 block">
                    MORE ARCHIVES
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {otherPlaylists.map((pl) => (
                      <a
                        key={pl.id}
                        href={pl.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col justify-between rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 hover:border-purple-500/50 hover:bg-slate-900/60 transition-all"
                      >
                        <div className="space-y-2.5">
                          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900">
                            {pl.imageUrl ? (
                              <Image
                                src={pl.imageUrl}
                                alt={pl.name}
                                fill
                                unoptimized
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Disc3 className="h-8 w-8 text-slate-700" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="font-sans text-xs font-semibold text-slate-200 group-hover:text-purple-300 transition-colors line-clamp-1">
                              {pl.name}
                            </h4>
                            <span className="font-mono text-[10px] text-slate-500 block">
                              {pl.trackCount} tracks
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ===================================================================== */}
          {/* 03. ARTISTS I'VE BEEN LISTENING TO                                    */}
          {/* ===================================================================== */}
          {data.topArtists && data.topArtists.length > 0 && (
            <section className="space-y-6 border-t border-purple-900/30 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-cyan-400 block">
                  HEAVY ROTATION
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                  Artists I&apos;ve Been Listening To
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {data.topArtists.map((artist) => (
                  <a
                    key={artist.id}
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center text-center space-y-3 rounded-xl p-3 hover:bg-slate-900/40 border border-transparent hover:border-slate-800 transition-all"
                  >
                    <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-full overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-md">
                      {artist.imageUrl ? (
                        <Image
                          src={artist.imageUrl}
                          alt={artist.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <User className="h-10 w-10 text-cyan-400/40" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 w-full">
                      <h3 className="font-sans text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                        {artist.name}
                      </h3>
                      {artist.genres && artist.genres.length > 0 && (
                        <span className="font-mono text-[9px] text-slate-400 truncate block">
                          {artist.genres.slice(0, 2).join(' • ')}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* 04. ON REPEAT (TOP TRACKS)                                            */}
          {/* ===================================================================== */}
          {data.topTracks && data.topTracks.length > 0 && (
            <section className="space-y-6 border-t border-purple-900/30 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-amber-400 block">
                  CURRENT OBSESSIONS
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                  On Repeat
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {data.topTracks.map((track, idx) => (
                  <a
                    key={track.id}
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3.5 rounded-xl border border-slate-800/60 bg-slate-950/60 p-3 hover:border-amber-500/50 hover:bg-slate-900/70 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="font-mono text-xs text-slate-400 w-5 text-right font-medium">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>

                      <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-slate-800 bg-slate-900">
                        {track.albumImageUrl ? (
                          <Image
                            src={track.albumImageUrl}
                            alt={track.name}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <Music2 className="h-5 w-5 text-slate-700" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <h3 className="font-sans text-xs font-semibold text-slate-100 group-hover:text-amber-300 transition-colors truncate">
                          {track.name}
                        </h3>
                        <p className="font-sans text-[11px] text-slate-400 truncate">
                          {track.artists.join(', ')}
                        </p>
                        {track.albumName && (
                          <p className="font-mono text-[9px] text-slate-400 truncate">
                            {track.albumName}
                          </p>
                        )}
                      </div>
                    </div>

                    <ExternalLink className="h-3 w-3 text-slate-600 group-hover:text-amber-400 transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* ===================================================================== */}
          {/* 05. RECENTLY IN THE ROTATION                                          */}
          {/* ===================================================================== */}
          {data.recentlyPlayed && data.recentlyPlayed.length > 0 && (
            <section className="space-y-6 border-t border-purple-900/30 pt-10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
                  <Clock className="h-3 w-3" />
                  <span>LISTENING STREAM</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
                  Recently in the Rotation
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {data.recentlyPlayed.map((rec) => (
                  <a
                    key={`${rec.id}-${rec.playedAt}`}
                    href={rec.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col space-y-2.5 rounded-xl border border-slate-800/40 bg-slate-950/40 p-3 hover:border-emerald-500/40 hover:bg-slate-900/50 transition-all"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-slate-900 border border-slate-800/60">
                      {rec.albumImageUrl ? (
                        <Image
                          src={rec.albumImageUrl}
                          alt={rec.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Music2 className="h-6 w-6 text-slate-700" />
                        </div>
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="font-mono text-[9px] text-emerald-400/80 block truncate">
                        {formatRelativeTime(rec.playedAt)}
                      </span>
                      <h3 className="font-sans text-[11px] font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                        {rec.name}
                      </h3>
                      <p className="font-sans text-[10px] text-slate-400 truncate">
                        {rec.artists.join(', ')}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ========================================================================= */}
      {/* 06. CODA & TRAVERSAL                                                      */}
      {/* ========================================================================= */}
      <section className="space-y-6 border-t border-purple-900/40 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-purple-400/80 tracking-widest uppercase">
          <span>CODA</span>
          <span>CONTINUOUS HORIZON</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            Sound gives rhythm to thought.
          </h2>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveWorld('create')}
              className="group flex items-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-950/30 px-5 py-2 font-mono text-xs text-emerald-300 backdrop-blur-md hover:bg-emerald-900/40 hover:text-emerald-200 transition-all focus:outline-none"
            >
              <span>TRAVERSE TO SECTOR 04: CREATE</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={resetToUniverse}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 font-mono text-xs text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all focus:outline-none"
            >
              <span>RETURN TO ORBIT OVERVIEW [ESC]</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-600 border-t border-slate-900 pt-4">
          <span>RAGHAV UNIVERSE // SECTOR 03</span>
          <span>DELHI, IN // 2026</span>
        </div>
      </section>
    </div>
  );
}
