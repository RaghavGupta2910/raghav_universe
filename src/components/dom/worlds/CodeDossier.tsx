'use client';

import { useState, useEffect } from 'react';
import { CodeWorldData } from '@/types/code';
import { useUniverseStore } from '@/hooks/useUniverseStore';

export function CodeDossier() {
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  const [data, setData] = useState<CodeWorldData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    async function loadCodeStats() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/stats/code');
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
          if (json.data.topics?.length > 0) {
            setActiveTopic(json.data.topics[0].id);
          }
        } else {
          throw new Error(json.error || 'Live data feed unavailable');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unable to connect to live archive';
        setError(msg);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadCodeStats();
  }, []);

  return (
    <div className="space-y-16 font-body text-[#E8E1D5] relative pb-20 select-text">
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8] border-b border-[#8F98A8]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4E8F89]" />
            <span>SECTOR 01 &middot; ALGORITHMIC CODEX</span>
          </div>
          <span>11.0 AU</span>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#E8E1D5] tracking-tight leading-none">
            Code & Rigor
          </h1>

          <p className="font-display text-lg sm:text-xl text-[#4E8F89] italic max-w-xl leading-relaxed">
            &ldquo;An astronomical chronicle of competitive problem solving, contest records, and discrete mathematical structures.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8F98A8] pt-2">
            <span>Verified Upstream Feeds</span>
            <span>&middot;</span>
            <span>LeetCode &middot; Codolio &middot; Codeforces</span>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="p-10 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/60 text-center font-mono text-xs text-[#8F98A8] animate-pulse">
          Opening algorithmic codex...
        </div>
      )}

      {!isLoading && error && (
        <div className="p-6 rounded-xl border border-[#8B4F4F]/40 bg-[#8B4F4F]/10 space-y-1 font-body text-xs text-[#E8E1D5]">
          <span className="font-mono text-[#8B4F4F] font-semibold block">ARCHIVE TEMPORARILY UNAVAILABLE</span>
          <p className="text-[#8F98A8] text-[11px]">
            Live competitive metrics could not be retrieved ({error}).
          </p>
        </div>
      )}

      {!isLoading && data && (
        <>
          <section className="space-y-8 border-t border-[#8F98A8]/15 pt-10">
            <div className="space-y-2">
              <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
                Recorded Problem Encounters
              </span>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 pt-1">
                <div className="flex items-baseline">
                  <span className="font-display text-7xl sm:text-8xl font-light text-[#E8E1D5] leading-none">
                    {data.totalSolved}
                  </span>
                  <span className="font-display text-4xl text-[#B79A5B] ml-1.5">+</span>
                </div>

                <div className="font-body text-xs text-[#8F98A8] border-l border-[#8F98A8]/20 pl-4 py-1 max-w-sm">
                  <p className="text-[#E8E1D5] font-medium">Multi-Platform Aggregate</p>
                  <p className="text-[#8F98A8] pt-0.5 leading-relaxed">
                    Cumulative problem encounters across LeetCode, GeeksforGeeks, Codeforces, and CodeStudio.
                  </p>
                </div>
              </div>
            </div>

            {data.leetcode.breakdown.total > 0 && (
              <div className="space-y-5 pt-2">
                <div className="flex items-baseline justify-between text-xs border-b border-[#8F98A8]/15 pb-2">
                  <span className="font-mono text-[11px] text-[#8F98A8] uppercase tracking-wider">
                    LeetCode Spectrum ({data.leetcode.breakdown.total} Solved)
                  </span>
                  <span className="font-mono text-[11px] text-[#B79A5B]">
                    {Math.round(((data.leetcode.breakdown.medium + data.leetcode.breakdown.hard) / data.leetcode.breakdown.total) * 100)}% Advanced Rigor
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="h-1.5 w-full rounded-full bg-[#10151D] overflow-hidden flex gap-1 border border-[#8F98A8]/10">
                    <div
                      style={{ width: `${(data.leetcode.breakdown.easy / data.leetcode.breakdown.total) * 100}%` }}
                      className="bg-[#4E8F89] h-full"
                    />
                    <div
                      style={{ width: `${(data.leetcode.breakdown.medium / data.leetcode.breakdown.total) * 100}%` }}
                      className="bg-[#B79A5B] h-full"
                    />
                    <div
                      style={{ width: `${(data.leetcode.breakdown.hard / data.leetcode.breakdown.total) * 100}%` }}
                      className="bg-[#8B4F4F] h-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-2 font-body text-xs">
                    <div className="space-y-1">
                      <span className="font-mono text-[10px] text-[#4E8F89] block">EASY</span>
                      <span className="font-display text-2xl text-[#E8E1D5] font-medium block">
                        {data.leetcode.breakdown.easy}
                      </span>
                      <span className="font-mono text-[10px] text-[#8F98A8] block">
                        {Math.round((data.leetcode.breakdown.easy / data.leetcode.breakdown.total) * 100)}% of total
                      </span>
                    </div>

                    <div className="space-y-1 border-l border-[#8F98A8]/15 pl-4">
                      <span className="font-mono text-[10px] text-[#B79A5B] block">MEDIUM</span>
                      <span className="font-display text-2xl text-[#E8E1D5] font-medium block">
                        {data.leetcode.breakdown.medium}
                      </span>
                      <span className="font-mono text-[10px] text-[#8F98A8] block">
                        {Math.round((data.leetcode.breakdown.medium / data.leetcode.breakdown.total) * 100)}% of total
                      </span>
                    </div>

                    <div className="space-y-1 border-l border-[#8F98A8]/15 pl-4">
                      <span className="font-mono text-[10px] text-[#8B4F4F] block">HARD</span>
                      <span className="font-display text-2xl text-[#E8E1D5] font-medium block">
                        {data.leetcode.breakdown.hard}
                      </span>
                      <span className="font-mono text-[10px] text-[#8F98A8] block">
                        {Math.round((data.leetcode.breakdown.hard / data.leetcode.breakdown.total) * 100)}% of total
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {data.leetcode.rating > 0 && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
                  Contest Arena Record
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  Rating & Global Standing
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-6 pt-2">
                <span className="font-display text-6xl sm:text-7xl text-[#B79A5B] font-light leading-none">
                  {data.leetcode.rating}
                </span>

                <div className="font-body text-xs text-[#8F98A8] border-l border-[#8F98A8]/20 pl-4 py-1 space-y-1">
                  <span className="text-[#E8E1D5] font-medium text-sm block">
                    {data.leetcode.rank}
                  </span>
                  <p className="text-[#8F98A8] text-[11px]">
                    Peak Rating: {data.leetcode.maxRating} across {data.leetcode.solvedCount} resolved problems.
                  </p>
                </div>
              </div>
            </section>
          )}

          {data.topics.length > 0 && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#4E8F89] tracking-wider uppercase block">
                  Topological Cartography
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  Topics & Domains
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {data.topics.map((topic) => {
                  const isSelected = activeTopic === topic.id;

                  return (
                    <div
                      key={topic.id}
                      onClick={() => setActiveTopic(topic.id)}
                      className={`cursor-pointer rounded-lg border p-3.5 transition-colors ${
                        isSelected
                          ? 'border-[#B79A5B]/60 bg-[#10151D]'
                          : 'border-[#8F98A8]/15 bg-[#10151D]/40 hover:border-[#8F98A8]/30 hover:bg-[#10151D]/70'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-display text-base font-medium text-[#E8E1D5]">
                          {topic.name}
                        </span>
                        <span className="font-mono text-xs text-[#B79A5B]">
                          {topic.count}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {data.nextFrontier.length > 0 && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
                  Expeditions
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  The Next Frontier
                </h2>
              </div>

              <div className="space-y-4 pt-2">
                {data.nextFrontier.map((target) => (
                  <div
                    key={target.id}
                    className="p-4 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#8F98A8]">{target.platformOrDomain}</span>
                      <span className="text-[#4E8F89] capitalize">{target.status.replace('-', ' ')}</span>
                    </div>

                    <h4 className="font-display text-xl font-medium text-[#E8E1D5]">
                      {target.title}
                    </h4>

                    <p className="font-body text-xs text-[#8F98A8] leading-relaxed">
                      {target.description}
                    </p>

                    {target.currentRatingOrProgress && (
                      <span className="font-mono text-[10px] text-[#B79A5B] block pt-1">
                        Current Status: {target.currentRatingOrProgress}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveWorld('build')}
            className="px-5 py-2 rounded-full border border-[#B79A5B]/40 bg-[#10151D] font-body text-xs text-[#E8E1D5] hover:border-[#B79A5B] hover:text-[#B79A5B] transition-colors"
          >
            Traverse to Sector 02: Build &rarr;
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
