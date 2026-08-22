'use client';

import { IDENTITY_DATA } from '@/config/identity';
import { useUniverseStore } from '@/hooks/useUniverseStore';

export function CentralIdentity() {
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);

  const isCentralActive = activeWorld === 'central';

  if (!isEntryComplete) return null;

  return (
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-30 flex items-start justify-between p-8 sm:p-10 animate-in fade-in duration-700">
      {/* Top Left: Monumental Spatial Identity */}
      <div className="flex flex-col gap-1 pointer-events-auto">
        <button
          onClick={() => setActiveWorld(isCentralActive ? null : 'central')}
          className="group flex flex-col text-left transition-all duration-300 focus:outline-none"
        >
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="font-mono text-xl sm:text-2xl font-bold tracking-[0.2em] text-slate-100 group-hover:text-amber-300 transition-colors">
              {IDENTITY_DATA.name}
            </h1>
          </div>
          <p className="font-mono text-xs text-slate-400 tracking-wider pl-4">
            {IDENTITY_DATA.field}
          </p>
          <p className="font-mono text-[10px] text-slate-500 tracking-widest uppercase pl-4">
            {IDENTITY_DATA.location}
          </p>
        </button>
      </div>

      {/* Top Right: Cosmic Telemetry */}
      <div className="hidden sm:flex flex-col items-end gap-1.5 font-mono text-xs text-slate-400">
        <div className="flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-950/70 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
          <span className="text-[10px] text-slate-300 tracking-widest uppercase font-semibold">
            {activeWorld ? `FOCUS // ${activeWorld.toUpperCase()}` : 'SECTOR // EXPLORATION'}
          </span>
        </div>
        <span className="text-[10px] text-slate-500 tracking-widest">
          {IDENTITY_DATA.coordinatesDisplay}
        </span>
      </div>
    </header>
  );
}
