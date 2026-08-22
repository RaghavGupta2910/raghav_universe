'use client';

import { useEffect, useRef } from 'react';
import { useUniverseStore } from '@/hooks/useUniverseStore';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { FastForward } from 'lucide-react';

export function MultiverseIntro() {
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);
  const entryPhase = useUniverseStore((s) => s.entryPhase);
  const entryProgress = useUniverseStore((s) => s.entryProgress);
  const setEntryProgress = useUniverseStore((s) => s.setEntryProgress);
  const setEntryPhase = useUniverseStore((s) => s.setEntryPhase);
  const skipEntry = useUniverseStore((s) => s.skipEntry);

  const prefersReducedMotion = usePrefersReducedMotion();
  const lastLoggedStep = useRef<number>(-1);

  // Independent DOM-Layer Entrance Animation Driver
  useEffect(() => {
    if (isEntryComplete) return;

    let startTime: number | null = null;
    let animFrameId: number;
    const duration = prefersReducedMotion ? 1200 : 5400; // ms

    const tick = (currentTime: number) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const rawProgress = Math.min(1.0, elapsed / duration);

      // Log progress at 10% steps
      const currentStep = Math.floor(rawProgress * 10) / 10;
      if (currentStep > lastLoggedStep.current) {
        lastLoggedStep.current = currentStep;
        console.log(`[ENTRY] progress=${currentStep}`);
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
      } else {
        console.log('[ENTRY] progress=1.0 (COMPLETE)');
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
    <div className="fixed inset-0 z-40 pointer-events-none flex flex-col justify-between p-8 sm:p-12">
      {/* Top Telemetry */}
      <div className="flex items-center justify-between font-mono text-[11px] text-slate-500 tracking-widest uppercase">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>
            {entryPhase === 'void' && 'DEEP VOID // MULTIVERSE CLUSTERS'}
            {entryPhase === 'multiverse' && 'SCANNING EXTENDED MULTIVERSE'}
            {entryPhase === 'approaching' && 'SINGULARITY: RAGHAV // ACCELERATING'}
            {entryPhase === 'arrival' && 'ENTERING RAGHAV\'S UNIVERSE'}
          </span>
        </div>

        <span className="hidden sm:inline text-[10px] text-slate-600">
          COORDINATES: 28.61N, 77.20E
        </span>
      </div>

      {/* Center Atmospheric Prompt (Sparse, Non-intrusive) */}
      <div className="flex flex-col items-center justify-center text-center space-y-3 transition-opacity duration-700">
        {entryPhase === 'approaching' && (
          <div className="space-y-1 animate-in fade-in zoom-in-95 duration-500">
            <h2 className="font-mono text-xl sm:text-2xl font-light tracking-[0.3em] text-slate-200 uppercase">
              RAGHAV GUPTA
            </h2>
            <p className="font-mono text-[11px] tracking-widest text-cyan-400 uppercase">
              Mathematics & Computing
            </p>
          </div>
        )}
      </div>

      {/* Bottom Progress & Skip Control */}
      <div className="flex items-end justify-between font-mono text-xs">
        {/* Subtle Progress Track */}
        <div className="space-y-1.5 w-32 sm:w-48">
          <div className="flex justify-between text-[10px] text-slate-600 uppercase tracking-wider">
            <span>APPROACH</span>
            <span>{Math.round(entryProgress * 100)}%</span>
          </div>
          <div className="h-0.5 w-full bg-slate-900 overflow-hidden">
            <div
              style={{ width: `${entryProgress * 100}%` }}
              className="h-full bg-cyan-400 transition-all duration-100"
            />
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={skipEntry}
          className="pointer-events-auto group flex items-center gap-1.5 rounded-full border border-slate-800/80 bg-slate-950/70 px-4 py-1.5 font-mono text-[11px] text-slate-400 backdrop-blur-md hover:border-slate-700 hover:text-slate-100 transition-all focus:outline-none"
        >
          <span>SKIP SEQUENCE</span>
          <FastForward className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  );
}
