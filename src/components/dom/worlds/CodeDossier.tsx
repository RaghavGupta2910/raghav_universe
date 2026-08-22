'use client';

import { useState, useEffect } from 'react';
import { CodeWorldData } from '@/types/code';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { ArrowRight, Compass, AlertCircle, RefreshCw } from 'lucide-react';

export function CodeDossier() {
  const { setActiveWorld, resetToUniverse } = useUniverseStore();
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
        const msg = err instanceof Error ? err.message : 'Unable to connect to live telemetry';
        setError(msg);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadCodeStats();
  }, []);

  return (
    <div className="space-y-20 font-sans relative pb-20 select-text">
      {/* ========================================================================= */}
      {/* SCENE 01 — HERO EXHIBITION POSTER                                         */}
      {/* ========================================================================= */}
      <section className="space-y-8 pt-2 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase border-b border-cyan-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>EXHIBITION 01 {'//'} SECTOR CODE</span>
            </div>
            <span className="text-slate-500">COORDINATES: 11.0 AU {'//'} 28.61N</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            <span>RAGHAV GUPTA ARCHIVE</span>
            <span>MATHEMATICS & COMPUTING</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <span className="font-mono text-[10px] text-cyan-400 tracking-[0.3em] uppercase block mb-1">
              THE CODEX OF
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
              CODE
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-cyan-400 to-transparent mt-3" />
          </div>

          <p className="font-serif text-base sm:text-lg font-light text-slate-300 italic max-w-xl leading-relaxed">
            &ldquo;An authentic live chronicle of algorithmic problem solving, contest telemetry, and discrete mathematics encounters.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 pt-1">
            <span className="text-cyan-300 font-semibold">Live Telemetry Pipeline</span>
            <span className="text-slate-700">•</span>
            <span className="text-amber-300 font-semibold">Verified Source</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-300 font-semibold">
              {data?.updatedAt ? `Updated: ${new Date(data.updatedAt).toLocaleDateString()}` : 'Live Telemetry'}
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 02 — LIVE DATA STATE OR DATA UNAVAILABLE                            */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-cyan-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
          <span>02 {'//'} TELEMETRY STATUS</span>
          <span>LIVE SOURCE</span>
        </div>

        {isLoading ? (
          <div className="p-8 border border-slate-800 rounded-lg bg-slate-950/60 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3 animate-pulse">
            <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
            <span>CONNECTING TO LIVE TELEMETRY FEED...</span>
          </div>
        ) : error || !data ? (
          /* Strict Data Integrity: Explicit DATA UNAVAILABLE state */
          <div className="border border-rose-900/50 bg-rose-950/20 p-6 rounded-lg space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>DATA UNAVAILABLE</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Live statistics could not be retrieved from the verified upstream data feed ({error || 'Connection Failed'}).
            </p>
            <p className="text-slate-500 text-[11px]">
              In accordance with our strict Data Correctness Rule, old hardcoded numbers and placeholder values are never displayed.
            </p>
          </div>
        ) : (
          <>
            {/* Monumental Solved Count */}
            <div className="space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block">
                RECORDED PROBLEM ENCOUNTERS (LIVE SOURCE)
              </span>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                <div className="flex items-baseline">
                  <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-slate-100 leading-none">
                    {data.totalSolved}
                  </span>
                  <span className="font-serif text-4xl sm:text-5xl text-cyan-400 font-light ml-1">+</span>
                </div>

                <div className="font-mono text-xs text-slate-400 space-y-1 max-w-xs border-l border-cyan-500/40 pl-4 py-1">
                  <span className="text-slate-200 block font-semibold">
                    MULTI-PLATFORM ARCHIVE
                  </span>
                  <p className="text-[11px] text-slate-400 font-light leading-relaxed">
                    Live telemetry across competitive algorithmic rounds and problem collections.
                  </p>
                </div>
              </div>
            </div>

            {/* Difficulty Stratification Gauge */}
            {data.leetcode.breakdown.total > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-baseline justify-between font-mono text-xs border-b border-slate-800 pb-2">
                  <span className="text-slate-400 uppercase tracking-wider text-[11px]">
                    LEETCODE SPECTRUM ({data.leetcode.breakdown.total} SOLVED)
                  </span>
                  <span className="text-amber-300 font-semibold">
                    {Math.round(((data.leetcode.breakdown.medium + data.leetcode.breakdown.hard) / data.leetcode.breakdown.total) * 100)}% ADVANCED RIGOR
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="h-2.5 w-full rounded-full bg-slate-900/90 overflow-hidden flex gap-1 p-0.5 border border-slate-800">
                    <div
                      style={{ width: `${(data.leetcode.breakdown.easy / data.leetcode.breakdown.total) * 100}%` }}
                      className="bg-emerald-500 h-full rounded-l-full transition-all duration-1000"
                    />
                    <div
                      style={{ width: `${(data.leetcode.breakdown.medium / data.leetcode.breakdown.total) * 100}%` }}
                      className="bg-amber-400 h-full transition-all duration-1000"
                    />
                    <div
                      style={{ width: `${(data.leetcode.breakdown.hard / data.leetcode.breakdown.total) * 100}%` }}
                      className="bg-rose-500 h-full rounded-r-full transition-all duration-1000"
                    />
                  </div>

                  <div className="grid grid-cols-3 font-mono text-xs pt-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-emerald-400 block uppercase tracking-wider">
                        01 {'//'} NOVICE (EASY)
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-slate-100 block">
                        {data.leetcode.breakdown.easy}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {Math.round((data.leetcode.breakdown.easy / data.leetcode.breakdown.total) * 100)}% of total
                      </span>
                    </div>

                    <div className="space-y-0.5 border-l border-slate-800/80 pl-4">
                      <span className="text-[10px] text-amber-400 block uppercase tracking-wider">
                        02 {'//'} ADEPT (MEDIUM)
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-slate-100 block">
                        {data.leetcode.breakdown.medium}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {Math.round((data.leetcode.breakdown.medium / data.leetcode.breakdown.total) * 100)}% of total
                      </span>
                    </div>

                    <div className="space-y-0.5 border-l border-slate-800/80 pl-4">
                      <span className="text-[10px] text-rose-400 block uppercase tracking-wider">
                        03 {'//'} MASTER (HARD)
                      </span>
                      <span className="font-serif text-xl sm:text-2xl font-bold text-slate-100 block">
                        {data.leetcode.breakdown.hard}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {Math.round((data.leetcode.breakdown.hard / data.leetcode.breakdown.total) * 100)}% of total
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SCENE 03 — COMPUTATIONAL LANDSCAPE & TOPICS                               */}
      {/* ========================================================================= */}
      {data && data.topics.length > 0 && (
        <section className="space-y-8 border-t border-cyan-900/30 pt-12 relative">
          <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
            <span>03 {'//'} TOPOLOGY</span>
            <span>TOPIC ANALYSIS</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
              THE COMPUTATIONAL LANDSCAPE
            </h2>
            <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
              Topic breakdown dynamically aggregated from your live competitive profile.
            </p>
          </div>

          <div className="space-y-3">
            {data.topics.map((topic) => {
              const isSelected = activeTopic === topic.id;

              return (
                <div
                  key={topic.id}
                  onClick={() => setActiveTopic(topic.id)}
                  className={`cursor-pointer border-l-2 p-3.5 transition-all duration-300 ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-900/50 pl-5'
                      : 'border-slate-800 hover:border-slate-600 pl-3.5 hover:bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: topic.color }}
                      />
                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                        {topic.name}
                      </h3>
                    </div>
                    <div className="font-mono text-xs">
                      <span className="text-slate-100 font-semibold">{topic.count}</span>
                      <span className="text-slate-500 text-[10px] ml-1.5">problems</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCENE 04 — LEETCODE CONTEST ARENA                                         */}
      {/* ========================================================================= */}
      {data && data.leetcode.rating > 0 && (
        <section className="space-y-8 border-t border-cyan-900/30 pt-12 relative">
          <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
            <span>04 {'//'} CONTEST ARENA</span>
            <span>LEETCODE CHRONICLE</span>
          </div>

          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-widest text-amber-400 block">
              CURRENT CONTEST RATING
            </span>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
              <span className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tighter text-amber-300 leading-none">
                {data.leetcode.rating}
              </span>

              <div className="font-mono text-xs text-slate-300 space-y-1 border-l-2 border-amber-500/60 pl-4 py-1">
                <span className="text-emerald-400 font-bold text-sm block">
                  {data.leetcode.rank}
                </span>
                <p className="text-slate-400 font-light text-[11px] leading-relaxed">
                  Peak Rating: {data.leetcode.maxRating} across {data.leetcode.solvedCount} resolved problems.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCENE 05 — THE NEXT FRONTIER (CODEFORCES & FUTURE TARGETS ONLY)           */}
      {/* ========================================================================= */}
      {data && data.nextFrontier.length > 0 && (
        <section className="space-y-8 border-t border-cyan-900/30 pt-12 relative">
          <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
            <span>05 {'//'} THE NEXT FRONTIER</span>
            <span>EXPEDITION CARTOGRAPHY</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-2">
              <Compass className="h-5 w-5 text-cyan-400" />
              THE NEXT FRONTIER
            </h2>
            <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
              Future targets, active escalations, and expanding territories along the future → in-progress → achieved lifecycle.
            </p>
          </div>

          <div className="space-y-5">
            {data.nextFrontier.map((target) => (
              <div
                key={target.id}
                className="border-b border-slate-900 pb-5 space-y-2 border-l-2 border-cyan-400 pl-4"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                    SECTOR: {target.platformOrDomain}
                  </span>
                  <span className="font-mono text-[9px] font-semibold uppercase tracking-wider text-cyan-300 animate-pulse">
                    ● {target.status.replace('-', ' ')}
                  </span>
                </div>

                <h4 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                  {target.title}
                </h4>

                <p className="font-serif text-xs italic text-slate-300 leading-relaxed">
                  &ldquo;{target.description}&rdquo;
                </p>

                {target.currentRatingOrProgress && (
                  <span className="font-mono text-[10px] text-cyan-400 block pt-0.5">
                    {'//'} Status: {target.currentRatingOrProgress}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCENE 06 — CODA & TRAVERSAL                                               */}
      {/* ========================================================================= */}
      <section className="space-y-6 border-t border-cyan-900/40 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
          <span>06 {'//'} CODA</span>
          <span>THE JOURNEY CONTINUES</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            THE COMPUTATIONAL REALM EXPANDS.
          </h2>

          <p className="font-serif text-xs sm:text-sm font-light text-slate-300 italic leading-relaxed">
            &ldquo;Every problem solved is a permanent coordinate mapped into the memory of the universe. The ascent toward deep mathematical mastery continues without end.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveWorld('build')}
              className="group flex items-center gap-2 rounded-full border border-orange-500/60 bg-orange-950/30 px-5 py-2 font-mono text-xs text-orange-300 backdrop-blur-md hover:bg-orange-900/40 hover:text-orange-200 transition-all focus:outline-none"
            >
              <span>TRAVERSE TO SECTOR 02: BUILD</span>
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
          <span>RAGHAV UNIVERSE // SECTOR 01</span>
          <span>DELHI, IN // 2026</span>
        </div>
      </section>
    </div>
  );
}
