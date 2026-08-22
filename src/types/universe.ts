export type WorldId = 'central' | 'code' | 'build' | 'music' | 'create' | 'mindset';

export type ViewMode = 'explore' | 'inspect' | 'orbit';

export type EntryPhase = 'void' | 'multiverse' | 'approaching' | 'arrival' | 'ready';

export type WorldTransitionStage = 'idle' | 'navigating' | 'arrived';

export interface CelestialCoordinates {
  x: number;
  y: number;
  z: number;
}

export interface CameraCompositionContract {
  cameraPositionOffset: [number, number, number];
  lookAtOffset: [number, number, number];
  fov: number;
  contentAnchor: 'right' | 'left' | 'center';
  safeUiWidthPercent: number;
  planetScreenPosition: 'left-center' | 'right-center' | 'center';
}

export interface CelestialBody {
  id: WorldId;
  name: string;
  subtitle: string;
  tagline: string;
  orbitalRadius: number;
  orbitalSpeed: number;
  orbitalInclination: number;
  size: number;
  baseColor: string;
  glowColor: string;
  atmosphereColor: string;
  initialAngle: number;
  position: [number, number, number];
  composition: CameraCompositionContract;
  wireframe?: boolean;
}

export interface CameraState {
  currentPosition: [number, number, number];
  targetPosition: [number, number, number];
  currentLookAt: [number, number, number];
  targetLookAt: [number, number, number];
  isTransitioning: boolean;
  fov: number;
}
