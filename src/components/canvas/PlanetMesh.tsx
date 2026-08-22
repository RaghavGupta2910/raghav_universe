'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CelestialBody } from '@/types/universe';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { CodePlanetShader, CelestialPlanetShader } from '@/lib/shaders/PlanetShaders';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { calculateOrbitalPosition, generateOrbitalRingPoints, lerp } from '@/lib/math';
import { registerCelestialObject, unregisterCelestialObject } from '@/lib/spatial/celestialRegistry';

interface PlanetMeshProps {
  planet: CelestialBody;
}

export function PlanetMesh({ planet }: PlanetMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const ringGroupRef = useRef<THREE.Group>(null);

  const isSelected = useUniverseStore((s) => s.activeWorld === planet.id);
  const isHovered = useUniverseStore((s) => s.hoveredWorld === planet.id);
  const isOrbitingEnabled = useUniverseStore((s) => s.isOrbitingEnabled);
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const setHoveredWorld = useUniverseStore((s) => s.setHoveredWorld);

  const currentAngleRef = useRef(planet.initialAngle);
  const hoveredLerp = useRef(0);

  // Register live world object in spatial registry
  useEffect(() => {
    if (groupRef.current) {
      registerCelestialObject(planet.id, groupRef.current);
    }
    return () => {
      unregisterCelestialObject(planet.id);
    };
  }, [planet.id]);

  // Outer Atmospheric Scattering Halo
  const atmosphereMaterial = useMemo(
    () => createAtmosphereMaterial(planet.atmosphereColor, 0.75, 2.4, 0.65),
    [planet.atmosphereColor]
  );

  // Planetary rings for BUILD and CREATE
  const ringLineObject = useMemo(() => {
    if (planet.id === 'build' || planet.id === 'create') {
      const points = generateOrbitalRingPoints(planet.size * 1.75, 0.35, 96);
      const geometry = new THREE.BufferGeometry().setAttribute(
        'position',
        new THREE.BufferAttribute(points, 3)
      );
      const material = new THREE.LineBasicMaterial({
        color: planet.glowColor,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
      });
      return new THREE.Line(geometry, material);
    }
    return null;
  }, [planet.id, planet.size, planet.glowColor]);

  const isCode = planet.id === 'code';
  const typeIndex =
    planet.id === 'build'
      ? 0
      : planet.id === 'music'
      ? 1
      : planet.id === 'create'
      ? 2
      : 3;

  // Memoized Uniforms
  const codeUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorBase: { value: new THREE.Color(planet.baseColor) },
      uColorGlow: { value: new THREE.Color(planet.glowColor) },
      uColorAtmosphere: { value: new THREE.Color(planet.atmosphereColor) },
      uHovered: { value: 0 },
    }),
    [planet.baseColor, planet.glowColor, planet.atmosphereColor]
  );

  const celestialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorBase: { value: new THREE.Color(planet.baseColor) },
      uColorGlow: { value: new THREE.Color(planet.glowColor) },
      uColorAtmosphere: { value: new THREE.Color(planet.atmosphereColor) },
      uHovered: { value: 0 },
      uPlanetType: { value: typeIndex },
    }),
    [planet.baseColor, planet.glowColor, planet.atmosphereColor, typeIndex]
  );

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    // Orbital revolution (pauses smoothly when inspected)
    if (isOrbitingEnabled && !isSelected) {
      currentAngleRef.current += delta * (planet.orbitalSpeed * 0.08);
    }

    const [x, y, z] = calculateOrbitalPosition(
      planet.orbitalRadius,
      currentAngleRef.current,
      planet.orbitalInclination
    );

    if (groupRef.current) {
      groupRef.current.position.set(x, y, z);
    }

    // Update Shader Uniforms through meshRef
    hoveredLerp.current = lerp(
      hoveredLerp.current,
      isHovered || isSelected ? 1.0 : 0.0,
      delta * 6.0
    );

    if (meshRef.current?.material) {
      const mat = meshRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uTime) {
        mat.uniforms.uTime.value = time;
      }
      if (mat.uniforms?.uHovered) {
        mat.uniforms.uHovered.value = hoveredLerp.current;
      }
    }

    // Gentle axial rotation
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15;
    }
    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * 0.05;
    }
    if (ringGroupRef.current) {
      ringGroupRef.current.rotation.z += delta * 0.04;
    }
  });

  return (
    <group ref={groupRef} position={planet.position}>
      {/* Primary Planet Sphere with Custom Celestial Shader */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveWorld(isSelected ? null : planet.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredWorld(planet.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredWorld(null);
          document.body.style.cursor = 'auto';
        }}
        scale={isHovered || isSelected ? 1.08 : 1.0}
      >
        <sphereGeometry args={[planet.size, 64, 64]} />
        {isCode ? (
          <shaderMaterial
            vertexShader={CodePlanetShader.vertexShader}
            fragmentShader={CodePlanetShader.fragmentShader}
            uniforms={codeUniforms}
          />
        ) : (
          <shaderMaterial
            vertexShader={CelestialPlanetShader.vertexShader}
            fragmentShader={CelestialPlanetShader.fragmentShader}
            uniforms={celestialUniforms}
          />
        )}
      </mesh>

      {/* Atmospheric Scattering Shell */}
      <mesh ref={atmosphereRef} material={atmosphereMaterial} scale={1.24}>
        <sphereGeometry args={[planet.size, 48, 48]} />
      </mesh>

      {/* Planetary Rings */}
      {ringLineObject && (
        <group ref={ringGroupRef}>
          <primitive object={ringLineObject} />
        </group>
      )}
    </group>
  );
}
