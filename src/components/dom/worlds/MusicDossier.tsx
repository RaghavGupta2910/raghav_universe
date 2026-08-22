'use client';

import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { MusicWorldData } from '@/types/music';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { FEATURED_PLAYLIST_IDS } from '@/lib/spotify/featured';

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

    return {
      featuredPlaylists: all.slice(0, 3),
      otherPlaylists: all.slice(3),
    };
  }, [data?.playlists]);

  return (
    <div className="space-y-16 font-body text-[#E8E1D5] relative pb-20 select-text">
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8] border-b border-[#8F98A8]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#70556F]" />
            <span>SECTOR 03 &middot; MUSIC ARCHIVE</span>
          </div>
          <span>27.0 AU</span>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#E8E1D5] tracking-tight leading-none">
            Music & Sound
          </h1>
          <p className="font-display text-lg sm:text-xl text-[#B79A5B] italic max-w-xl leading-relaxed">
            &ldquo;A little window into what I listen to.&rdquo;
          </p>
        </div>

        {data?.isConnected && data.profile && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#8F98A8]/15 pt-4">
            <div className="flex items-center gap-3">
              {data.profile.avatarUrl ? (
                <div className="relative h-10 w-10 rounded-full overflow-hidden border border-[#B79A5B]/40">
                  <Image
                    src={data.profile.avatarUrl}
                    alt={data.profile.displayName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 rounded-full border border-[#8F98A8]/20 bg-[#10151D] flex items-center justify-center font-display text-sm text-[#E8E1D5]">
                  {data.profile.displayName.charAt(0)}
                </div>
              )}

              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[#E8E1D5]">
                    {data.profile.displayName}
                  </span>
                  <span className="font-mono text-[10px] text-[#4E8F89]">
                    &middot; Connected
                  </span>
                </div>
                <a
                  href={data.profile.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-[#8F98A8] hover:text-[#B79A5B] transition-colors block"
                >
                  Spotify Profile ↗
                </a>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="rounded-full border border-[#8F98A8]/20 bg-[#10151D] px-3.5 py-1 font-mono text-[11px] text-[#8F98A8] hover:text-[#8B4F4F] transition-colors"
            >
              Disconnect
            </button>
          </div>
        )}
      </section>

      {isLoading && (
        <div className="p-10 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/60 text-center font-mono text-xs text-[#8F98A8] animate-pulse">
          Opening musical folio...
        </div>
      )}

      {!isLoading && error && (
        <div className="p-6 rounded-xl border border-[#8B4F4F]/40 bg-[#8B4F4F]/10 space-y-1 font-body text-xs text-[#E8E1D5]">
          <span className="font-mono text-[#8B4F4F] font-semibold block">MUSIC FOLIO UNAVAILABLE</span>
          <p className="text-[#8F98A8] text-[11px]">
            Spotify data could not be retrieved ({error}).
          </p>
        </div>
      )}

      {!isLoading && !error && !data?.isConnected && (
        <div className="p-8 rounded-2xl border border-[#8F98A8]/15 bg-[#10151D]/60 space-y-4 max-w-xl">
          <div className="space-y-1">
            <span className="font-mono text-[10px] text-[#B79A5B] uppercase tracking-wider block">
              Spotify Integration
            </span>
            <h2 className="font-display text-3xl font-normal text-[#E8E1D5]">
              Connect Spotify
            </h2>
            <p className="font-display text-sm text-[#8F98A8] italic">
              &ldquo;Listen along with what is playing in Raghav&apos;s universe.&rdquo;
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/api/spotify/login"
              className="inline-block px-5 py-2 rounded-full border border-[#4E8F89]/60 bg-[#10151D] font-mono text-xs text-[#E8E1D5] hover:border-[#4E8F89] transition-colors"
            >
              Connect Spotify ↗
            </a>
          </div>
        </div>
      )}

      {!isLoading && !error && data?.isConnected && (
        <>
          {data.playlists && data.playlists.length > 0 && (
            <section className="space-y-8 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
                  Curated Collections
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  My Playlists
                </h2>
              </div>

              {featuredPlaylists.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPlaylists.map((pl) => (
                    <a
                      key={pl.id}
                      href={pl.spotifyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col justify-between rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/60 p-4 hover:border-[#B79A5B]/40 hover:bg-[#10151D] transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#080B12] border border-[#8F98A8]/10">
                          {pl.imageUrl && (
                            <Image
                              src={pl.imageUrl}
                              alt={pl.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-display text-xl font-medium text-[#E8E1D5] group-hover:text-[#B79A5B] transition-colors line-clamp-1">
                            {pl.name}
                          </h3>
                          {pl.description && (
                            <p className="text-xs text-[#8F98A8] line-clamp-2 leading-relaxed">
                              {pl.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-t border-[#8F98A8]/10 pt-3 mt-3 font-mono text-[10px] text-[#8F98A8]">
                        <span>{pl.trackCount} tracks</span>
                        <span className="text-[#E8E1D5] group-hover:text-[#B79A5B]">Play ↗</span>
                      </div>
                    </a>
                  ))}
                </div>
              )}

              {otherPlaylists.length > 0 && (
                <div className="space-y-3 pt-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#8F98A8] block">
                    More Archives
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {otherPlaylists.map((pl) => (
                      <a
                        key={pl.id}
                        href={pl.spotifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex flex-col justify-between rounded-lg border border-[#8F98A8]/15 bg-[#10151D]/40 p-3 hover:border-[#B79A5B]/30 hover:bg-[#10151D]/70 transition-colors"
                      >
                        <div className="space-y-2">
                          <div className="relative aspect-square w-full overflow-hidden rounded bg-[#080B12]">
                            {pl.imageUrl && (
                              <Image
                                src={pl.imageUrl}
                                alt={pl.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            )}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-xs font-medium text-[#E8E1D5] group-hover:text-[#B79A5B] transition-colors line-clamp-1">
                              {pl.name}
                            </h4>
                            <span className="font-mono text-[9px] text-[#8F98A8] block">
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

          {data.topArtists && data.topArtists.length > 0 && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#4E8F89] tracking-wider uppercase block">
                  Heavy Rotation
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  Artists I&apos;ve Been Listening To
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-2">
                {data.topArtists.map((artist) => (
                  <a
                    key={artist.id}
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col items-center text-center space-y-2.5 p-3 rounded-xl hover:bg-[#10151D]/60 transition-colors"
                  >
                    <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full overflow-hidden border border-[#8F98A8]/20 bg-[#10151D]">
                      {artist.imageUrl && (
                        <Image
                          src={artist.imageUrl}
                          alt={artist.name}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                    </div>

                    <div className="space-y-0.5 w-full">
                      <h3 className="text-xs font-medium text-[#E8E1D5] group-hover:text-[#B79A5B] transition-colors truncate">
                        {artist.name}
                      </h3>
                      {artist.genres && artist.genres.length > 0 && (
                        <span className="font-mono text-[9px] text-[#8F98A8] truncate block">
                          {artist.genres.slice(0, 2).join(' &middot; ')}
                        </span>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}

          {data.topTracks && data.topTracks.length > 0 && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
                  Current Records
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  On Repeat
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {data.topTracks.map((track, idx) => (
                  <a
                    key={track.id}
                    href={track.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-3 p-3 rounded-lg border border-[#8F98A8]/15 bg-[#10151D]/50 hover:border-[#B79A5B]/30 hover:bg-[#10151D] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-xs text-[#8F98A8] w-5 text-right">
                        {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>

                      <div className="relative h-11 w-11 shrink-0 rounded overflow-hidden bg-[#080B12] border border-[#8F98A8]/10">
                        {track.albumImageUrl && (
                          <Image
                            src={track.albumImageUrl}
                            alt={track.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <h3 className="text-xs font-medium text-[#E8E1D5] group-hover:text-[#B79A5B] transition-colors truncate">
                          {track.name}
                        </h3>
                        <p className="text-[11px] text-[#8F98A8] truncate">
                          {track.artists.join(', ')}
                        </p>
                      </div>
                    </div>

                    <span className="font-mono text-xs text-[#8F98A8] group-hover:text-[#E8E1D5] shrink-0">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </section>
          )}

          {data.recentlyPlayed && data.recentlyPlayed.length > 0 && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#70556F] tracking-wider uppercase block">
                  Listening Stream
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  Recently in the Rotation
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-2">
                {data.recentlyPlayed.map((rec) => (
                  <a
                    key={`${rec.id}-${rec.playedAt}`}
                    href={rec.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col space-y-2 p-2.5 rounded-lg border border-[#8F98A8]/10 bg-[#10151D]/40 hover:border-[#B79A5B]/30 hover:bg-[#10151D] transition-colors"
                  >
                    <div className="relative aspect-square w-full overflow-hidden rounded bg-[#080B12]">
                      {rec.albumImageUrl && (
                        <Image
                          src={rec.albumImageUrl}
                          alt={rec.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="space-y-0.5 min-w-0">
                      <span className="font-mono text-[9px] text-[#4E8F89] block truncate">
                        {formatRelativeTime(rec.playedAt)}
                      </span>
                      <h3 className="text-xs font-medium text-[#E8E1D5] group-hover:text-[#B79A5B] transition-colors truncate">
                        {rec.name}
                      </h3>
                      <p className="text-[10px] text-[#8F98A8] truncate">
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

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveWorld('create')}
            className="px-5 py-2 rounded-full border border-[#B79A5B]/40 bg-[#10151D] font-body text-xs text-[#E8E1D5] hover:border-[#B79A5B] hover:text-[#B79A5B] transition-colors"
          >
            Traverse to Sector 04: Create &rarr;
          </button>

          <button
            onClick={resetToUniverse}
            className="px-4 py-2 rounded-full border border-[#8F98A8]/20 font-body text-xs text-[#8F98A8] hover:text-[#E8E1D5] transition-colors"
          >
            Return to Orbit Overview
          </button>
        </div>
      </section>
    </div>
  );
}
