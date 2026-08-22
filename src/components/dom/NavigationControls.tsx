'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';
import { Orbit, ChevronLeft, ChevronRight } from 'lucide-react';

export function NavigationControls() {
  const isOrbitingEnabled = useUniverseStore((s) => s.isOrbitingEnabled);
  const toggleOrbiting = useUniverseStore((s) => s.toggleOrbiting);
  const navigateNext = useUniverseStore((s) => s.navigateNext);
  const navigatePrev = useUniverseStore((s) => s.navigatePrev);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);

  if (!isEntryComplete) return null;

  return (
    <div className="pointer-events-auto fixed bottom-8 left-8 z-30 hidden lg:flex items-center gap-2">
      {/* Orbit Pause / Resume */}
      <button
        onClick={toggleOrbiting}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[11px] backdrop-blur-md transition-all duration-300 ${
          isOrbitingEnabled
            ? 'border-slate-800/80 bg-slate-950/70 text-slate-300 hover:border-slate-700'
            : 'border-amber-800/60 bg-amber-950/40 text-amber-300'
        }`}
        title={isOrbitingEnabled ? 'Pause Planetary Orbits [SPACE]' : 'Resume Orbits [SPACE]'}
      >
        <Orbit
          className={`h-3.5 w-3.5 ${isOrbitingEnabled ? 'animate-spin' : ''}`}
          style={{ animationDuration: '16s' }}
        />
        <span className="text-[10px] tracking-widest uppercase">
          {isOrbitingEnabled ? 'ORBITS: ACTIVE' : 'ORBITS: PAUSED'}
        </span>
      </button>

      {/* Orbit Traversal Shortcuts */}
      <div className="flex items-center rounded-full border border-slate-800/80 bg-slate-950/70 backdrop-blur-md p-1">
        <button
          onClick={navigatePrev}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-full transition-colors"
          title="Previous Sector [Left Arrow]"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={navigateNext}
          className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-900 rounded-full transition-colors"
          title="Next Sector [Right Arrow]"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
