'use client';

import { IDENTITY_DATA } from '@/config/identity';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { ArrowRight, Mail, Code2 } from 'lucide-react';

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.4 1.4 0 1 0 0-2.8 1.4 1.4 0 0 0 0 2.8m1.4 9.74v-8.37H5.06v8.37z" />
    </svg>
  );
}

export function CentralDossier() {
  const { setActiveWorld, resetToUniverse } = useUniverseStore();

  return (
    <div className="space-y-20 font-sans relative pb-20 select-text">
      {/* ========================================================================= */}
      {/* SCENE 01 — HERO MONUMENTAL IDENTITY POSTER                                */}
      {/* ========================================================================= */}
      <section className="space-y-8 pt-2 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/90 tracking-widest uppercase border-b border-amber-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span>SOLAR CORE {'//'} SECTOR 00</span>
            </div>
            <span className="text-slate-500">{IDENTITY_DATA.coordinatesDisplay}</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            <span>CENTRAL GRAVITATIONAL ANCHOR</span>
            <span>SYSTEM: {IDENTITY_DATA.systemId}</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <span className="font-mono text-[10px] text-amber-400 tracking-[0.3em] uppercase block mb-1">
              PRIMARY ARCHITECT
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
              {IDENTITY_DATA.name.split(' ')[0]}<br />{IDENTITY_DATA.name.split(' ')[1]}
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-amber-400 to-transparent mt-3" />
          </div>

          <p className="font-serif text-base sm:text-lg font-light text-slate-300 italic max-w-xl leading-relaxed">
            &ldquo;{IDENTITY_DATA.field} undergraduate in {IDENTITY_DATA.location}. The universe turns on quiet discipline, algorithmic rigor, and creative balance.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 pt-1">
            <span className="text-amber-300 font-semibold">{IDENTITY_DATA.field}</span>
            <span className="text-slate-700">•</span>
            <span className="text-slate-300">{IDENTITY_DATA.location}</span>
            <span className="text-slate-700">•</span>
            <span className="text-cyan-300">Algorithmic Systems</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 02 — THE IDENTITY PILLAR                                            */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-amber-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>01 {'//'} ACADEMIC & PHYSICAL LOCATION</span>
          <span>FORMATION</span>
        </div>

        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 block">
            CORE IDENTITY
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-100 leading-tight">
            MATHEMATICS &<br />COMPUTING.
          </h2>

          <div className="border-l-2 border-amber-400 pl-5 py-1.5 space-y-1">
            <span className="font-mono text-[9px] uppercase tracking-widest text-amber-400 block">
              LOCATION BASE
            </span>
            <p className="font-serif text-base font-light text-slate-100 italic">
              Delhi, India // {IDENTITY_DATA.coordinatesDisplay}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-light text-slate-300 leading-relaxed max-w-xl">
          The central solar core establishes identity; the orbiting planetary sectors (Code, Build, Music, Create, Mindset) reveal the specific artifacts, disciplines, and philosophy.
        </p>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 03 — DIRECT TRANSMISSION CHANNELS                                   */}
      {/* ========================================================================= */}
      <section className="space-y-8 border-t border-amber-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-amber-400/80 tracking-widest uppercase">
          <span>02 {'//'} DIRECT TRANSMISSION</span>
          <span>CHANNELS & NETWORKS</span>
        </div>

        <div className="space-y-6 max-w-xl">
          <div className="space-y-1.5">
            <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100">
              INITIATE TRANSMISSION.
            </h2>
            <p className="font-serif text-xs sm:text-sm font-light text-slate-300 italic">
              Direct access portals across code repositories, competitive contest handles, and communication channels.
            </p>
          </div>

          <div className="space-y-2.5 font-mono text-xs pt-1">
            <a
              href={IDENTITY_DATA.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-b border-slate-900 hover:border-amber-400/60 hover:bg-slate-950/40 transition-all text-slate-300 hover:text-amber-300 group"
            >
              <div className="flex items-center gap-3">
                <GithubIcon className="h-4 w-4 text-amber-400" />
                <span className="font-semibold">GITHUB REPOSITORY ARCHIVE</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href={IDENTITY_DATA.socials.codeforces}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-b border-slate-900 hover:border-sky-400/60 hover:bg-slate-950/40 transition-all text-slate-300 hover:text-sky-300 group"
            >
              <div className="flex items-center gap-3">
                <Code2 className="h-4 w-4 text-sky-400" />
                <span className="font-semibold">CODEFORCES ARENA PROFILE</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href={IDENTITY_DATA.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 border-b border-slate-900 hover:border-blue-400/60 hover:bg-slate-950/40 transition-all text-slate-300 hover:text-blue-300 group"
            >
              <div className="flex items-center gap-3">
                <LinkedinIcon className="h-4 w-4 text-blue-400" />
                <span className="font-semibold">LINKEDIN NETWORK</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>

            <a
              href={`mailto:${IDENTITY_DATA.socials.email}`}
              className="flex items-center justify-between p-3.5 border-b border-slate-900 hover:border-rose-400/60 hover:bg-slate-950/40 transition-all text-slate-300 hover:text-rose-300 group"
            >
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-rose-400" />
                <span className="font-semibold">ELECTRONIC MAIL TRANSMISSION</span>
              </div>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={() => setActiveWorld('code')}
              className="group flex items-center gap-2 rounded-full border border-cyan-500/60 bg-cyan-950/30 px-5 py-2 font-mono text-xs text-cyan-300 backdrop-blur-md hover:bg-cyan-900/40 hover:text-cyan-200 transition-all focus:outline-none"
            >
              <span>TRAVERSE TO SECTOR 01: CODE</span>
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
          <span>RAGHAV UNIVERSE // CORE IDENTITY</span>
          <span>DELHI, IN // 2026</span>
        </div>
      </section>
    </div>
  );
}
