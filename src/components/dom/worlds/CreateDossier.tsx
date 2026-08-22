'use client';

import { CREATE_DATA } from '@/config/create';
import { useUniverseStore } from '@/hooks/useUniverseStore';

export function CreateDossier() {
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  return (
    <div className="space-y-16 font-body text-[#E8E1D5] relative pb-20 select-text">
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8] border-b border-[#8F98A8]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#4E8F89]" />
            <span>SECTOR 04 &middot; POLYMATH DIMENSIONS</span>
          </div>
          <span>35.0 AU</span>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#E8E1D5] tracking-tight leading-none">
            Create & Craft
          </h1>

          <p className="font-display text-lg sm:text-xl text-[#4E8F89] italic max-w-xl leading-relaxed">
            &ldquo;{CREATE_DATA.themeStatement}&rdquo;
          </p>

          <p className="font-body text-xs sm:text-sm text-[#8F98A8] leading-relaxed max-w-xl">
            {CREATE_DATA.overview}
          </p>
        </div>
      </section>

      <section className="space-y-8 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] text-[#4E8F89] tracking-wider uppercase block">
            Acoustic Intonation
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
            Music & Acoustic Instruments
          </h2>
        </div>

        <div className="space-y-6">
          {CREATE_DATA.categories.music.map((item) => (
            <div key={item.id} className="p-5 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/50 space-y-3">
              <div className="flex items-baseline justify-between">
                <h4 className="font-display text-2xl font-medium text-[#E8E1D5]">
                  {item.name}
                </h4>
                <span className="font-mono text-[11px] text-[#4E8F89]">
                  {item.medium}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#8F98A8] leading-relaxed">
                {item.description}
              </p>

              <div className="border-l border-[#4E8F89]/40 pl-3.5 py-1 text-xs text-[#E8E1D5]/90 italic">
                {item.creativePhilosophy}
              </div>

              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-[#8F98A8]">
                {item.studioNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2 py-0.5 rounded border border-[#8F98A8]/15 bg-[#080B12]/60"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
            Tactile Geometries
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
            Fine Arts & Paper Filigree
          </h2>
        </div>

        <div className="space-y-6">
          {CREATE_DATA.categories.art.map((item) => (
            <div key={item.id} className="p-5 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/50 space-y-3">
              <div className="flex items-baseline justify-between">
                <h4 className="font-display text-2xl font-medium text-[#E8E1D5]">
                  {item.name}
                </h4>
                <span className="font-mono text-[11px] text-[#B79A5B]">
                  {item.medium}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#8F98A8] leading-relaxed">
                {item.description}
              </p>

              <div className="border-l border-[#B79A5B]/40 pl-3.5 py-1 text-xs text-[#E8E1D5]/90 italic">
                {item.creativePhilosophy}
              </div>

              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[10px] text-[#8F98A8]">
                {item.studioNotes.map((note) => (
                  <span
                    key={note}
                    className="px-2 py-0.5 rounded border border-[#8F98A8]/15 bg-[#080B12]/60"
                  >
                    {note}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveWorld('mindset')}
            className="px-5 py-2 rounded-full border border-[#B79A5B]/40 bg-[#10151D] font-body text-xs text-[#E8E1D5] hover:border-[#B79A5B] hover:text-[#B79A5B] transition-colors"
          >
            Traverse to Sector 05: Mindset &rarr;
          </button>

          <button
            onClick={resetToUniverse}
            className="px-4 py-2 rounded-full border border-[#8F98A8]/20 font-body text-xs text-[#8F98A8] hover:text-[#E8E1D5] transition-colors"
          >
            Return to Orbit Overview
          </button>
        </div>
      </section>
    </div>
  );
}
