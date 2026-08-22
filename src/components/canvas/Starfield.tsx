'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { useDeviceCapability } from '@/hooks/useDeviceCapability';
import { createPRNG, lerp } from '@/lib/math';

// Custom Star Shader with circular soft alpha falloff and twinkling
const StarShaderMaterial = {
  vertexShader: `
    attribute float aSize;
    attribute float aBrightness;
    attribute float aTwinkleSpeed;
    attribute float aTwinklePhase;
    attribute vec3 aColor;

    uniform float uTime;
    uniform float uFocusDim;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;
      float twinkle = sin(uTime * aTwinkleSpeed + aTwinklePhase) * 0.35 + 0.65;
      vAlpha = aBrightness * twinkle * uFocusDim;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (300.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 1.0, 24.0);
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

      float core = smoothstep(0.5, 0.05, dist);
      float glow = pow(1.0 - dist * 2.0, 2.0) * 0.4;
      float intensity = core + glow;

      gl_FragColor = vec4(vColor, intensity * vAlpha);
    }
  `,
};

// Soft Cosmic Nebular Dust Shader with wide Gaussian falloff
const NebulaShaderMaterial = {
  vertexShader: `
    attribute float aSize;
    attribute vec3 aColor;
    attribute float aAlpha;

    uniform float uTime;
    uniform float uFocusDim;

    varying vec3 vColor;
    varying float vAlpha;

    void main() {
      vColor = aColor;
      vAlpha = aAlpha * uFocusDim;

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = aSize * (200.0 / -mvPosition.z);
      gl_PointSize = clamp(gl_PointSize, 10.0, 180.0);
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

      float haze = smoothstep(0.5, 0.0, dist) * (1.0 - dist * 2.0);
      gl_FragColor = vec4(vColor, haze * vAlpha);
    }
  `,
};

