/**
 * Procedural Web Audio API sound synthesizer for Luopan
 * Simulates antique wood/brass friction, needle balance clicks, and auspicious chimes.
 */

class LuopanAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private lastTickTime: number = 0;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Subtle mechanical / wooden tick when crossing degrees or mountains
   */
  public playTick(pitchMultiplier = 1.0) {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastTickTime < 35) return; // Prevent audio burst
    this.lastTickTime = now;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 * pitchMultiplier, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140 * pitchMultiplier, this.ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch {
      // Audio context may not be allowed before interaction
    }
  }

  /**
   * Resonant bronze singing bowl / temple bell chime when aligning with True North or Auspicious Pearl Line
   */
  public playAuspiciousBell() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const baseFreq = 528; // Solfeggio frequency / bronze bell
      const harmonics = [1, 2.02, 2.98, 4.05];
      const gains = [0.12, 0.05, 0.03, 0.015];

      harmonics.forEach((ratio, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(baseFreq * ratio, this.ctx.currentTime);

        const duration = 1.2;
        gain.gain.setValueAtTime(gains[idx], this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.00001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration + 0.05);
      });
    } catch {
      // Ignore
    }
  }

  /**
   * Tactile click when locking or unlocking the compass
   */
  public playLockSound(locking: boolean) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const startFreq = locking ? 300 : 600;
      const endFreq = locking ? 600 : 300;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Ignore
    }
  }
}

export const luopanAudio = new LuopanAudioService();
