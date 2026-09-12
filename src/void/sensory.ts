/**
 * STARK Void-Born — Sensory Integration Layer
 * Web Audio tone generation (binaural frequencies) and device haptic vibration pulses.
 */

export class SensoryIntegrationLayer {
  public static triggerHaptic(type: 'subtle_pulse' | 'warning_shock' | 'mastery_triple'): void {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        switch (type) {
          case 'subtle_pulse':
            navigator.vibrate(30);
            break;
          case 'warning_shock':
            navigator.vibrate([100, 50, 100]);
            break;
          case 'mastery_triple':
            navigator.vibrate([40, 40, 40, 40, 80]);
            break;
        }
      } catch (err) {
        console.warn('[Sensory Layer] Haptic skipped:', err);
      }
    }
  }

  public static playCognitiveChime(frequencyHz = 432, durationSec = 0.4): void {
    if (typeof window !== 'undefined' && (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + durationSec);
      } catch (e) {
        console.warn('[Sensory Layer] Audio context tone skipped:', e);
      }
    }
  }
}
