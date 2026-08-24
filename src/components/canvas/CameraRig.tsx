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

const START_RADIUS = Math.hypot(
  MULTIVERSE_START_CAMERA.position[0],
  MULTIVERSE_START_CAMERA.position[1],
  MULTIVERSE_START_CAMERA.position[2]
);
const START_PHI = Math.acos(
  MULTIVERSE_START_CAMERA.position[1] / START_RADIUS
);

const DEFAULT_UNIVERSE_RADIUS = Math.hypot(
  UNIVERSE_VIEW_CAMERA.position[0],
  UNIVERSE_VIEW_CAMERA.position[1],
  UNIVERSE_VIEW_CAMERA.position[2]
);
const DEFAULT_UNIVERSE_PHI = Math.acos(
  UNIVERSE_VIEW_CAMERA.position[1] / DEFAULT_UNIVERSE_RADIUS
);

const MIN_RADIUS = 13.5;
const MAX_RADIUS = START_RADIUS;
const MIN_PHI = 0.08;
const MAX_PHI = Math.PI - 0.12;

export function CameraRig() {
  const { camera, gl, pointer } = useThree();

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

  // Spherical coordinate state for 360° universe exploration
  const currentRadius = useRef(START_RADIUS);
  const targetRadius = useRef(DEFAULT_UNIVERSE_RADIUS);

  const currentPhi = useRef(START_PHI);
  const targetPhi = useRef(DEFAULT_UNIVERSE_PHI);

  const currentTheta = useRef(0);
  const targetTheta = useRef(0);

  const isDragging = useRef(false);
  const lastPointerPos = useRef({ x: 0, y: 0 });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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

  // Pointer and touch interaction for 360° orbiting & smooth zoom
  useEffect(() => {
    const domElement = gl.domElement;
    if (!domElement) return;

    const handlePointerDown = (e: PointerEvent) => {
      const state = useUniverseStore.getState();
      if (!state.isEntryComplete || state.activeWorld) return;

      // Primary button or touch
      if (e.button === 0) {
        isDragging.current = true;
        lastPointerPos.current = { x: e.clientX, y: e.clientY };
        document.body.style.cursor = 'grabbing';
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const state = useUniverseStore.getState();
      if (!isDragging.current || !state.isEntryComplete || state.activeWorld) return;

      const deltaX = e.clientX - lastPointerPos.current.x;
      const deltaY = e.clientY - lastPointerPos.current.y;
      lastPointerPos.current = { x: e.clientX, y: e.clientY };

      targetTheta.current -= deltaX * 0.0055;
      targetPhi.current = THREE.MathUtils.clamp(
        targetPhi.current - deltaY * 0.0055,
        MIN_PHI,
        MAX_PHI
      );
    };

    const handlePointerUp = () => {
      if (isDragging.current) {
        isDragging.current = false;
        document.body.style.cursor = 'auto';
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const state = useUniverseStore.getState();
      if (!state.isEntryComplete) return;

      if (state.activeWorld) {
        // Zooming out while inspecting returns to orbital universe view
        if (e.deltaY > 30) {
          state.resetToUniverse();
        }
        return;
      }

      e.preventDefault();
      const zoomFactor = Math.exp(e.deltaY * 0.0016);
      targetRadius.current = THREE.MathUtils.clamp(
        targetRadius.current * zoomFactor,
        MIN_RADIUS,
        MAX_RADIUS
      );
    };

    // Multi-touch gestures (orbit + pinch zoom)
    let initialTouchDist: number | null = null;
    let initialTouchRadius = targetRadius.current;

    const handleTouchStart = (e: TouchEvent) => {
      const state = useUniverseStore.getState();
      if (!state.isEntryComplete || state.activeWorld) return;

      if (e.touches.length === 1) {
        isDragging.current = true;
        lastPointerPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        initialTouchDist = null;
      } else if (e.touches.length === 2) {
        isDragging.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialTouchDist = Math.hypot(dx, dy);
        initialTouchRadius = targetRadius.current;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const state = useUniverseStore.getState();
      if (!state.isEntryComplete || state.activeWorld) return;

      if (e.touches.length === 1 && isDragging.current) {
        const deltaX = e.touches[0].clientX - lastPointerPos.current.x;
        const deltaY = e.touches[0].clientY - lastPointerPos.current.y;
        lastPointerPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        targetTheta.current -= deltaX * 0.006;
        targetPhi.current = THREE.MathUtils.clamp(
          targetPhi.current - deltaY * 0.006,
          MIN_PHI,
          MAX_PHI
        );
      } else if (e.touches.length === 2 && initialTouchDist !== null && initialTouchDist > 0) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDist = Math.hypot(dx, dy);
        const scale = initialTouchDist / currentDist;
        targetRadius.current = THREE.MathUtils.clamp(
          initialTouchRadius * scale,
          MIN_RADIUS,
          MAX_RADIUS
        );
      }
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
      initialTouchDist = null;
    };

    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });
    domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [gl.domElement]);

  useFrame((_state, delta) => {
    // 1. Cinematic Intro Animation
    if (!isEntryComplete) {
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

      // Keep spherical coordinates in sync so transition to user controls is completely seamless
      const rIntro = Math.hypot(curX, curY, curZ);
      const phiIntro = Math.acos(THREE.MathUtils.clamp(curY / Math.max(rIntro, 0.001), -1, 1));
      currentRadius.current = rIntro;
      targetRadius.current = rIntro;
      currentPhi.current = phiIntro;
      targetPhi.current = phiIntro;
      currentTheta.current = 0;
      targetTheta.current = 0;
      return;
    }

    const lerpSpeed = prefersReducedMotion ? 0.3 : 0.055;

    // 2. Active World / Dossier Inspection Mode
    if (activeWorld) {
      const planet = PLANETS_CONFIG.find((p) => p.id === activeWorld);
      if (planet) {
        const hasLivePos = getCelestialWorldPosition(activeWorld, tempPlanetPos.current);
        const planetPos = hasLivePos ? tempPlanetPos.current : new THREE.Vector3(...planet.position);

        const inspectParallaxX = pointer.x * 0.2;
        const inspectParallaxY = pointer.y * 0.15;
        const comp = planet.composition;

        targetPosition.current.set(
          planetPos.x + comp.cameraPositionOffset[0] + inspectParallaxX,
          planetPos.y + comp.cameraPositionOffset[1] + inspectParallaxY,
          planetPos.z + comp.cameraPositionOffset[2]
        );

        targetLookAt.current.set(
          planetPos.x + comp.lookAtOffset[0],
          planetPos.y + comp.lookAtOffset[1],
          planetPos.z + comp.lookAtOffset[2]
        );

        const dist = camera.position.distanceTo(targetPosition.current);
        if (dist < 0.45) {
          setWorldTransitionStage('arrived');
        }
      }

      camera.position.lerp(targetPosition.current, lerpSpeed);
      currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
      camera.lookAt(currentLookAt.current);
    } else {
      // 3. Universe 360° Orbit & Seamless Zoom-Out to Multiverse External View
      const dampFactor = prefersReducedMotion ? 0.35 : 1 - Math.exp(-9.5 * delta);
      currentRadius.current = lerp(currentRadius.current, targetRadius.current, dampFactor);
      currentPhi.current = lerp(currentPhi.current, targetPhi.current, dampFactor);
      currentTheta.current = lerp(currentTheta.current, targetTheta.current, dampFactor);

      const r = currentRadius.current;
      const phi = currentPhi.current;
      const theta = currentTheta.current;

      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      let x = r * sinPhi * sinTheta;
      let y = r * cosPhi;
      let z = r * sinPhi * cosTheta;

      // Subtle ambient parallax when not actively dragging
      if (!isDragging.current) {
        const parallaxScale = THREE.MathUtils.clamp(r * 0.02, 0.4, 2.5);
        x += pointer.x * parallaxScale * cosTheta;
        z -= pointer.x * parallaxScale * sinTheta;
        y += pointer.y * parallaxScale * 0.6;
      }

      targetPosition.current.set(x, y, z);
      targetLookAt.current.set(0, 0, 0);

      camera.position.lerp(targetPosition.current, lerpSpeed);
      currentLookAt.current.lerp(targetLookAt.current, lerpSpeed);
      camera.lookAt(currentLookAt.current);
    }
  });

  return null;
}
