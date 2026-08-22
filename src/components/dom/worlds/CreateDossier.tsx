'use client';

import { CREATE_DATA } from '@/config/create';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { ArrowRight, Music, Palette, Activity } from 'lucide-react';

export function CreateDossier() {
  const { setActiveWorld, resetToUniverse } = useUniverseStore();

  return (
    <div className="space-y-20 font-sans relative pb-20 select-text">
      {/* ========================================================================= */}
      {/* SCENE 01 — HERO EXHIBITION POSTER                                         */}
      {/* ========================================================================= */}
      <section className="space-y-8 pt-2 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400/80 tracking-widest uppercase border-b border-emerald-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>EXHIBITION 04 {'//'} SECTOR CREATE</span>
            </div>
            <span className="text-slate-500">COORDINATES: 35.0 AU {'//'} -6.4S</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            <span>POLYMATH DIMENSIONS</span>
            <span>TACTILE CRAFT & EMBODIED KINETICS</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <span className="font-mono text-[10px] text-emerald-400 tracking-[0.3em] uppercase block mb-1">
              THE PHYSICAL SPECTRUM
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
              CREATE
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-emerald-400 to-transparent mt-3" />
          </div>

          <p className="font-serif text-lg sm:text-xl font-light text-emerald-300/90 italic max-w-xl leading-relaxed">
            &ldquo;{CREATE_DATA.themeStatement}&rdquo;
          </p>

          <p className="font-serif text-xs sm:text-sm font-light text-slate-300 italic max-w-xl leading-relaxed">
            {CREATE_DATA.overview}
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 pt-1">
            <span className="text-emerald-300 font-semibold">Music & Frequencies</span>
            <span className="text-slate-700">•</span>
            <span className="text-cyan-300 font-semibold">Art & Tactile Filigree</span>
            <span className="text-slate-700">•</span>
            <span className="text-amber-300 font-semibold">Movement & Athletics</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 02 — MUSIC DISCIPLINES                                              */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-emerald-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400/80 tracking-widest uppercase">
          <span>01 {'//'} MUSIC</span>
          <span>ACOUSTIC RESONANCE</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-2">
            <Music className="h-5 w-5 text-emerald-400" />
            ACOUSTIC INSTRUMENTS & VOICE
          </h2>
          <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
            Direct acoustic expression across classical polyphony, embouchure intonation, and breath support.
          </p>
        </div>

        <div className="space-y-6">
          {CREATE_DATA.categories.music.map((item) => (
            <div key={item.id} className="border-b border-slate-900 pb-5 space-y-2">
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif text-xl font-bold text-slate-100">
                  {item.name}
                </h4>
                <span className="font-mono text-[10px] text-emerald-400">
                  {item.medium}
                </span>
              </div>

              <p className="font-serif text-xs italic text-slate-300 leading-relaxed">
                &ldquo;{item.description}&rdquo;
              </p>

              <div className="border-l-2 border-emerald-500/60 pl-3 py-1 text-xs text-slate-300 font-light">
                <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 block">
                  COGNITIVE CONNECTION
                </span>
                {item.creativePhilosophy}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] text-slate-400">
                {item.studioNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-300"
                  >
                    +{note}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 03 — ART & TACTILE CRAFT DISCIPLINES                                */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-emerald-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
          <span>02 {'//'} ART</span>
          <span>TACTILE GEOMETRIES & LINEWORK</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-2">
            <Palette className="h-5 w-5 text-cyan-400" />
            FINE ARTS, DRAWING & PAPER QUILLING
          </h2>
          <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
            Tangible, millimeter-scale physical patience transforming delicate materials into structural relief.
          </p>
        </div>

        <div className="space-y-6">
          {CREATE_DATA.categories.art.map((item) => (
            <div key={item.id} className="border-b border-slate-900 pb-5 space-y-2">
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif text-xl font-bold text-slate-100">
                  {item.name}
                </h4>
                <span className="font-mono text-[10px] text-cyan-400">
                  {item.medium}
                </span>
              </div>

              <p className="font-serif text-xs italic text-slate-300 leading-relaxed">
                &ldquo;{item.description}&rdquo;
              </p>

              <div className="border-l-2 border-cyan-500/60 pl-3 py-1 text-xs text-slate-300 font-light">
                <span className="font-mono text-[9px] uppercase tracking-wider text-cyan-400 block">
                  TACTILE PHILOSOPHY
                </span>
                {item.creativePhilosophy}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] text-slate-400">
                {item.studioNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-300"
                  >
                    +{note}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 04 — MOVEMENT & KINETIC ATHLETICS                                   */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-emerald-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>03 {'//'} MOVEMENT</span>
          <span>KINETIC AGILITY & BALANCE</span>
        </div>

        <div className="space-y-1.5">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-400" />
            DANCE, BASKETBALL & GYMNASTICS
          </h2>
          <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
            High-heart-rate split-second spatial decisions, aerial control, and full-body tension.
          </p>
        </div>

        <div className="space-y-6">
          {CREATE_DATA.categories.movement.map((item) => (
            <div key={item.id} className="border-b border-slate-900 pb-5 space-y-2">
              <div className="flex items-baseline justify-between">
                <h4 className="font-serif text-xl font-bold text-slate-100">
                  {item.name}
                </h4>
                <span className="font-mono text-[10px] text-amber-400">
                  {item.medium}
                </span>
              </div>

              <p className="font-serif text-xs italic text-slate-300 leading-relaxed">
                &ldquo;{item.description}&rdquo;
              </p>

              <div className="border-l-2 border-amber-500/60 pl-3 py-1 text-xs text-slate-300 font-light">
                <span className="font-mono text-[9px] uppercase tracking-wider text-amber-400 block">
                  KINETIC COGNITION
                </span>
                {item.creativePhilosophy}
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[10px] text-slate-400">
                {item.studioNotes.map((note) => (
                  <span
                    key={note}
                    className="rounded border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-300"
                  >
                    +{note}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE FINAL — CODA & TRAVERSAL                                            */}
      {/* ========================================================================= */}
      <section className="space-y-6 border-t border-emerald-900/40 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-emerald-400/80 tracking-widest uppercase">
          <span>04 {'//'} CODA</span>
          <span>THE COMPLETE SYNTHESIS</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            CRAFT REVEALS CHARACTER.
          </h2>

          <p className="font-serif text-xs sm:text-sm font-light text-slate-300 italic leading-relaxed">
            &ldquo;Whether shaping acoustic airflow through a flute or executing a split-second crossover, true craftsmanship requires complete presence and unwavering patience.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveWorld('mindset')}
              className="group flex items-center gap-2 rounded-full border border-amber-500/60 bg-amber-950/30 px-5 py-2 font-mono text-xs text-amber-300 backdrop-blur-md hover:bg-amber-900/40 hover:text-amber-200 transition-all focus:outline-none"
            >
              <span>TRAVERSE TO SECTOR 05: MINDSET</span>
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
          <span>RAGHAV UNIVERSE // SECTOR 04</span>
          <span>DELHI, IN // 2026</span>
        </div>
      </section>
    </div>
  );
}
