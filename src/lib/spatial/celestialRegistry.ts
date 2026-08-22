import * as THREE from 'three';
import { WorldId } from '@/types/universe';

/**
 * Authoritative Spatial Registry for Live 3D Celestial Body Transforms
 * Provides real-time world-space tracking of orbiting planets and central star
 */

const celestialObjects = new Map<WorldId, THREE.Object3D>();

export function registerCelestialObject(id: WorldId, object: THREE.Object3D): void {
  celestialObjects.set(id, object);
}

export function unregisterCelestialObject(id: WorldId): void {
  celestialObjects.delete(id);
}

export function getCelestialWorldPosition(id: WorldId, outVector: THREE.Vector3): boolean {
  const obj = celestialObjects.get(id);
  if (obj) {
    obj.getWorldPosition(outVector);
    return true;
  }
  return false;
}

export function getCelestialObject(id: WorldId): THREE.Object3D | undefined {
  return celestialObjects.get(id);
}
