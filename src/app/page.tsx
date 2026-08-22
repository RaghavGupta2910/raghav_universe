'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MultiverseIntro } from '@/components/dom/MultiverseIntro';
import { CentralIdentity } from '@/components/dom/CentralIdentity';
import { CelestialCompass } from '@/components/dom/CelestialCompass';
import { NavigationControls } from '@/components/dom/NavigationControls';
import { AudioToggle } from '@/components/dom/AudioToggle';
import { PlanetOverlay } from '@/components/dom/PlanetOverlay';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { WorldId } from '@/types/universe';
import { Orbit } from 'lucide-react';

// Dynamic import with SSR disabled — zero blocking fallback
const UniverseCanvas = dynamic(
  () =>
    import('@/components/canvas/UniverseCanvas').then((mod) => mod.UniverseCanvas),
  { ssr: false }
);

export default function Home() {
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const skipEntry = useUniverseStore((s) => s.skipEntry);

  // Check URL parameters for direct world navigation (e.g., returning from OAuth callback)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const worldParam = params.get('world') as WorldId | null;

      if (worldParam && ['central', 'code', 'build', 'music', 'create', 'mindset'].includes(worldParam)) {
        skipEntry();
        setActiveWorld(worldParam);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [setActiveWorld, skipEntry]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#02050f] select-none">
      {/* 3D WebGL Canvas Layer */}
      <UniverseCanvas />

      {/* Multiverse Scale Transition Intro */}
      <MultiverseIntro />

      {/* Foreground Semantic DOM Layer */}
      <CentralIdentity />
      <NavigationControls />
      <CelestialCompass />
      <AudioToggle />
      <PlanetOverlay />

      {/* Floating Exploration Prompt (Shown in Overview Mode after Entry) */}
      {isEntryComplete && !activeWorld && (
        <div className="pointer-events-none fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 text-center animate-pulse">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800/80 bg-slate-950/70 px-4 py-1.5 font-mono text-[11px] text-slate-400 backdrop-blur-md">
            <Orbit className="h-3.5 w-3.5 text-cyan-400 animate-spin" />
            <span className="hidden sm:inline">
              SELECT ANY CELESTIAL BODY TO COMMENCE APPROACH
            </span>
            <span className="sm:hidden">TAP A PLANET TO ENTER</span>
          </div>
        </div>
      )}
    </main>
  );
}
