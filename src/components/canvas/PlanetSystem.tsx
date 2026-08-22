'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { PLANETS_CONFIG } from '@/config/planets';
import { PlanetMesh } from './PlanetMesh';
import { CentralStar } from './CentralStar';
import { generateOrbitalRingPoints } from '@/lib/math';

export function PlanetSystem() {
  const nonCentralPlanets = useMemo(
    () => PLANETS_CONFIG.filter((p) => p.id !== 'central'),
    []
  );

  // Pre-generate orbital path line objects
  const orbitalRingObjects = useMemo(() => {
    return nonCentralPlanets.map((planet) => {
      const points = generateOrbitalRingPoints(
        planet.orbitalRadius,
        planet.orbitalInclination,
        128
      );
      const geometry = new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(points, 3)
      );
      const material = new THREE.LineBasicMaterial({
        color: planet.glowColor,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      });
      return {
        id: planet.id,
        line: new THREE.Line(geometry, material),
      };
    });
  }, [nonCentralPlanets]);

  return (
    <group>
      {/* Central Star: RAGHAV */}
      <CentralStar />

      {/* Orbital Trajectory Lines */}
      {orbitalRingObjects.map((ring) => (
        <primitive key={`orbit-${ring.id}`} object={ring.line} />
      ))}

      {/* Planetary Bodies */}
      {nonCentralPlanets.map((planet) => (
        <PlanetMesh key={planet.id} planet={planet} />
      ))}
    </group>
  );
}