export function Starfield() {
  const { starCount } = useDeviceCapability();
  const isFocused = useUniverseStore((s) => Boolean(s.activeWorld));

  const starsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const foregroundRef = useRef<THREE.Points>(null);

  const starMatRef = useRef<THREE.ShaderMaterial>(null);
  const fgStarMatRef = useRef<THREE.ShaderMaterial>(null);
  const dustMatRef = useRef<THREE.ShaderMaterial>(null);

  // Background & Midground Stars
  const [starPositions, starColors, starSizes, starBrightness, twinkleSpeed, twinklePhase] =
    useMemo(() => {
      const prng = createPRNG(421337);
      const count = starCount;

      const positions = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const sizes = new Float32Array(count);
      const brightness = new Float32Array(count);
      const tSpeed = new Float32Array(count);
      const tPhase = new Float32Array(count);

      const starPalette = [
        new THREE.Color('#93c5fd'),
        new THREE.Color('#e0f2fe'),
        new THREE.Color('#ffffff'),
        new THREE.Color('#fef08a'),
        new THREE.Color('#fed7aa'),
        new THREE.Color('#fca5a5'),
      ];

      for (let i = 0; i < count; i++) {
        const radius = 80 + prng() * 260;
        const theta = 2 * Math.PI * prng();
        const phi = Math.acos(2 * prng() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        const col = starPalette[Math.floor(prng() * starPalette.length)];
        colors[i * 3] = col.r;
        colors[i * 3 + 1] = col.g;
        colors[i * 3 + 2] = col.b;

        const sizeRoll = prng();
        if (sizeRoll > 0.96) {
          sizes[i] = 2.8 + prng() * 1.5;
          brightness[i] = 0.95;
        } else if (sizeRoll > 0.8) {
          sizes[i] = 1.6 + prng() * 0.8;
          brightness[i] = 0.75;
        } else {
          sizes[i] = 0.7 + prng() * 0.6;
          brightness[i] = 0.35 + prng() * 0.3;
        }

        tSpeed[i] = 0.5 + prng() * 2.5;
        tPhase[i] = prng() * Math.PI * 2;
      }

      return [positions, colors, sizes, brightness, tSpeed, tPhase];
    }, [starCount]);

  // Foreground Sparse Parallax Stars
  const [fgPositions, fgColors, fgSizes, fgBrightness, fgSpeed, fgPhase] = useMemo(() => {
    const prng = createPRNG(88123);
    const count = Math.floor(starCount * 0.05);

    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const brightness = new Float32Array(count);
    const tSpeed = new Float32Array(count);
    const tPhase = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const radius = 25 + prng() * 50;
      const theta = 2 * Math.PI * prng();
      const y = (prng() - 0.5) * 40;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      colors[i * 3] = 0.95;
      colors[i * 3 + 1] = 0.97;
      colors[i * 3 + 2] = 1.0;

      sizes[i] = 1.8 + prng() * 1.4;
      brightness[i] = 0.85;
      tSpeed[i] = 1.2 + prng() * 2.0;
      tPhase[i] = prng() * Math.PI * 2;
    }

    return [positions, colors, sizes, brightness, tSpeed, tPhase];
  }, [starCount]);

  // Soft Cosmic Nebular Dust Haze
  const [dustPositions, dustColors, dustSizes, dustAlphas] = useMemo(() => {
    const prng = createPRNG(55577);
    const dustCount = Math.floor(starCount * 0.08);

    const positions = new Float32Array(dustCount * 3);
    const colors = new Float32Array(dustCount * 3);
    const sizes = new Float32Array(dustCount);
    const alphas = new Float32Array(dustCount);

    const nebulaColors = [
      new THREE.Color('#0369a1'),
      new THREE.Color('#4338ca'),
      new THREE.Color('#581c87'),
      new THREE.Color('#047857'),
    ];

    for (let i = 0; i < dustCount; i++) {
      const radius = 20 + prng() * 80;
      const theta = 2 * Math.PI * prng();
      const y = (prng() - 0.5) * 35;

      positions[i * 3] = radius * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = radius * Math.sin(theta);

      const col = nebulaColors[Math.floor(prng() * nebulaColors.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;

      sizes[i] = 60.0 + prng() * 90.0;
      alphas[i] = 0.04 + prng() * 0.06;
    }

    return [positions, colors, sizes, alphas];
  }, [starCount]);

  const targetDim = isFocused ? 0.38 : 1.0;
  const currentDim = useRef(1.0);

  useFrame(({ clock }, delta) => {
    const time = clock.getElapsedTime();

    currentDim.current = lerp(currentDim.current, targetDim, delta * 3.5);

    if (starMatRef.current?.uniforms?.uTime) {
      starMatRef.current.uniforms.uTime.value = time;
      starMatRef.current.uniforms.uFocusDim.value = currentDim.current;
    }

    if (fgStarMatRef.current?.uniforms?.uTime) {
      fgStarMatRef.current.uniforms.uTime.value = time;
      fgStarMatRef.current.uniforms.uFocusDim.value = currentDim.current;
    }

    if (dustMatRef.current?.uniforms?.uTime) {
      dustMatRef.current.uniforms.uTime.value = time;
      dustMatRef.current.uniforms.uFocusDim.value = currentDim.current;
    }

    if (starsRef.current) {
      starsRef.current.rotation.y += delta * 0.0012;
    }
    if (foregroundRef.current) {
      foregroundRef.current.rotation.y += delta * 0.0035;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y -= delta * 0.002;
    }
  });

  return (
    <group>
      {/* Background Starfield */}
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[starPositions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[starColors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[starSizes, 1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[starBrightness, 1]} />
          <bufferAttribute attach="attributes-aTwinkleSpeed" args={[twinkleSpeed, 1]} />
          <bufferAttribute attach="attributes-aTwinklePhase" args={[twinklePhase, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={starMatRef}
          vertexShader={StarShaderMaterial.vertexShader}
          fragmentShader={StarShaderMaterial.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uFocusDim: { value: 1.0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Foreground Sparse Parallax Stars */}
      <points ref={foregroundRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fgPositions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[fgColors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[fgSizes, 1]} />
          <bufferAttribute attach="attributes-aBrightness" args={[fgBrightness, 1]} />
          <bufferAttribute attach="attributes-aTwinkleSpeed" args={[fgSpeed, 1]} />
          <bufferAttribute attach="attributes-aTwinklePhase" args={[fgPhase, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={fgStarMatRef}
          vertexShader={StarShaderMaterial.vertexShader}
          fragmentShader={StarShaderMaterial.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uFocusDim: { value: 1.0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Ambient Cosmic Haze */}
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dustPositions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[dustColors, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[dustSizes, 1]} />
          <bufferAttribute attach="attributes-aAlpha" args={[dustAlphas, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={dustMatRef}
          vertexShader={NebulaShaderMaterial.vertexShader}
          fragmentShader={NebulaShaderMaterial.fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uFocusDim: { value: 1.0 },
          }}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
