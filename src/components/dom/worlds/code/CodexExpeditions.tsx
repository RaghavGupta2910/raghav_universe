'use client';

import { useState } from 'react';
import { CODE_DATA } from '@/config/code';
import { GoalStatus } from '@/types/code';
import { Map, CheckCircle2, Clock, Compass, type LucideIcon } from 'lucide-react';

const TIER_CONFIG: Record<
  GoalStatus,
  { label: string; text: string; bg: string; dot: string; icon: LucideIcon }
> = {
  achieved: {
    label: 'CHARTED & CONQUERED',
    text: 'text-emerald-400',
    bg: 'border-emerald-500/30 bg-emerald-950/10',
    dot: 'bg-emerald-400',
    icon: CheckCircle2,
  },
  'in-progress': {
    label: 'ACTIVE EXPEDITION',
    text: 'text-cyan-300',
    bg: 'border-cyan-500/40 bg-cyan-950/20',
    dot: 'bg-cyan-400 animate-pulse',
    icon: Clock,
  },
  future: {
    label: 'UNCHARTED FRONTIER',
    text: 'text-amber-300',
    bg: 'border-amber-500/30 bg-amber-950/10',
    dot: 'bg-amber-400',
    icon: Compass,
  },
};

export function CodexExpeditions() {
  const [filter, setFilter] = useState<'all' | GoalStatus>('all');

  const filteredGoals =
    filter === 'all'
      ? CODE_DATA.nextFrontier
      : CODE_DATA.nextFrontier.filter((g) => g.status === filter);

  return (
    <div className="space-y-4">
      {/* Section Subtitle */}
      <div className="flex items-center justify-between border-b border-cyan-900/40 pb-2">
        <div className="flex items-center gap-2 font-mono text-[10px] text-cyan-400 tracking-widest uppercase">
          <Map className="h-3.5 w-3.5" />
          <span>THE NEXT FRONTIER // EXPEDITION CARTOGRAPHY</span>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1 font-mono text-[9px]">
          {(['all', 'in-progress', 'future', 'achieved'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded px-2 py-0.5 uppercase tracking-wider transition-colors ${
                filter === s
                  ? 'bg-cyan-900/60 text-cyan-200 font-semibold border border-cyan-700/50'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {s === 'all' ? 'ALL REALMS' : s}
            </button>
          ))}
        </div>
      </div>

      {/* Expedition Scrolls */}
      <div className="space-y-3">
        {filteredGoals.map((goal) => {
          const config = TIER_CONFIG[goal.status];
          const Icon = config.icon;

          return (
            <div
              key={goal.id}
              className={`relative rounded-lg border p-4 space-y-2 transition-all ${config.bg}`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400">
                  SECTOR: {goal.platformOrDomain}
                </span>
                <span className={`flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-wider ${config.text}`}>
                  <Icon className="h-3 w-3" />
                  {config.label}
                </span>
              </div>

              <h4 className="font-serif text-base font-bold text-slate-100">
                {goal.title}
              </h4>

              <p className="text-xs font-light text-slate-300 leading-relaxed italic">
                &ldquo;{goal.description}&rdquo;
              </p>

              {goal.currentRatingOrProgress && (
                <span className="font-mono text-[10px] text-cyan-400 block pt-0.5">
                  {'//'} Progress: {goal.currentRatingOrProgress}
                </span>
              )}

              {/* Progress Bar for Active Frontiers */}
              {goal.status === 'in-progress' && goal.progressPercent && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex justify-between font-mono text-[9px] text-cyan-300">
                    <span>EXPEDITION ADVANCE</span>
                    <span>{goal.progressPercent}% FRONTIER REACHED</span>
                  </div>
                  <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${goal.progressPercent}%` }}
                      className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                    />
                  </div>
                </div>
              )}

              {goal.completedDate && (
                <span className="font-mono text-[9px] text-emerald-400/80 block pt-0.5">
                  {'//'} Milestone Recorded: {goal.completedDate}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
