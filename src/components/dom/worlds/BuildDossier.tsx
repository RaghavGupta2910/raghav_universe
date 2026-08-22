'use client';

import { useState, useEffect } from 'react';
import { BuildWorldData } from '@/types/build';
import { HANDLES_CONFIG } from '@/config/handles';
import { useUniverseStore } from '@/hooks/useUniverseStore';

export function BuildDossier() {
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

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
    <div className="space-y-16 font-body text-[#E8E1D5] relative pb-20 select-text">
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8] border-b border-[#8F98A8]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B79A5B]" />
            <span>SECTOR 02 &middot; ENGINEERING WORKSHOP</span>
          </div>
          <span>19.0 AU</span>
        </div>

        <div className="space-y-3 pt-2">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#E8E1D5] tracking-tight leading-none">
            Build & Systems
          </h1>

          <p className="font-display text-lg sm:text-xl text-[#B79A5B] italic max-w-xl leading-relaxed">
            &ldquo;Software architectures engineered from first principles. Real-world systems sourced from verified GitHub repositories.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8F98A8] pt-2">
            <span>Verified GitHub Source</span>
            <span>&middot;</span>
            <a
              href={HANDLES_CONFIG.github.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#E8E1D5] hover:text-[#B79A5B] transition-colors"
            >
              @{HANDLES_CONFIG.github.username} ↗
            </a>
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="p-10 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/60 text-center font-mono text-xs text-[#8F98A8] animate-pulse">
          Opening workshop blueprints...
        </div>
      )}

      {!isLoading && error && (
        <div className="p-6 rounded-xl border border-[#8B4F4F]/40 bg-[#8B4F4F]/10 space-y-1 font-body text-xs text-[#E8E1D5]">
          <span className="font-mono text-[#8B4F4F] font-semibold block">REPOSITORY ARCHIVE UNAVAILABLE</span>
          <p className="text-[#8F98A8] text-[11px]">
            GitHub repository data could not be retrieved ({error}).
          </p>
        </div>
      )}

      {!isLoading && data && (
        <>
          <section className="space-y-10 border-t border-[#8F98A8]/15 pt-10">
            <div className="space-y-1">
              <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
                Primary Artifacts
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                Engineered Projects
              </h2>
            </div>

            {hasCompletedProjects ? (
              <div className="space-y-10">
                {data.completed.map((project, idx) => (
                  <article
                    key={project.id}
                    className="p-6 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/50 space-y-4"
                  >
                    <div className="flex items-baseline justify-between border-b border-[#8F98A8]/10 pb-3">
                      <span className="font-mono text-[10px] text-[#B79A5B] uppercase tracking-wider">
                        Artifact {idx + 1 < 10 ? `0${idx + 1}` : idx + 1} &middot; {project.category}
                      </span>
                      <span className="font-mono text-[10px] text-[#4E8F89]">
                        Verified
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-display text-2xl sm:text-3xl font-medium text-[#E8E1D5]">
                        {project.name}
                      </h3>
                      {project.tagline && (
                        <p className="font-mono text-xs text-[#B79A5B]">
                          {project.tagline}
                        </p>
                      )}
                      <p className="font-body text-xs sm:text-sm text-[#8F98A8] leading-relaxed pt-1">
                        {project.description}
                      </p>
                    </div>

                    {project.highlights && project.highlights.length > 0 && (
                      <div className="space-y-2 border-l border-[#B79A5B]/40 pl-4 py-1">
                        <span className="font-mono text-[10px] text-[#8F98A8] uppercase tracking-wider block">
                          Technical Invariants
                        </span>
                        {project.highlights.map((h, hIdx) => (
                          <p key={hIdx} className="text-xs text-[#E8E1D5] leading-relaxed">
                            &middot; {h}
                          </p>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 pt-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full border border-[#8F98A8]/15 bg-[#080B12]/60 font-mono text-[10px] text-[#8F98A8]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 pt-3 border-t border-[#8F98A8]/10 font-mono text-xs">
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E8E1D5] hover:text-[#B79A5B] transition-colors"
                        >
                          Inspect Repository ↗
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#E8E1D5] hover:text-[#4E8F89] transition-colors"
                        >
                          Live Interface ↗
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/40 space-y-3">
                <span className="font-mono text-xs text-[#B79A5B] block">
                  GitHub Profile Synchronized
                </span>
                <p className="text-xs text-[#8F98A8]">
                  Explore all live public repositories on the verified profile.
                </p>
                <a
                  href={HANDLES_CONFIG.github.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-1.5 rounded-full border border-[#B79A5B]/40 font-mono text-xs text-[#E8E1D5] hover:border-[#B79A5B] transition-colors"
                >
                  Explore GitHub Profile ↗
                </a>
              </div>
            )}
          </section>

          {hasUnderConstruction && (
            <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
              <div className="space-y-1">
                <span className="font-mono text-[11px] text-[#4E8F89] tracking-wider uppercase block">
                  Active Prototyping
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
                  Under Construction
                </h2>
              </div>

              <div className="space-y-4">
                {data.underConstruction.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-xl border border-[#8F98A8]/15 bg-[#10151D]/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-[#8F98A8]">{proj.category}</span>
                      <span className="text-[#4E8F89]">In Progress</span>
                    </div>

                    <h4 className="font-display text-xl font-medium text-[#E8E1D5]">
                      {proj.name}
                    </h4>

                    <p className="font-body text-xs text-[#8F98A8] leading-relaxed">
                      {proj.shortDescription}
                    </p>

                    {proj.currentState && (
                      <span className="font-mono text-[10px] text-[#B79A5B] block pt-1">
                        State: {proj.currentState}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setActiveWorld('music')}
            className="px-5 py-2 rounded-full border border-[#B79A5B]/40 bg-[#10151D] font-body text-xs text-[#E8E1D5] hover:border-[#B79A5B] hover:text-[#B79A5B] transition-colors"
          >
            Traverse to Sector 03: Music &rarr;
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
