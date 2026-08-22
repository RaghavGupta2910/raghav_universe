'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';

export function NavigationControls() {
  const isOrbitingEnabled = useUniverseStore((s) => s.isOrbitingEnabled);
  const toggleOrbiting = useUniverseStore((s) => s.toggleOrbiting);
  const navigateNext = useUniverseStore((s) => s.navigateNext);
  const navigatePrev = useUniverseStore((s) => s.navigatePrev);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);

  if (!isEntryComplete) return null;

  return (
    <div className="pointer-events-auto fixed bottom-8 left-8 z-30 hidden lg:flex items-center gap-3 font-body text-xs">
      <button
        onClick={toggleOrbiting}
        className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 backdrop-blur-sm transition-colors ${
          isOrbitingEnabled
            ? 'border-[#8F98A8]/20 bg-[#080B12]/70 text-[#8F98A8] hover:text-[#E8E1D5] hover:border-[#B79A5B]/40'
            : 'border-[#B79A5B]/40 bg-[#10151D]/90 text-[#B79A5B]'
        }`}
        title={isOrbitingEnabled ? 'Pause Planetary Orbits [SPACE]' : 'Resume Orbits [SPACE]'}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${isOrbitingEnabled ? 'bg-[#4E8F89]' : 'bg-[#B79A5B]'}`} />
        <span className="font-mono text-[11px] tracking-wider">
          {isOrbitingEnabled ? 'ORBITS ACTIVE' : 'ORBITS PAUSED'}
        </span>
      </button>

      <div className="flex items-center rounded-full border border-[#8F98A8]/20 bg-[#080B12]/70 backdrop-blur-sm px-1 py-0.5">
        <button
          onClick={navigatePrev}
          className="px-2 py-1 text-[#8F98A8] hover:text-[#E8E1D5] transition-colors font-mono text-[11px]"
          title="Previous Sector [Left Arrow]"
        >
          PREV
        </button>
        <span className="text-[#8F98A8]/30">|</span>
        <button
          onClick={navigateNext}
          className="px-2 py-1 text-[#8F98A8] hover:text-[#E8E1D5] transition-colors font-mono text-[11px]"
          title="Next Sector [Right Arrow]"
        >
          NEXT
        </button>
      </div>
    </div>
  );
}
