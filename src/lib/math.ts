/**
 * Deterministic pseudo-random number generator (Mulberry32)
 * Ensures purity across renders and deterministic distribution
 */
export function createPRNG(seed: number = 42) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Calculate orbital position based on Keplerian circular/elliptical orbital mechanics
 */
export function calculateOrbitalPosition(
  radius: number,
  angle: number,
  inclination: number = 0
): [number, number, number] {
  if (radius === 0) return [0, 0, 0];

  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  // Apply inclination rotation around X-axis
  const y = Math.sin(angle) * radius * Math.sin(inclination);

  return [x, y, z];
}

/**
 * Linear interpolation helper
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Clamp a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Generate 3D points for an orbital ring line
 */
export function generateOrbitalRingPoints(
  radius: number,
  inclination: number = 0,
  segments: number = 128
): Float32Array {
  const points = new Float32Array((segments + 1) * 3);

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    const x = Math.cos(theta) * radius;
    const z = Math.sin(theta) * radius;
    const y = Math.sin(theta) * radius * Math.sin(inclination);

    points[i * 3] = x;
    points[i * 3 + 1] = y;
    points[i * 3 + 2] = z;
  }

  return points;
}
