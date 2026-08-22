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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const worldParam = params.get('world') as WorldId | null;

      if (worldParam && ['central', 'code', 'build', 'music', 'create'].includes(worldParam)) {
        skipEntry();
        setActiveWorld(worldParam);
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [setActiveWorld, skipEntry]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#080B12] select-none">
      <UniverseCanvas />
      <MultiverseIntro />
      <CentralIdentity />
      <NavigationControls />
      <CelestialCompass />
      <AudioToggle />
      <PlanetOverlay />

      {isEntryComplete && !activeWorld && (
        <div className="pointer-events-none fixed bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full border border-[#8F98A8]/15 bg-[#080B12]/60 font-body text-xs text-[#8F98A8] backdrop-blur-sm">
            <span className="h-1 w-1 rounded-full bg-[#B79A5B]" />
            <span>Select a celestial body to begin observation</span>
          </div>
        </div>
      )}
    </main>
  );
}
