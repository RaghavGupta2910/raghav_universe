'use client';

import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export function MultiverseIntro() {
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);
  const entryPhase = useUniverseStore((s) => s.entryPhase);
  const entryProgress = useUniverseStore((s) => s.entryProgress);
  const setEntryProgress = useUniverseStore((s) => s.setEntryProgress);
  const setEntryPhase = useUniverseStore((s) => s.setEntryPhase);
  const skipEntry = useUniverseStore((s) => s.skipEntry);

  const prefersReducedMotion = usePrefersReducedMotion();
  const lastLoggedStep = useRef<number>(-1);

  useEffect(() => {
    if (isEntryComplete) return;

    let startTime: number | null = null;
    let animFrameId: number;
    const duration = prefersReducedMotion ? 1200 : 5400;

    const tick = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1.0, elapsed / duration);

      const currentStep = Math.floor(rawProgress * 10) / 10;
      if (currentStep > lastLoggedStep.current) {
        lastLoggedStep.current = currentStep;
      }

      setEntryProgress(rawProgress);

      if (rawProgress < 0.25) {
        setEntryPhase('multiverse');
      } else if (rawProgress < 0.7) {
        setEntryPhase('approaching');
      } else if (rawProgress < 0.98) {
        setEntryPhase('arrival');
      } else {
        setEntryPhase('ready');
      }

      if (rawProgress < 1.0) {
        animFrameId = requestAnimationFrame(tick);
      }
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      if (animFrameId) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, [isEntryComplete, prefersReducedMotion, setEntryProgress, setEntryPhase]);

  if (isEntryComplete) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-8 sm:p-14 bg-gradient-to-b from-[#080B12]/80 via-transparent to-[#080B12]/90">
      <div className="flex items-center justify-between font-mono text-[11px] text-[#8F98A8]">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-[#B79A5B] animate-pulse" />
          <span>
            {entryPhase === 'void' && 'ASTRONOMICAL OBSERVATORY'}
            {entryPhase === 'multiverse' && 'SURVEYING CELESTIAL COORDINATES'}
            {entryPhase === 'approaching' && 'APPROACHING RAGHAV UNIVERSE'}
            {entryPhase === 'arrival' && 'ENTERING CELESTIAL SPHERE'}
          </span>
        </div>

        <span className="hidden sm:inline text-[10px] text-[#8F98A8]/60">
          28.61° N, 77.20° E
        </span>
      </div>

      <div className="flex flex-col items-center justify-center text-center space-y-2">
        {entryPhase === 'approaching' && (
          <div className="space-y-1 animate-in fade-in duration-700">
            <h2 className="font-display text-3xl sm:text-4xl font-normal tracking-wide text-[#E8E1D5]">
              Raghav Gupta
            </h2>
            <p className="font-body text-xs text-[#B79A5B] tracking-wider">
              Mathematics & Computing
            </p>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between font-body text-xs">
        <div className="space-y-2 w-36 sm:w-52">
          <div className="flex justify-between font-mono text-[10px] text-[#8F98A8]">
            <span>APPROACH</span>
            <span>{Math.round(entryProgress * 100)}%</span>
          </div>
          <div className="h-[1px] w-full bg-[#8F98A8]/20 overflow-hidden">
            <div
              style={{ width: `${entryProgress * 100}%` }}
              className="h-full bg-[#B79A5B] transition-all duration-100"
            />
          </div>
        </div>

        <button
          onClick={skipEntry}
          className="pointer-events-auto px-4 py-1.5 rounded-full border border-[#8F98A8]/20 bg-[#10151D]/80 font-mono text-[11px] text-[#8F98A8] hover:text-[#E8E1D5] hover:border-[#B79A5B]/40 transition-colors"
        >
          Skip
        </button>
      </div>
    </div>
  );
}
