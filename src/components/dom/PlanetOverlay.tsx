'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';
import { PLANETS_CONFIG } from '@/config/planets';
import { CentralDossier } from './worlds/CentralDossier';
import { CodeDossier } from './worlds/CodeDossier';
import { BuildDossier } from './worlds/BuildDossier';
import { MusicDossier } from './worlds/MusicDossier';
import { CreateDossier } from './worlds/CreateDossier';

export function PlanetOverlay() {
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  if (!activeWorld) return null;

  const currentPlanet = PLANETS_CONFIG.find((p) => p.id === activeWorld);
  if (!currentPlanet) return null;

  const displayName =
    currentPlanet.id === 'central'
      ? 'Raghav'
      : currentPlanet.name.charAt(0).toUpperCase() + currentPlanet.name.slice(1).toLowerCase();

  return (
    <div className="fixed inset-0 z-20 flex justify-end pointer-events-none">
      <aside
        role="dialog"
        aria-label={`${currentPlanet.name} Archive`}
        className="pointer-events-auto relative z-10 flex h-full w-full md:w-[54vw] lg:w-[50vw] xl:w-[46vw] flex-col border-l border-[#8F98A8]/15 bg-[#080B12]/92 backdrop-blur-xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500"
      >
        <div className="sticky top-0 z-30 border-b border-[#8F98A8]/12 bg-[#080B12]/95 px-6 sm:px-10 py-4 backdrop-blur-md flex items-center justify-between font-body">
          <div className="flex items-center gap-3">
            <button
              onClick={resetToUniverse}
              className="group flex items-center gap-2 font-mono text-[11px] text-[#8F98A8] hover:text-[#E8E1D5] transition-colors focus:outline-none"
              title="Return to Universe Overview [ESC]"
            >
              <span>← ORBIT OVERVIEW</span>
            </button>
            <span className="text-[#8F98A8]/30">|</span>
            <span className="font-display text-sm font-medium text-[#E8E1D5]">
              {displayName}
            </span>
          </div>

          <button
            onClick={resetToUniverse}
            className="text-xs font-mono text-[#8F98A8] hover:text-[#E8E1D5] px-2 py-1 transition-colors focus:outline-none"
            title="Close Archive [ESC]"
          >
            ✕
          </button>
        </div>

        <div className="px-6 sm:px-10 md:px-12 py-8">
          {currentPlanet.id === 'central' && <CentralDossier />}
          {currentPlanet.id === 'code' && <CodeDossier />}
          {currentPlanet.id === 'build' && <BuildDossier />}
          {currentPlanet.id === 'music' && <MusicDossier />}
          {currentPlanet.id === 'create' && <CreateDossier />}
        </div>
      </aside>
    </div>
  );
}
