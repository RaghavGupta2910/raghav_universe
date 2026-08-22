'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';
import { PLANETS_CONFIG } from '@/config/planets';
import { CentralDossier } from './worlds/CentralDossier';
import { CodeDossier } from './worlds/CodeDossier';
import { BuildDossier } from './worlds/BuildDossier';
import { MusicDossier } from './worlds/MusicDossier';
import { CreateDossier } from './worlds/CreateDossier';
import { MindsetDossier } from './worlds/MindsetDossier';
import { X, ArrowLeft } from 'lucide-react';

export function PlanetOverlay() {
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  if (!activeWorld) return null;

  const currentPlanet = PLANETS_CONFIG.find((p) => p.id === activeWorld);
  if (!currentPlanet) return null;

  return (
    <div className="fixed inset-0 z-20 flex justify-end pointer-events-none">
      {/* Right-Anchored Long-Form Exhibition Viewport (Left 50%+ remains clear for 3D Celestial Body) */}
      <aside
        role="dialog"
        aria-label={`${currentPlanet.name} Exhibition`}
        className="pointer-events-auto relative z-10 flex h-full w-full md:w-[54vw] lg:w-[50vw] xl:w-[48vw] flex-col border-l border-slate-800/40 bg-gradient-to-l from-slate-950/90 via-slate-950/80 to-slate-950/60 backdrop-blur-xl shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-500"
      >
        {/* Editorial Floating Minimal Top Bar */}
        <div className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/85 px-6 sm:px-10 py-5 backdrop-blur-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={resetToUniverse}
              className="group flex items-center gap-2 font-mono text-xs text-slate-400 hover:text-slate-100 transition-colors focus:outline-none"
              title="Return to Universe Overview [ESC]"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1 text-cyan-400" />
              <span className="tracking-widest uppercase text-[11px]">ORBIT OVERVIEW</span>
            </button>
            <span className="text-slate-700">{'//'}</span>
            <span
              className="font-mono text-[11px] uppercase tracking-widest font-semibold"
              style={{ color: currentPlanet.glowColor }}
            >
              WORLD 01: {currentPlanet.name}
            </span>
          </div>

          <button
            onClick={resetToUniverse}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 transition-colors focus:outline-none"
            title="Close Exhibition [ESC]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Exhibition Content Flow */}
        <div className="px-6 sm:px-10 md:px-12 py-8">
          {currentPlanet.id === 'central' && <CentralDossier />}
          {currentPlanet.id === 'code' && <CodeDossier />}
          {currentPlanet.id === 'build' && <BuildDossier />}
          {currentPlanet.id === 'music' && <MusicDossier />}
          {currentPlanet.id === 'create' && <CreateDossier />}
          {currentPlanet.id === 'mindset' && <MindsetDossier />}
        </div>
      </aside>
    </div>
  );
}
