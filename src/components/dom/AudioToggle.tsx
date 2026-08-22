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
    <div className="pointer-events-auto fixed bottom-8 right-8 z-30 font-body">
      <button
        onClick={handleToggle}
        className={`group flex items-center gap-2.5 rounded-full border px-3.5 py-1.5 backdrop-blur-sm transition-colors focus:outline-none ${
          isAudioPlaying
            ? 'border-[#B79A5B]/40 bg-[#10151D]/90 text-[#E8E1D5]'
            : 'border-[#8F98A8]/20 bg-[#080B12]/70 text-[#8F98A8] hover:text-[#E8E1D5] hover:border-[#B79A5B]/30'
        }`}
        title="Ambient Observatory Soundscape"
      >
        <span className="font-mono text-[11px] tracking-wider">SOUND</span>
        <span
          className={`h-1.5 w-1.5 rounded-full transition-colors ${
            isAudioPlaying ? 'bg-[#B79A5B]' : 'bg-[#8F98A8]/40'
          }`}
        />
      </button>
    </div>
  );
}
