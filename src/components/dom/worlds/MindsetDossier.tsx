'use client';

import { MINDSET_DATA } from '@/config/mindset';
import { useUniverseStore } from '@/hooks/useUniverseStore';

export function MindsetDossier() {
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  return (
    <div className="space-y-16 font-body text-[#E8E1D5] relative pb-20 select-text">
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8] border-b border-[#8F98A8]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B79A5B]" />
            <span>SECTOR 05 &middot; PHILOSOPHY & MINDSET</span>
          </div>
          <span>44.0 AU</span>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#E8E1D5] tracking-tight leading-none">
            Mindset & Endurance
          </h1>

          <p className="font-display text-lg sm:text-xl text-[#B79A5B] italic max-w-xl leading-relaxed">
            &ldquo;Quiet intensity, repetition, resistance, and the relentless discipline of the unfinished climb.&rdquo;
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-2">
          <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
            The Governing Axiom
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
            The Standard
          </h2>
        </div>

        <div className="border-l-2 border-[#B79A5B] pl-6 py-2 space-y-2 max-w-xl">
          <blockquote className="font-display text-xl sm:text-2xl font-light text-[#E8E1D5] italic leading-relaxed">
            &ldquo;{MINDSET_DATA.theStandardStatement}&rdquo;
          </blockquote>
          <p className="text-xs sm:text-sm text-[#8F98A8] leading-relaxed pt-2">
            {MINDSET_DATA.overview}
          </p>
        </div>
      </section>

      <section className="space-y-8 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] text-[#4E8F89] tracking-wider uppercase block">
            Benchmarks
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
            Primary Influences
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MINDSET_DATA.influences.map((inf) => (
            <div
              key={inf.id}
              className="p-5 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/50 space-y-3"
            >
              <div className="flex items-baseline justify-between border-b border-[#8F98A8]/10 pb-2">
                <h3 className="font-display text-xl font-medium text-[#E8E1D5]">
                  {inf.name}
                </h3>
                <span className="font-mono text-[10px] text-[#B79A5B]">
                  {inf.role}
                </span>
              </div>

              <blockquote className="font-display text-sm font-light text-[#E8E1D5] italic leading-relaxed">
                &ldquo;{inf.verifiedQuote}&rdquo;
              </blockquote>

              <p className="font-body text-xs text-[#8F98A8] leading-relaxed">
                {inf.contextAndInterpretation}
              </p>

              <span className="font-mono text-[9px] text-[#8F98A8]/60 block pt-1">
                Attribution: {inf.attribution}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-8 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-1">
          <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
            Trajectory
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
            The Long Game
          </h2>
        </div>

        <div className="border-l border-[#8F98A8]/20 pl-6 space-y-6 max-w-xl">
          {MINDSET_DATA.theLongGame.map((stage, idx) => (
            <div key={idx} className="relative space-y-1">
              <span className="absolute -left-[31px] top-1.5 h-2 w-2 rounded-full border border-[#B79A5B] bg-[#080B12]" />
              <div className="flex items-baseline gap-3">
                <h4 className="font-display text-xl font-medium text-[#E8E1D5]">
                  {stage.stage}
                </h4>
                <span className="font-mono text-xs text-[#B79A5B]">
                  &middot; {stage.theme}
                </span>
              </div>
              <p className="font-display text-sm text-[#8F98A8] italic leading-relaxed">
                &ldquo;{stage.description}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveWorld('central')}
            className="px-5 py-2 rounded-full border border-[#B79A5B]/40 bg-[#10151D] font-body text-xs text-[#E8E1D5] hover:border-[#B79A5B] hover:text-[#B79A5B] transition-colors"
          >
            Return to Core: Raghav &rarr;
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
