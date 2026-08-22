'use client';

import { CODE_DATA } from '@/config/code';
import { CircleDot } from 'lucide-react';

export function CodexDifficultyAstrolabe() {
  const { easy, medium, hard, total } = CODE_DATA.leetcode.breakdown;

  const easyPct = Math.round((easy / total) * 100);
  const medPct = Math.round((medium / total) * 100);
  const hardPct = Math.round((hard / total) * 100);

  // SVG Gauge calculations
  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  const easyStroke = (easy / total) * circumference;
  const medStroke = (medium / total) * circumference;
  const hardStroke = (hard / total) * circumference;

  return (
    <div className="space-y-4">
      {/* Section Subtitle */}
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
          <CircleDot className="h-3.5 w-3.5" />
          <span>CELESTIAL SPECTRUM OF TRIALS</span>
        </div>
        <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
          RATIO & RIGOR
        </span>
      </div>

      {/* Astrolabe Circular Ring Chart + Marginalia Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center p-4 rounded-lg border border-cyan-900/30 bg-slate-950/80">
        {/* Left: Astronomical Ring Dial */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center relative">
          <svg className="w-36 h-36 -rotate-90" viewBox="0 0 160 160">
            {/* Background Ring */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(30, 41, 59, 0.4)"
              strokeWidth="10"
            />

            {/* Easy Segment */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#10b981"
              strokeWidth="10"
              strokeDasharray={`${easyStroke} ${circumference}`}
              strokeDashoffset="0"
              className="transition-all duration-1000"
            />

            {/* Medium Segment */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="10"
              strokeDasharray={`${medStroke} ${circumference}`}
              strokeDashoffset={-easyStroke}
              className="transition-all duration-1000"
            />

            {/* Hard Segment */}
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="#f43f5e"
              strokeWidth="10"
              strokeDasharray={`${hardStroke} ${circumference}`}
              strokeDashoffset={-(easyStroke + medStroke)}
              className="transition-all duration-1000"
            />
          </svg>

          {/* Center Dial Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span className="font-serif text-2xl font-bold text-slate-100">{total}</span>
            <span className="font-mono text-[8px] text-slate-400 uppercase tracking-widest">
              LEETCODE TRIALS
            </span>
          </div>
        </div>

        {/* Right: Marginalia Notes & Proportions */}
        <div className="sm:col-span-7 space-y-3">
          {/* Medium/Hard Dominance Callout */}
          <div className="border-l-2 border-amber-400/80 pl-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-300 block">
              RIGOR INDEX // 66.7% ADVANCED
            </span>
            <p className="text-xs font-light text-slate-300 leading-relaxed italic">
              &ldquo;The majority of encounters reside within complex state graphs and optimal substructure regimes.&rdquo;
            </p>
          </div>

          {/* Detailed Tier Breakdown */}
          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between border-b border-slate-900 pb-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Novice Stratum (Easy)
              </span>
              <span className="text-emerald-300 font-semibold">{easy} ({easyPct}%)</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-900 pb-1">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Adept Realm (Medium)
              </span>
              <span className="text-amber-300 font-semibold">{medium} ({medPct}%)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Severe Fissures (Hard)
              </span>
              <span className="text-rose-300 font-semibold">{hard} ({hardPct}%)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
