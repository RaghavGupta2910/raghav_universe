'use client';

import { useState, useEffect } from 'react';
import { BuildWorldData } from '@/types/build';
import { HANDLES_CONFIG } from '@/config/handles';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { ArrowRight, ExternalLink, Hammer, AlertCircle, RefreshCw, User } from 'lucide-react';

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

export function BuildDossier() {
  const { setActiveWorld, resetToUniverse } = useUniverseStore();
  const [data, setData] = useState<BuildWorldData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/stats/github');
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
        }
        const json = await res.json();
        if (json.success && json.data) {
          setData(json.data);
        } else {
          throw new Error(json.error || 'GitHub repository telemetry unavailable');
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unable to connect to GitHub API';
        setError(msg);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }
    loadProjects();
  }, []);

  const hasCompletedProjects = (data?.completed?.length ?? 0) > 0;
  const hasUnderConstruction = (data?.underConstruction?.length ?? 0) > 0;

  return (
    <div className="space-y-20 font-sans relative pb-20 select-text">
      {/* ========================================================================= */}
      {/* SCENE 01 — HERO EXHIBITION POSTER                                         */}
      {/* ========================================================================= */}
      <section className="space-y-8 pt-2 relative">
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-[10px] text-orange-400/80 tracking-widest uppercase border-b border-orange-900/40 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span>EXHIBITION 02 {'//'} SECTOR BUILD</span>
            </div>
            <span className="text-slate-500">COORDINATES: 19.0 AU {'//'} -2.2S</span>
          </div>

          <div className="flex items-center justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
            <span>ENGINEERING WORKSHOP</span>
            <span>SYSTEMS ARCHITECTURE & SOFTWARE</span>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <div className="relative">
            <span className="font-mono text-[10px] text-orange-400 tracking-[0.3em] uppercase block mb-1">
              ARCHITECTURAL ARTIFACTS
            </span>
            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-100 leading-none">
              BUILD
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-orange-400 to-transparent mt-3" />
          </div>

          <p className="font-serif text-base sm:text-lg font-light text-slate-300 italic max-w-xl leading-relaxed">
            &ldquo;Software systems engineered from first principles. Sourced exclusively from verified GitHub repositories.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-slate-400 pt-1">
            <span className="text-orange-300 font-semibold">GitHub Source of Truth</span>
            <span className="text-slate-700">•</span>
            <span className="text-cyan-300 font-semibold">Live Pipeline</span>
            <span className="text-slate-700">•</span>
            <span className="text-emerald-300 font-semibold">Account: @{HANDLES_CONFIG.github.username}</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SCENE 02 — REPOSITORIES OR DATA UNAVAILABLE                                */}
      {/* ========================================================================= */}
      <section className="space-y-12 border-t border-orange-900/30 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-orange-400/80 tracking-widest uppercase">
          <span>01 {'//'} COMPLETED ARTIFACTS</span>
          <span>VERIFIED & DEPLOYED</span>
        </div>

        {isLoading ? (
          <div className="p-8 border border-slate-800 rounded-lg bg-slate-950/60 text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-3 animate-pulse">
            <RefreshCw className="h-4 w-4 animate-spin text-orange-400" />
            <span>SYNCHRONIZING GITHUB REPOSITORIES...</span>
          </div>
        ) : error || !data ? (
          /* Strict Data Integrity: Explicit DATA UNAVAILABLE state */
          <div className="border border-rose-900/50 bg-rose-950/20 p-6 rounded-lg space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-rose-400 font-bold">
              <AlertCircle className="h-4 w-4" />
              <span>DATA UNAVAILABLE</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              GitHub repository telemetry could not be retrieved ({error || 'Connection Failed'}).
            </p>
            <p className="text-slate-500 text-[11px]">
              In accordance with our strict Data Correctness Rule, template projects and fabricated repositories are never displayed.
            </p>
          </div>
        ) : hasCompletedProjects ? (
          <div className="space-y-12">
            {data.completed.map((project, idx) => (
              <div key={project.id} className="space-y-4">
                <div className="flex items-baseline justify-between border-b border-slate-900 pb-2">
                  <span className="font-mono text-[10px] text-orange-400 uppercase tracking-widest">
                    ARTIFACT 0{idx + 1} {'//'} {project.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[10px] text-emerald-400 font-semibold">
                    ● COMPLETED
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-100 leading-tight">
                    {project.name}
                  </h3>
                  <p className="font-mono text-xs text-orange-300/90 tracking-wide uppercase">
                    {project.tagline}
                  </p>
                  <p className="font-serif text-sm font-light text-slate-300 italic max-w-xl leading-relaxed">
                    &ldquo;{project.description}&rdquo;
                  </p>
                </div>

                {/* Specifications */}
                {project.highlights && project.highlights.length > 0 && (
                  <div className="space-y-1.5 border-l-2 border-orange-500/60 bg-orange-950/10 p-4 rounded-r-lg">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-orange-400 block mb-1">
                      ENGINEERING SPECIFICATIONS & INVARIANTS
                    </span>
                    {project.highlights.map((highlight, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-400 mt-1 shrink-0" />
                        <span className="leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metrics & Technologies */}
                <div className="space-y-3 pt-1">
                  {project.metrics && project.metrics.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono text-xs border-b border-slate-900 pb-2.5">
                      {project.metrics.map((metric) => (
                        <div key={metric.label} className="space-y-0.5">
                          <span className="text-[9px] text-slate-500 uppercase">{metric.label}</span>
                          <span className="font-serif text-base sm:text-lg font-bold text-slate-100 block">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px] text-slate-400">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-slate-800 bg-slate-950/60 px-2 py-0.5 text-slate-300"
                      >
                        #{tech}
                      </span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-6 pt-1 font-mono text-xs">
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition-colors group"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        <span>INSPECT REPOSITORY</span>
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-orange-400 transition-colors group"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>LIVE INTERFACE</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border border-orange-900/40 bg-orange-950/20 p-6 rounded-lg space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-orange-400 block">
                  NO FEATURED REPOSITORIES CURRENTLY PUBLISHED
                </span>
                <h4 className="font-serif text-lg font-bold text-slate-100">
                  GitHub Portfolio Synchronized
                </h4>
              </div>
            </div>

            <p className="text-xs font-light text-slate-300 leading-relaxed">
              No repositories in account @{HANDLES_CONFIG.github.username} are currently curated as completed portfolio artifacts.
            </p>

            <div className="pt-2">
              <a
                href={HANDLES_CONFIG.github.profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-orange-500/60 bg-orange-950/40 px-4 py-2 font-mono text-xs text-orange-300 hover:bg-orange-900/50 hover:text-orange-100 transition-all"
              >
                <User className="h-3.5 w-3.5" />
                <span>EXPLORE GITHUB PROFILE</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SCENE 03 — UNDER CONSTRUCTION (ACTIVE DEVELOPMENTS)                        */}
      {/* ========================================================================= */}
      {hasUnderConstruction && data && (
        <section className="space-y-8 border-t border-orange-900/30 pt-12 relative">
          <div className="flex items-center justify-between font-mono text-[10px] text-cyan-400/80 tracking-widest uppercase">
            <span>02 {'//'} UNDER CONSTRUCTION</span>
            <span>ACTIVE DEVELOPMENTS</span>
          </div>

          <div className="space-y-1.5">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-100 flex items-center gap-2">
              <Hammer className="h-5 w-5 text-cyan-400" />
              UNDER CONSTRUCTION
            </h2>
            <p className="text-sm font-light text-slate-300 max-w-lg leading-relaxed">
              Active architectural engines and systems currently being built in the workshop.
            </p>
          </div>

          <div className="space-y-6">
            {data.underConstruction.map((project) => (
              <div
                key={project.id}
                className="border-b border-slate-900 pb-5 space-y-2"
              >
                <div className="flex items-baseline justify-between">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                    SECTOR: {project.category.toUpperCase()}
                  </span>
                  <span className="font-mono text-[9px] font-semibold text-cyan-300 animate-pulse uppercase tracking-wider">
                    ● UNDER CONSTRUCTION
                  </span>
                </div>

                <h4 className="font-serif text-xl font-bold text-slate-100">
                  {project.name}
                </h4>

                <div className="font-mono text-xs text-cyan-400">
                  {'//'} Current State: {project.currentState}
                </div>

                <p className="font-serif text-xs italic text-slate-300 leading-relaxed">
                  &ldquo;{project.shortDescription}&rdquo;
                </p>

                {project.progressPercent && (
                  <div className="pt-1.5 space-y-1">
                    <div className="flex justify-between font-mono text-[9px] text-cyan-300">
                      <span>DEVELOPMENT PROGRESS</span>
                      <span>{project.progressPercent}% COMPLETE</span>
                    </div>
                    <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${project.progressPercent}%` }}
                        className="h-full bg-cyan-400 rounded-full transition-all duration-700"
                      />
                    </div>
                  </div>
                )}

                {project.expectedMilestone && (
                  <span className="font-mono text-[9px] text-slate-400 block pt-0.5">
                    Target Milestone: {project.expectedMilestone}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SCENE FINAL — CODA & TRAVERSAL                                            */}
      {/* ========================================================================= */}
      <section className="space-y-6 border-t border-orange-900/40 pt-12 relative">
        <div className="flex items-center justify-between font-mono text-[10px] text-orange-400/80 tracking-widest uppercase">
          <span>03 {'//'} CODA</span>
          <span>SYSTEMS EQUILIBRIUM</span>
        </div>

        <div className="space-y-4 max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            ENGINEERED WITH RIGOR.
          </h2>

          <p className="font-serif text-xs sm:text-sm font-light text-slate-300 italic leading-relaxed">
            &ldquo;Software systems achieve permanence when their internal architecture mirrors the mathematical laws of the problem space.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => setActiveWorld('music')}
              className="group flex items-center gap-2 rounded-full border border-purple-500/60 bg-purple-950/30 px-5 py-2 font-mono text-xs text-purple-300 backdrop-blur-md hover:bg-purple-900/40 hover:text-purple-200 transition-all focus:outline-none"
            >
              <span>TRAVERSE TO SECTOR 03: MUSIC</span>
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
          <span>RAGHAV UNIVERSE // SECTOR 02</span>
          <span>DELHI, IN // 2026</span>
        </div>
      </section>
    </div>
  );
}
