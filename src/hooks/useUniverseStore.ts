import { create } from 'zustand';
import { WorldId, ViewMode, EntryPhase, WorldTransitionStage } from '@/types/universe';

interface UniverseState {
  entryPhase: EntryPhase;
  isEntryComplete: boolean;
  entryProgress: number;

  activeWorld: WorldId | null;
  hoveredWorld: WorldId | null;
  viewMode: ViewMode;
  worldTransitionStage: WorldTransitionStage;
  isOrbitingEnabled: boolean;
  isAudioPlaying: boolean;
  activeTab: string;

  setEntryPhase: (phase: EntryPhase) => void;
  setEntryProgress: (progress: number) => void;
  skipEntry: () => void;
  setActiveWorld: (world: WorldId | null) => void;
  setWorldTransitionStage: (stage: WorldTransitionStage) => void;
  setHoveredWorld: (world: WorldId | null) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleOrbiting: () => void;
  toggleAudio: () => void;
  setActiveTab: (tab: string) => void;
  navigateNext: () => void;
  navigatePrev: () => void;
  resetToUniverse: () => void;
}

const WORLD_ORDER: (WorldId | null)[] = [
  null,
  'central',
  'code',
  'build',
  'music',
  'create',
  'mindset',
];

export const useUniverseStore = create<UniverseState>((set, get) => ({
  entryPhase: 'void',
  isEntryComplete: false,
  entryProgress: 0,

  activeWorld: null,
  hoveredWorld: null,
  viewMode: 'explore',
  worldTransitionStage: 'idle',
  isOrbitingEnabled: true,
  isAudioPlaying: false,
  activeTab: 'overview',

  setEntryPhase: (phase) => {
    set({
      entryPhase: phase,
      isEntryComplete: phase === 'ready',
    });
  },

  setEntryProgress: (progress) => set({ entryProgress: progress }),

  skipEntry: () => {
    set({
      entryPhase: 'ready',
      isEntryComplete: true,
      entryProgress: 1.0,
      worldTransitionStage: 'idle',
    });
  },

  setActiveWorld: (world) => {
    set({
      activeWorld: world,
      viewMode: world ? 'inspect' : 'explore',
      worldTransitionStage: world ? 'navigating' : 'idle',
      activeTab: 'overview',
    });
  },

  setWorldTransitionStage: (stage) => set({ worldTransitionStage: stage }),

  setHoveredWorld: (world) => set({ hoveredWorld: world }),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleOrbiting: () => set((state) => ({ isOrbitingEnabled: !state.isOrbitingEnabled })),

  toggleAudio: () => set((state) => ({ isAudioPlaying: !state.isAudioPlaying })),

  setActiveTab: (tab) => set({ activeTab: tab }),

  navigateNext: () => {
    const current = get().activeWorld;
    const currentIndex = WORLD_ORDER.indexOf(current);
    const nextIndex = (currentIndex + 1) % WORLD_ORDER.length;
    const nextWorld = WORLD_ORDER[nextIndex];
    get().setActiveWorld(nextWorld);
  },

  navigatePrev: () => {
    const current = get().activeWorld;
    const currentIndex = WORLD_ORDER.indexOf(current);
    const prevIndex = (currentIndex - 1 + WORLD_ORDER.length) % WORLD_ORDER.length;
    const prevWorld = WORLD_ORDER[prevIndex];
    get().setActiveWorld(prevWorld);
  },

  resetToUniverse: () => {
    set({
      activeWorld: null,
      viewMode: 'explore',
      worldTransitionStage: 'idle',
      activeTab: 'overview',
    });
  },
}));
