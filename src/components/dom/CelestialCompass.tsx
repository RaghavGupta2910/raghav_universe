'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';
import { PLANETS_CONFIG } from '@/config/planets';

export function CelestialCompass() {
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);

  if (!isEntryComplete) return null;

  return (
    <nav
      aria-label="Astronomical Index"
      className="pointer-events-auto fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-6 sm:gap-8 px-6 py-2.5 rounded-full border border-[#8F98A8]/15 bg-[#080B12]/80 backdrop-blur-md shadow-2xl max-w-[95vw] overflow-x-auto"
    >
      <button
        onClick={() => resetToUniverse()}
        className={`relative text-xs sm:text-sm tracking-wide transition-colors py-1 ${
          activeWorld === null
            ? 'text-[#E8E1D5] font-medium'
            : 'text-[#8F98A8] hover:text-[#E8E1D5]'
        }`}
      >
        <span className="font-display text-sm sm:text-base">Universe</span>
        {activeWorld === null && (
          <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#B79A5B] rounded-full" />
        )}
      </button>

      <span className="h-3 w-[1px] bg-[#8F98A8]/20" />

      {PLANETS_CONFIG.map((planet) => {
        const isActive = activeWorld === planet.id;
        const displayName =
          planet.id === 'central'
            ? 'Raghav'
            : planet.name.charAt(0).toUpperCase() + planet.name.slice(1).toLowerCase();

        return (
          <button
            key={planet.id}
            onClick={() => setActiveWorld(isActive ? null : planet.id)}
            className={`relative text-xs sm:text-sm tracking-wide transition-colors py-1 whitespace-nowrap ${
              isActive
                ? 'text-[#E8E1D5] font-medium'
                : 'text-[#8F98A8] hover:text-[#E8E1D5]'
            }`}
          >
            <span className="font-display text-sm sm:text-base">{displayName}</span>
            {isActive && (
              <span className="absolute -bottom-0.5 left-0 right-0 h-[1.5px] bg-[#B79A5B] rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
