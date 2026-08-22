'use client';

import { CODE_DATA } from '@/config/code';
import { Shield, Compass } from 'lucide-react';

export function CodexArenas() {
  const leetcode = CODE_DATA.leetcode;
  const cfTarget = CODE_DATA.nextFrontier.find((t) => t.platformOrDomain === 'Codeforces');

  return (
    <div className="space-y-4">
      {/* Section Subtitle */}
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
          <Shield className="h-3.5 w-3.5" />
          <span>PRIMARY CONTEST ARENA & NEXT FRONTIER</span>
        </div>
        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
          RATED TRIALS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Arena 1: LeetCode Chronicle Seal */}
        <div className="relative rounded-lg border border-amber-500/30 bg-slate-950/80 p-4 space-y-3 shadow-inner">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 block">
                PRIMARY ACTIVE CONTEST ARENA
              </span>
              <h4 className="font-serif text-lg font-bold text-slate-100 mt-0.5">
                LEETCODE ARENA
              </h4>
            </div>
            <Shield className="h-4 w-4 text-amber-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-extrabold text-amber-300">
              {leetcode.rating}
            </span>
            <span className="font-mono text-[10px] text-emerald-400 font-semibold">
              {'//'} {leetcode.rank}
            </span>
          </div>

          <p className="text-xs font-light text-slate-300 leading-relaxed italic">
            &ldquo;{leetcode.solvedCount} problems solved across rated weekly and biweekly algorithm rounds with high percentile standings.&rdquo;
          </p>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono text-[10px]">
            <span className="text-slate-400">Peak Rating: {leetcode.maxRating}</span>
            <span className="text-amber-400 font-semibold">Target: 1800+ (Knight)</span>
          </div>
        </div>

        {/* Frontier 2: Codeforces Crucible Target Seal */}
        <div className="relative rounded-lg border border-sky-500/30 bg-slate-950/80 p-4 space-y-3 shadow-inner">
          <div className="flex items-start justify-between">
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-sky-400 block">
                THE NEXT FRONTIER TARGET
              </span>
              <h4 className="font-serif text-lg font-bold text-slate-100 mt-0.5">
                CODEFORCES EXPEDITION
              </h4>
            </div>
            <Compass className="h-4 w-4 text-sky-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-extrabold text-sky-300">
              SPECIALIST
            </span>
            <span className="font-mono text-[10px] text-sky-400 font-semibold">
              {'//'} 1400+ TARGET
            </span>
          </div>

          <p className="text-xs font-light text-slate-300 leading-relaxed italic">
            &ldquo;{cfTarget?.description || 'Active expedition through high-pressure Div 2 / Div 3 rated rounds under rapid time decay.'}&rdquo;
          </p>

          <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 font-mono text-[10px]">
            <span className="text-slate-400">Status: {cfTarget?.status.replace('-', ' ') || 'In Progress'}</span>
            <span className="text-sky-400 font-semibold">Progress: {cfTarget?.progressPercent}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
