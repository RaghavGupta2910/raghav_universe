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
    <header className="pointer-events-none fixed top-0 left-0 right-0 z-30 flex items-start justify-between p-6 sm:p-10">
      <div className="flex flex-col gap-0.5 pointer-events-auto">
        <button
          onClick={() => setActiveWorld(isCentralActive ? null : 'central')}
          className="group flex flex-col text-left transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B79A5B]" />
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-wide text-[#E8E1D5] group-hover:text-[#B79A5B] transition-colors">
              {IDENTITY_DATA.name}
            </h1>
          </div>
          <p className="font-body text-xs text-[#8F98A8] pl-3.5 pt-0.5">
            {IDENTITY_DATA.field}
          </p>
        </button>
      </div>

      <div className="hidden sm:flex flex-col items-end gap-1 font-mono text-[11px] text-[#8F98A8]">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#8F98A8]/15 bg-[#080B12]/60 backdrop-blur-sm">
          <span className="h-1 w-1 rounded-full bg-[#B79A5B]" />
          <span className="text-[#E8E1D5]">
            {activeWorld ? activeWorld.toUpperCase() : 'OBSERVATORY OVERVIEW'}
          </span>
        </div>
        <span className="text-[10px] text-[#8F98A8]/70">
          {IDENTITY_DATA.coordinatesDisplay}
        </span>
      </div>
    </header>
  );
}
