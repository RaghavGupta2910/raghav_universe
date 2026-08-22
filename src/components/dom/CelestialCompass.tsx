'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';
import { PLANETS_CONFIG } from '@/config/planets';
import { WorldId } from '@/types/universe';
import { Sparkles, Terminal, Layers, Radio, Palette, Flame, type LucideIcon } from 'lucide-react';

const ICONS: Record<WorldId, LucideIcon> = {
  central: Sparkles,
  code: Terminal,
  build: Layers,
  music: Radio,
  create: Palette,
  mindset: Flame,
};

export function CelestialCompass() {
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);

  if (!isEntryComplete) return null;

  return (
    <nav
      aria-label="Celestial Navigation"
      className="pointer-events-auto fixed bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-950/80 p-2 backdrop-blur-2xl shadow-2xl shadow-cyan-950/20 max-w-[92vw] overflow-x-auto animate-in fade-in duration-700"
    >
      {/* Overview Button */}
      <button
        onClick={() => resetToUniverse()}
        className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-mono transition-all duration-300 ${
          activeWorld === null
            ? 'bg-slate-800 text-cyan-300 font-semibold'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
        }`}
        title="Universe Overview"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
        <span className="uppercase tracking-widest text-[10px]">UNIVERSE</span>
      </button>

      <div className="h-3 w-px bg-slate-800" />

      {/* Planet Navigation Links */}
      {PLANETS_CONFIG.map((planet) => {
        const Icon = ICONS[planet.id] || Sparkles;
        const isActive = activeWorld === planet.id;

        return (
          <button
            key={planet.id}
            onClick={() => setActiveWorld(isActive ? null : planet.id)}
            style={{
              borderColor: isActive ? planet.glowColor : 'transparent',
            }}
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-mono transition-all duration-300 border ${
              isActive
                ? 'bg-slate-900/90 text-slate-100 shadow-md font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            <Icon
              className="h-3 w-3 transition-transform duration-300"
              style={{ color: planet.glowColor }}
            />
            <span className="tracking-widest uppercase text-[10px]">
              {planet.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
