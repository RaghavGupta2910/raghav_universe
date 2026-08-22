'use client';

import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import {
  PLANETS_CONFIG,
  UNIVERSE_VIEW_CAMERA,
  MULTIVERSE_START_CAMERA,
} from '@/config/planets';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { lerp } from '@/lib/math';
import { getCelestialWorldPosition } from '@/lib/spatial/celestialRegistry';

export function CameraRig() {
  const { camera, pointer } = useThree();

  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);
  const activeWorld = useUniverseStore((s) => s.activeWorld);
  const entryProgress = useUniverseStore((s) => s.entryProgress);

  const setWorldTransitionStage = useUniverseStore((s) => s.setWorldTransitionStage);
  const navigateNext = useUniverseStore((s) => s.navigateNext);
  const navigatePrev = useUniverseStore((s) => s.navigatePrev);
  const resetToUniverse = useUniverseStore((s) => s.resetToUniverse);
  const toggleOrbiting = useUniverseStore((s) => s.toggleOrbiting);

  const prefersReducedMotion = usePrefersReducedMotion();

  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const targetPosition = useRef(new THREE.Vector3(...MULTIVERSE_START_CAMERA.position));
  const targetLookAt = useRef(new THREE.Vector3(...MULTIVERSE_START_CAMERA.lookAt));
  const tempPlanetPos = useRef(new THREE.Vector3());

  useEffect(() => {
    console.log('[CAMERA] mounted');
  }, []);

  // Global Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigatePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        resetToUniverse();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleOrbiting();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateNext, navigatePrev, resetToUniverse, toggleOrbiting]);

  useFrame(() => {
    // 1. MULTIVERSE ENTRANCE SEQUENCE (Reacts purely to DOM-driven entryProgress)
    if (!isEntryComplete) {
      // Non-linear cinematic camera trajectory (Cubic Ease In-Out)
      const easeProgress = prefersReducedMotion
        ? entryProgress
        : entryProgress < 0.5
        ? 4 * entryProgress * entryProgress * entryProgress
        : 1 - Math.pow(-2 * entryProgress + 2, 3) / 2;

      const curX = lerp(MULTIVERSE_START_CAMERA.position[0], UNIVERSE_VIEW_CAMERA.position[0], easeProgress);
      const curY = lerp(MULTIVERSE_START_CAMERA.position[1], UNIVERSE_VIEW_CAMERA.position[1], easeProgress);
      const curZ = lerp(MULTIVERSE_START_CAMERA.position[2], UNIVERSE_VIEW_CAMERA.position[2], easeProgress);

      targetPosition.current.set(curX, curY, curZ);
      targetLookAt.current.set(0, 0, 0);

      camera.position.copy(targetPosition.current);
      currentLookAt.current.copy(targetLookAt.current);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // 2. INTERACTIVE EXPLORATION & AUTHORITATIVE PLANET CAMERA TARGETING
    const lerpSpeed = prefersReducedMotion ? 0.3 : 0.052;

    if (activeWorld) {
      const planet = PLANETS_CONFIG.find((p) => p.id === activeWorld);
      if (planet) {
        // Query the live world-space coordinates of the actual planet mesh
        const hasLivePos = getCelestialWorldPosition(activeWorld, tempPlanetPos.current);
        const planetPos = hasLivePos ? tempPlanetPos.current : new THREE.Vector3(...planet.position);

        const inspectParallaxX = pointer.x * 0.2;
        const inspectParallaxY = pointer.y * 0.15;
        const comp = planet.composition;

        // Camera position is strictly derived relative to the live planet
        targetPosition.current.set(
          planetPos.x + comp.cameraPositionOffset[0] + inspectParallaxX,
          planetPos.y + comp.cameraPositionOffset[1] + inspectParallaxY,
          planetPos.z + comp.cameraPositionOffset[2]
        );

        // Camera lookAt is strictly targeted at the live planet
        targetLookAt.current.set(
          planetPos.x + comp.lookAtOffset[0],
          planetPos.y + comp.lookAtOffset[1],
          planetPos.z + comp.lookAtOffset[2]
        );

        // Check if camera has reached close proximity to frame the planet
        const dist = camera.position.distanceTo(targetPosition.current);
        if (dist < 0.45) {
          setWorldTransitionStage('arrived');
        }
      }
    } else {
      // Global Universe Overview with gentle pointer parallax
      const parallaxX = pointer.x * 3.5;
      const parallaxY = pointer.y * 2.0;

      targetPosition.current.set(
        UNIVERSE_VIEW_CAMERA.position[0] + parallaxX,
        UNIVERSE_VIEW_CAMERA.position[1] + parallaxY,
        UNIVERSE_VIEW_CAMERA.position[2]
      );

      targetLookAt.current.set(0, 0, 0);
    }

    camera.position.lerp(targetPosition.current, lerpSpeed);
    currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
