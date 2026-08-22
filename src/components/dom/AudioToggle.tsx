'use client';

import { useUniverseStore } from '@/hooks/useUniverseStore';
import { universeAudio } from '@/lib/audio/UniverseAudio';

export function AudioToggle() {
  const isAudioPlaying = useUniverseStore((s) => s.isAudioPlaying);
  const toggleAudio = useUniverseStore((s) => s.toggleAudio);
  const isEntryComplete = useUniverseStore((s) => s.isEntryComplete);

  if (!isEntryComplete) return null;

  const handleToggle = () => {
    if (universeAudio) {
      universeAudio.toggle();
    }
    toggleAudio();
  };

  return (
    <div className="pointer-events-auto fixed bottom-8 right-8 z-30">
      <button
        onClick={handleToggle}
        className={`group flex items-center gap-2.5 rounded-full border px-4 py-2 font-mono text-[11px] backdrop-blur-xl transition-all duration-500 focus:outline-none ${
          isAudioPlaying
            ? 'border-cyan-800/80 bg-slate-950/80 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
            : 'border-slate-800/80 bg-slate-950/60 text-slate-500 hover:text-slate-300 hover:border-slate-700'
        }`}
        title="Ambient Universe Soundtrack"
      >
        <span className="tracking-widest uppercase text-[10px]">AMBIENT</span>

        {/* Understated animated waveform / cosmic pulse */}
        <div className="flex items-center gap-0.5 h-3">
          {isAudioPlaying ? (
            <>
              <span className="h-2 w-0.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="h-3 w-0.5 rounded-full bg-cyan-300 animate-bounce" style={{ animationDuration: '0.8s' }} />
              <span className="h-1.5 w-0.5 rounded-full bg-cyan-400 animate-pulse" />
            </>
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors" />
          )}
        </div>
      </button>
    </div>
  );
}
