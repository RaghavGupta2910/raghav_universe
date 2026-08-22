'use client';

import { IDENTITY_DATA } from '@/config/identity';
import { useUniverseStore } from '@/hooks/useUniverseStore';

export function CentralDossier() {
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);

  return (
    <div className="space-y-16 font-body text-[#E8E1D5] relative pb-20 select-text">
      <section className="space-y-6 pt-2">
        <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8] border-b border-[#8F98A8]/15 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B79A5B]" />
            <span>SOLAR CORE &middot; PRIMARY FOLIO</span>
          </div>
          <span>{IDENTITY_DATA.coordinatesDisplay}</span>
        </div>

        <div className="space-y-4 pt-2">
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-normal text-[#E8E1D5] tracking-tight leading-none">
            {IDENTITY_DATA.name}
          </h1>

          <p className="font-display text-lg sm:text-xl text-[#B79A5B] italic max-w-xl leading-relaxed">
            &ldquo;Mathematics & Computing student in Delhi. This universe is an astronomical record of algorithmic rigor, engineered software, sound, and personal philosophy.&rdquo;
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#8F98A8] pt-2">
            <span className="text-[#E8E1D5]">{IDENTITY_DATA.field}</span>
            <span>&middot;</span>
            <span>{IDENTITY_DATA.location}</span>
            <span>&middot;</span>
            <span className="text-[#4E8F89]">Competitive Programming & Systems</span>
          </div>
        </div>
      </section>

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-3 max-w-xl">
          <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
            Archive Focus
          </span>

          <h2 className="font-display text-3xl sm:text-4xl font-normal text-[#E8E1D5]">
            The Intersection of Abstract Rigor & Applied Systems.
          </h2>

          <p className="text-sm text-[#8F98A8] leading-relaxed pt-2">
            My work centers on computational mathematics, competitive algorithmic problem solving, and building full-stack applications with spatial interfaces. Each planetary body in this universe represents an active domain of craft.
          </p>
        </div>
      </section>

      <section className="space-y-6 border-t border-[#8F98A8]/15 pt-10">
        <div className="space-y-2">
          <span className="font-mono text-[11px] text-[#B79A5B] tracking-wider uppercase block">
            Direct Portals
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-normal text-[#E8E1D5]">
            Connect & Read Archives
          </h2>
        </div>

        <div className="space-y-3 max-w-xl text-sm pt-2">
          <a
            href={IDENTITY_DATA.socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#8F98A8]/15 bg-[#10151D]/60 hover:border-[#B79A5B]/40 hover:bg-[#10151D] transition-colors group"
          >
            <span className="font-medium text-[#E8E1D5] group-hover:text-[#B79A5B]">GitHub</span>
            <span className="font-mono text-xs text-[#8F98A8]">↗</span>
          </a>

          <a
            href={IDENTITY_DATA.socials.leetcode || 'https://leetcode.com/u/raghavgupta2910/'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#8F98A8]/15 bg-[#10151D]/60 hover:border-[#B79A5B]/40 hover:bg-[#10151D] transition-colors group"
          >
            <span className="font-medium text-[#E8E1D5] group-hover:text-[#B79A5B]">LeetCode</span>
            <span className="font-mono text-xs text-[#8F98A8]">↗</span>
          </a>

          <a
            href={IDENTITY_DATA.socials.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#8F98A8]/15 bg-[#10151D]/60 hover:border-[#B79A5B]/40 hover:bg-[#10151D] transition-colors group"
          >
            <span className="font-medium text-[#E8E1D5] group-hover:text-[#B79A5B]">LinkedIn</span>
            <span className="font-mono text-xs text-[#8F98A8]">↗</span>
          </a>

          <a
            href={`mailto:${IDENTITY_DATA.socials.email}`}
            className="flex items-center justify-between p-3.5 rounded-lg border border-[#8F98A8]/15 bg-[#10151D]/60 hover:border-[#B79A5B]/40 hover:bg-[#10151D] transition-colors group"
          >
            <span className="font-medium text-[#E8E1D5] group-hover:text-[#B79A5B]">Email</span>
            <span className="font-mono text-xs text-[#8F98A8]">↗</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-6">
          <button
            onClick={() => setActiveWorld('code')}
            className="px-5 py-2 rounded-full border border-[#B79A5B]/40 bg-[#10151D] font-body text-xs text-[#E8E1D5] hover:border-[#B79A5B] hover:text-[#B79A5B] transition-colors"
          >
            Explore Sector 01: Code &rarr;
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
