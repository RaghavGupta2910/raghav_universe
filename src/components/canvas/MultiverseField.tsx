'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createPRNG } from '@/lib/math';
import { useUniverseStore } from '@/hooks/useUniverseStore';

// Distant Galaxy Vortex Point Shader
const GalaxyClusterShader = {
  vertexShader: `
    attribute float aSize;
    attribute vec3 aColor;
    attribute float aAlpha;

    uniform float uTime;
    uniform float uGlobalFade;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;
      vAlpha = aAlpha * uGlobalFade;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (400.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 2.0, 60.0);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;

      float glow = smoothstep(0.5, 0.0, dist) * pow(1.0 - dist * 2.0, 2.0);
      gl_FragColor = vec4(vColor, glow * vAlpha);
    }
  `,
};

export function MultiverseField() {
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);
  const groupRef = useRef<THREE.Group>(null);
  const shaderMatRef = useRef<THREE.ShaderMaterial>(null);

  // Generate 20 distant multiverse galaxy vortexes
  const [positions, colors, sizes, alphas] = useMemo(() => {
    const prng = createPRNG(77712);
    const totalGalaxies = 18;
    const pointsPerGalaxy = 120;
    const totalPoints = totalGalaxies * pointsPerGalaxy;

    const pos = new Float32Array(totalPoints * 3);
    const cols = new Float32Array(totalPoints * 3);
    const szs = new Float32Array(totalPoints);
    const als = new Float32Array(totalPoints);

    const galaxyPalettes = [
      [new THREE.Color('#38bdf8'), new THREE.Color('#818cf8')], // Cyan-Blue
      [new THREE.Color('#c084fc'), new THREE.Color('#e879f9')], // Violet-Magenta
      [new THREE.Color('#34d399'), new THREE.Color('#6ee7b7')], // Emerald
      [new THREE.Color('#fbbf24'), new THREE.Color('#f97316')], // Amber-Gold
      [new THREE.Color('#f43f5e'), new THREE.Color('#fb7185')], // Crimson-Rose
    ];

    let pIdx = 0;

    for (let g = 0; g < totalGalaxies; g++) {
      // Distribute galaxy centers on deep spherical perimeter
      const radius = 280 + prng() * 320;
      const theta = 2 * Math.PI * prng();
      const phi = Math.acos(2 * prng() - 1);

      const cx = radius * Math.sin(phi) * Math.cos(theta);
      const cy = radius * Math.sin(phi) * Math.sin(theta);
      const cz = radius * Math.cos(phi);

      const palette = galaxyPalettes[g % galaxyPalettes.length];

      // Spiral arms for each miniature galaxy
      for (let i = 0; i < pointsPerGalaxy; i++) {
        const armAngle = (i / pointsPerGalaxy) * Math.PI * 4;
        const armRadius = Math.pow(prng(), 1.5) * 35.0;

        const x = cx + Math.cos(armAngle) * armRadius + (prng() - 0.5) * 8.0;
        const y = cy + (prng() - 0.5) * 6.0;
        const z = cz + Math.sin(armAngle) * armRadius + (prng() - 0.5) * 8.0;

        pos[pIdx * 3] = x;
        pos[pIdx * 3 + 1] = y;
        pos[pIdx * 3 + 2] = z;

        const color = prng() > 0.5 ? palette[0] : palette[1];
        cols[pIdx * 3] = color.r;
        cols[pIdx * 3 + 1] = color.g;
        cols[pIdx * 3 + 2] = color.b;

        szs[pIdx] = 8.0 + prng() * 14.0;
        als[pIdx] = 0.5 + prng() * 0.4;

        pIdx++;
      }
    }

    return [pos, cols, szs, als];
  }, []);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.005;
    }

    if (shaderMatRef.current?.uniforms?.uTime) {
      shaderMatRef.current.uniforms.uTime.value = time;
      const entryProgress = useUniverseStore.getState().entryProgress;
      const fade = isEntryComplete ? 0.25 : Math.max(0.2, 1.0 - entryProgress * 0.7);
      if (shaderMatRef.current.uniforms.uGlobalFade) {
        shaderMatRef.current.uniforms.uGlobalFade.value = fade;
      }
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[sizes, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[alphas, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderMatRef}
          vertexShader={GalaxyClusterShader.vertexShader}
          fragmentShader={GalaxyClusterShader.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uGlobalFade: { value: 1.0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
