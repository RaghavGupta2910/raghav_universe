'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { CameraRig } from './CameraRig';
import { Starfield } from './Starfield';
import { MultiverseField } from './MultiverseField';
import { PlanetSystem } from './PlanetSystem';
import { Lighting } from './Lighting';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { MULTIVERSE_START_CAMERA } from '@/config/planets';

export function UniverseCanvas() {
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);
  const { dpr } = useDeviceCapability();

  return (
    <div className="fixed inset-0 z-0 bg-[#080B12] overflow-hidden select-none pointer-events-auto touch-none">
      <Canvas
        camera={{
          position: MULTIVERSE_START_CAMERA.position,
          fov: 45,
          near: 0.1,
          far: 2000,
        }}
        dpr={dpr}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
        onPointerMissed={() => {
          if (isEntryComplete && activeWorld) {
            resetToUniverse();
          }
        }}
      >
        <CameraRig />
        <Lighting />
        <Suspense fallback={null}>
          <MultiverseField />
          <Starfield />
          <PlanetSystem />
        </Suspense>
      </Canvas>
    </div>
  );
}
