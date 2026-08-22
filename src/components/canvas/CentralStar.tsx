'use client';

import { useEffect, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { createAtmosphereMaterial } from './AtmosphereShader';
import { generateOrbitalRingPoints } from '@/lib/math';
import { registerCelestialObject, unregisterCelestialObject } from '@/lib/spatial/celestialRegistry';

const SolarCoreShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vUv = uv;
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform float uHovered;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }

    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(-vPosition);

      vec2 uv1 = vUv * 8.0 + vec2(uTime * 0.08, uTime * 0.04);
      vec2 uv2 = vUv * 16.0 - vec2(uTime * 0.05, uTime * 0.09);
      float n = noise(uv1) * 0.6 + noise(uv2) * 0.4;

      vec3 coreWhite = vec3(1.0, 0.98, 0.92);
      vec3 solarGold = vec3(0.98, 0.75, 0.2);
      vec3 flareAmber = vec3(0.92, 0.45, 0.05);

      vec3 baseColor = mix(solarGold, coreWhite, pow(n, 1.8));
      baseColor = mix(baseColor, flareAmber, (1.0 - n) * 0.4);

      float rim = 1.0 - max(dot(normal, viewDir), 0.0);
      vec3 rimColor = flareAmber * pow(rim, 2.0) * 1.5;

      vec3 finalColor = baseColor * (1.8 + uHovered * 0.6) + rimColor;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
};

export function CentralStar() {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const ringRef1 = useRef<THREE.Group>(null);
  const ringRef2 = useRef<THREE.Group>(null);

  const isSelected = useUniverseStore((s) => s.activeWorld === 'central');
  const isHovered = useUniverseStore((s) => s.hoveredWorld === 'central');
  const setActiveWorld = useUniverseStore((s) => s.setActiveWorld);
  const setHoveredWorld = useUniverseStore((s) => s.setHoveredWorld);

  useEffect(() => {
    if (groupRef.current) {
      registerCelestialObject('central', groupRef.current);
    }
    return () => {
      unregisterCelestialObject('central');
    };
  }, []);

  const atmosphereMaterial = useMemo(
    () => createAtmosphereMaterial('#fef08a', 0.9, 1.8, 0.85),
    []
  );

  const ringLine1 = useMemo(() => {
    const pts = generateOrbitalRingPoints(3.4, 0.3, 80);
    const geom = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#fef08a',
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geom, mat);
  }, []);

  const ringLine2 = useMemo(() => {
    const pts = generateOrbitalRingPoints(4.2, -0.4, 80);
    const geom = new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(pts, 3));
    const mat = new THREE.LineBasicMaterial({
      color: '#ca8a04',
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending,
    });
    return new THREE.Line(geom, mat);
  }, []);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    if (coreRef.current?.material) {
      const mat = coreRef.current.material as THREE.ShaderMaterial;
      if (mat.uniforms?.uTime) {
        mat.uniforms.uTime.value = time;
      }
      if (mat.uniforms?.uHovered) {
        mat.uniforms.uHovered.value = isHovered || isSelected ? 1.0 : 0.0;
      }
    }

    if (coreRef.current) {
      coreRef.current.rotation.y += delta * 0.08;
    }
    if (coronaRef.current) {
      coronaRef.current.rotation.y -= delta * 0.04;
      const scale = 1 + Math.sin(time * 1.2) * 0.025;
      coronaRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef1.current) {
      ringRef1.current.rotation.z += delta * 0.03;
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z -= delta * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh
        ref={coreRef}
        onClick={(e) => {
          e.stopPropagation();
          setActiveWorld(isSelected ? null : 'central');
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredWorld('central');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHoveredWorld(null);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[2.2, 64, 64]} />
        <shaderMaterial
          vertexShader={SolarCoreShader.vertexShader}
          fragmentShader={SolarCoreShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uHovered: { value: 0 },
          }}
        />
      </mesh>

      <mesh ref={coronaRef} material={atmosphereMaterial}>
        <sphereGeometry args={[2.85, 48, 48]} />
      </mesh>

      <pointLight color="#fef08a" intensity={3.5} distance={80} decay={1.2} />

      <group ref={ringRef1}>
        <primitive object={ringLine1} />
      </group>

      <group ref={ringRef2}>
        <primitive object={ringLine2} />
      </group>
    </group>
  );
}
