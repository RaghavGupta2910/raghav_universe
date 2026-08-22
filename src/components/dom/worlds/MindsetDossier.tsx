'use client';

import { MINDSET_DATA } from '@/config/mindset';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { ArrowRight, Quote } from 'lucide-react';

export function MindsetDossier() {
  const { setActiveWorld, resetToUniverse } = useUniverseStore();

  return (
    <div className="space-y-20 font-sans relative pb-20 select-text">
      {/* ========================================================================= */}
      {/* SCENE 01 — HERO EXHIBITION POSTER                                         */}
      {/* ========================================================================= */}
      <section className="space-y-8 pt-2 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase border-b border-amber-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>EXHIBITION 05 {'//'} SECTOR MINDSET</span>
            </div>
            <span className="text-slate-500">COORDINATES: 44.0 AU {'//'} -5.9S</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            <span>QUIET INTENSITY</span>
            <span>STANDARDS & VERIFIED INFLUENCES</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <span className="font-mono text-[10px] text-amber-400 tracking-[0.3em] uppercase block mb-1">
              THE PHILOSOPHICAL ENGINE
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
              MINDSET
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-amber-400 to-transparent mt-3" />
          </div>

          <p className="font-serif text-base sm:text-lg font-light text-slate-300 italic max-w-xl leading-relaxed">
            &ldquo;Quiet intensity, repetition, resistance, and the relentless discipline of the unfinished climb.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 pt-1">
            <span className="text-amber-300 font-semibold">The Standard</span>
            <span className="text-slate-700">•</span>
            <span className="text-cyan-300 font-semibold">Verified Influences</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-300 font-semibold">The Long Game</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 02 — THE STANDARD (CORE AXIOM)                                      */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-amber-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>01 {'//'} THE STANDARD</span>
          <span>THE UNCOMPROMISING BENCHMARK</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="border-l-2 border-amber-400 pl-5 py-2 space-y-1.5">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 block">
              THE GOVERNING AXIOM
            </span>
            <blockquote className="font-serif text-xl sm:text-2xl font-light text-slate-100 italic leading-relaxed">
              &ldquo;{MINDSET_DATA.theStandardStatement}&rdquo;
            </blockquote>
          </div>

          <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed pt-1">
            {MINDSET_DATA.overview}
          </p>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 03 — VERIFIED INFLUENCES                                            */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-amber-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>02 {'//'} INFLUENCES</span>
          <span>PRIMARY VERIFIED BENCHMARKS</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-2">
            <Quote className="h-5 w-5 text-amber-400" />
            PRIMARY INFLUENCES
          </h2>
          <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
            Verified words from competitors and practitioners who embody quiet intensity and relentless execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MINDSET_DATA.influences.map((inf) => (
            <div
              key={inf.id}
              className="border-l-2 border-amber-500/50 bg-slate-950/70 p-4 rounded-r-lg space-y-2 shadow-inner"
            >
              <div className="flex items-baseline justify-between border-b border-slate-900 pb-1.5">
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  {inf.name}
                </h3>
                <span className="font-mono text-[9px] text-amber-400/90 uppercase tracking-wider">
                  {inf.role}
                </span>
              </div>

              <blockquote className="font-serif text-xs sm:text-sm font-light text-slate-200 italic leading-relaxed">
                &ldquo;{inf.verifiedQuote}&rdquo;
              </blockquote>

              <p className="font-mono text-[10px] text-slate-400 pt-0.5">
                {'//'} {inf.contextAndInterpretation}
              </p>

              <span className="font-mono text-[9px] text-slate-500 block pt-0.5">
                Attribution: {inf.attribution}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 04 — THE LONG GAME (STAGES OF GROWTH)                               */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-amber-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>03 {'//'} THE LONG GAME</span>
          <span>THE UNFINISHED ASCENT</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100">
            THE LONG GAME
          </h2>
          <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
            The ongoing trajectory from initial foundations to cross-disciplinary synthesis and unbounded exploration.
          </p>
        </div>

        <div className="relative border-l border-slate-800 pl-5 space-y-6">
          {MINDSET_DATA.theLongGame.map((stage, idx) => (
            <div key={idx} className="relative space-y-1">
              <span className="absolute -left-[25px] top-1.5 h-2 w-2 rounded-full border border-amber-400 bg-slate-950" />
              <div className="flex items-baseline gap-2">
                <h4 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                  {stage.stage}
                </h4>
                <span className="font-mono text-[10px] text-amber-400">
                  {'//'} {stage.theme}
                </span>
              </div>
              <p className="font-serif text-xs font-light text-slate-300 italic leading-relaxed">
                &ldquo;{stage.description}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 05 — CODA & RETURN TO SOLAR CORE                                    */}
      {/* ========================================================================= */}
      <section className="space-y-6 border-t border-amber-900/40 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>04 {'//'} CODA</span>
          <span>THE RETURN TO ORIGIN</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            THE UNIVERSE TURNS ON DISCIPLINE.
          </h2>

          <p className="font-serif text-xs sm:text-sm font-light text-slate-300 italic leading-relaxed">
            &ldquo;Every orbit completes a cycle; every cycle deepens the standard. Return to the solar core to recommence exploration.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveWorld('central')}
              className="group flex items-center gap-2 rounded-full border border-amber-500/60 bg-amber-950/30 px-5 py-2 font-mono text-xs text-amber-300 backdrop-blur-md hover:bg-amber-900/40 hover:text-amber-200 transition-all focus:outline-none"
            >
              <span>RETURN TO CORE: RAGHAV</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={resetToUniverse}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/60 px-4 py-2 font-mono text-xs text-slate-400 hover:text-slate-100 hover:border-slate-700 transition-all focus:outline-none"
            >
              <span>RETURN TO ORBIT OVERVIEW [ESC]</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-slate-600 border-t border-slate-900 pt-4">
          <span>RAGHAV UNIVERSE // SECTOR 05</span>
          <span>DELHI, IN // 2026</span>
        </div>
      </section>
    </div>
  );
}
