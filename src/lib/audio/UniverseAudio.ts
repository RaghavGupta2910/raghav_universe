/**
 * Web Audio API Ambient Space Soundscape Generator
 * Produces a soothing, spacious, cinematic background pad with zero external audio assets
 */

class UniverseAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isPlaying = false;
  private oscillators: OscillatorNode[] = [];
  private filter: BiquadFilterNode | null = null;

  private init() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);

    // Warm Low-Pass Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, this.ctx.currentTime);
    this.filter.Q.setValueAtTime(1.8, this.ctx.currentTime);

    this.masterGain.connect(this.ctx.destination);
  }

  public play() {
    this.init();
    if (!this.ctx || !this.masterGain || !this.filter) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    // Harmonic space pad frequencies (D Minor / Cosmic 432Hz ambient chord: D2, A2, F3, A3, C4)
    const chord = [73.42, 110.0, 174.61, 220.0, 261.63];

    this.oscillators = chord.map((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const oscGain = this.ctx!.createGain();

      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx!.currentTime);

      // Subtle detune for lush spatial chorus
      osc.detune.setValueAtTime((idx - 2) * 4, this.ctx!.currentTime);

      oscGain.gain.setValueAtTime(0.04 / chord.length, this.ctx!.currentTime);

      osc.connect(oscGain);
      oscGain.connect(this.filter!);
      osc.start();
      return osc;
    });

    this.filter.connect(this.masterGain);

    // Smooth fade in over 2.5 seconds
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, this.ctx.currentTime + 2.5);
  }

  public pause() {
    if (!this.ctx || !this.masterGain || !this.isPlaying) return;

    // Smooth fade out over 1.2 seconds
    this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), this.ctx.currentTime);
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

    setTimeout(() => {
      this.oscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {
          // ignore already stopped
        }
      });
      this.oscillators = [];
      this.isPlaying = false;
    }, 1250);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const universeAudio = typeof window !== 'undefined' ? new UniverseAudioEngine() : null;
