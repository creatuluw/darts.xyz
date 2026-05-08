/**
 * Audio Effects Chain for Dramatic Darts Caller Voice
 *
 * Creates that deep, resonant, arena-like announcer sound using Web Audio API.
 *
 * Effects Chain:
 * [Audio Source] → [EQ] → [Compressor] → [Reverb] → [Master Gain] → [Destination]
 */

export interface AudioEffectsOptions {
  /** Enable the full effects chain (default: true) */
  enabled?: boolean;
  /** Deep voice boost - boost low frequencies (default: 6) */
  lowBoostDb?: number;
  /** Presence boost - boost high-mids for clarity (default: -2) */
  presenceDb?: number;
  /** Compressor threshold in dB (default: -24) */
  compressorThreshold?: number;
  /** Compressor ratio (default: 8) */
  compressorRatio?: number;
  /** Reverb wet/dry mix 0-1 (default: 0.3) */
  reverbMix?: number;
  /** Master output volume 0-1 (default: 0.9) */
  outputVolume?: number;
}

const DEFAULT_OPTIONS: Required<AudioEffectsOptions> = {
  enabled: true,
  lowBoostDb: 6, // Deep voice
  presenceDb: -2, // Slight cut to avoid harshness
  compressorThreshold: -24,
  compressorRatio: 8,
  reverbMix: 0.3, // Arena echo
  outputVolume: 0.9,
};

/**
 * Check if Web Audio API is available
 */
export function isAudioContextAvailable(): boolean {
  return typeof window !== "undefined" && "AudioContext" in window;
}

/**
 * Create an impulse response for algorithmic reverb
 */
function createReverbImpulse(
  audioContext: BaseAudioContext,
  duration: number = 2,
  decay: number = 2,
): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const length = sampleRate * duration;
  const impulse = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // Exponential decay with random noise
      channelData[i] =
        (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }

  return impulse;
}

/**
 * Create a longer impulse for arena echo effect
 */
function createArenaReverbImpulse(audioContext: BaseAudioContext): AudioBuffer {
  const sampleRate = audioContext.sampleRate;
  const duration = 3.5; // Longer reverb for arena
  const length = sampleRate * duration;
  const impulse = audioContext.createBuffer(2, length, sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      // Multiple echoes with decay
      const t = i / sampleRate;
      let sample = 0;

      // Primary reflections
      sample += (Math.random() * 2 - 1) * Math.pow(1 - i / length, 1.5) * 0.5;

      // Early reflections at ~50ms, 100ms, 180ms
      const earlyReflections = [0.05, 0.1, 0.18];
      for (const delay of earlyReflections) {
        const idx = Math.floor(delay * sampleRate);
        if (i >= idx && i < idx + sampleRate * 0.1) {
          sample +=
            (Math.random() * 2 - 1) *
            0.3 *
            Math.pow(1 - (i - idx) / (sampleRate * 0.1), 2);
        }
      }

      // Late reverb tail
      sample += (Math.random() * 2 - 1) * Math.pow(1 - i / length, 0.8) * 0.6;

      channelData[i] = sample;
    }
  }

  return impulse;
}

/**
 * DramaticVoiceEffects - Web Audio API effects chain for arena announcer sound
 */
export class DramaticVoiceEffects {
  private audioContext: AudioContext | null = null;
  private effectsChain: {
    inputGain: GainNode;
    eq: BiquadFilterNode;
    lowShelf: BiquadFilterNode;
    highShelf: BiquadFilterNode;
    compressor: DynamicsCompressorNode;
    convolver: ConvolverNode;
    reverbGain: GainNode;
    dryGain: GainNode;
    masterGain: GainNode;
  } | null = null;
  private options: Required<AudioEffectsOptions>;
  private isInitialized = false;

  constructor(options: AudioEffectsOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Initialize the audio context and effects chain
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (!isAudioContextAvailable()) {
      console.warn("Web Audio API not available");
      return;
    }

    try {
      // Create audio context - don't await resume here since it requires
      // a user gesture and will hang on page load; resume lazily before playback
      this.audioContext = new AudioContext();

      const ctx = this.audioContext;
      const opt = this.options;

      // Create nodes
      const inputGain = ctx.createGain();
      inputGain.gain.value = 1;

      // EQ - 3-band for voice shaping
      const lowShelf = ctx.createBiquadFilter();
      lowShelf.type = "lowshelf";
      lowShelf.frequency.value = 200; // Boost/cut below 200Hz
      lowShelf.gain.value = opt.lowBoostDb; // Deep voice boost

      const eq = ctx.createBiquadFilter();
      eq.type = "peaking";
      eq.frequency.value = 2500; // Presence frequency
      eq.Q.value = 1.5;
      eq.gain.value = opt.presenceDb; // Slight cut to avoid harshness

      const highShelf = ctx.createBiquadFilter();
      highShelf.type = "highshelf";
      highShelf.frequency.value = 6000;
      highShelf.gain.value = 2; // Add air/clarity

      // Compressor for consistent volume and presence
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = opt.compressorThreshold;
      compressor.knee.value = 8;
      compressor.ratio.value = opt.compressorRatio;
      compressor.attack.value = 0.003;
      compressor.release.value = 0.25;

      // Reverb (convolution-based)
      const convolver = ctx.createConvolver();
      convolver.buffer = createArenaReverbImpulse(ctx);

      // Reverb wet/dry mix
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = opt.reverbMix;

      const dryGain = ctx.createGain();
      dryGain.gain.value = 1 - opt.reverbMix;

      // Master gain
      const masterGain = ctx.createGain();
      masterGain.gain.value = opt.outputVolume;

      // Connect the chain
      // Input → EQ chain → Compressor → [Dry path] → Master → Output
      //                            └→ [Reverb path] → Reverb Gain ─┘

      inputGain.connect(lowShelf);
      lowShelf.connect(eq);
      eq.connect(highShelf);
      highShelf.connect(compressor);

      // Dry path
      compressor.connect(dryGain);
      dryGain.connect(masterGain);

      // Wet path (reverb)
      compressor.connect(convolver);
      convolver.connect(reverbGain);
      reverbGain.connect(masterGain);

      // Master to output
      masterGain.connect(ctx.destination);

      this.effectsChain = {
        inputGain,
        eq,
        lowShelf,
        highShelf,
        compressor,
        convolver,
        reverbGain,
        dryGain,
        masterGain,
      };

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio effects:", error);
    }
  }

  /**
   * Process audio through the effects chain
   * @param audioBuffer - AudioBuffer to process
   * @returns Processed AudioBuffer or original if effects disabled/unavailable
   */
  async processAudio(audioBuffer: AudioBuffer): Promise<AudioBuffer> {
    if (!this.options.enabled || !this.audioContext || !this.effectsChain) {
      return audioBuffer;
    }

    try {
      const offlineCtx = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate,
      );

      const offlineSource = offlineCtx.createBufferSource();
      offlineSource.buffer = audioBuffer;

      // Clone the effects chain for offline processing
      const offlineLowShelf = offlineCtx.createBiquadFilter();
      offlineLowShelf.type = "lowshelf";
      offlineLowShelf.frequency.value = 200;
      offlineLowShelf.gain.value = this.options.lowBoostDb;

      const offlineEq = offlineCtx.createBiquadFilter();
      offlineEq.type = "peaking";
      offlineEq.frequency.value = 2500;
      offlineEq.Q.value = 1.5;
      offlineEq.gain.value = this.options.presenceDb;

      const offlineHighShelf = offlineCtx.createBiquadFilter();
      offlineHighShelf.type = "highshelf";
      offlineHighShelf.frequency.value = 6000;
      offlineHighShelf.gain.value = 2;

      const offlineCompressor = offlineCtx.createDynamicsCompressor();
      offlineCompressor.threshold.value = this.options.compressorThreshold;
      offlineCompressor.knee.value = 8;
      offlineCompressor.ratio.value = this.options.compressorRatio;
      offlineCompressor.attack.value = 0.003;
      offlineCompressor.release.value = 0.25;

      const offlineConvolver = offlineCtx.createConvolver();
      offlineConvolver.buffer = createArenaReverbImpulse(offlineCtx);

      const offlineReverbGain = offlineCtx.createGain();
      offlineReverbGain.gain.value = this.options.reverbMix;

      const offlineDryGain = offlineCtx.createGain();
      offlineDryGain.gain.value = 1 - this.options.reverbMix;

      const offlineMaster = offlineCtx.createGain();
      offlineMaster.gain.value = this.options.outputVolume;

      // Connect offline chain
      offlineSource.connect(offlineLowShelf);
      offlineLowShelf.connect(offlineEq);
      offlineEq.connect(offlineHighShelf);
      offlineHighShelf.connect(offlineCompressor);
      offlineCompressor.connect(offlineDryGain);
      offlineDryGain.connect(offlineMaster);
      offlineCompressor.connect(offlineConvolver);
      offlineConvolver.connect(offlineReverbGain);
      offlineReverbGain.connect(offlineMaster);
      offlineMaster.connect(offlineCtx.destination);

      // Render
      const renderedBuffer = await offlineCtx.startRendering();
      return renderedBuffer;
    } catch (error) {
      console.error("Error processing audio:", error);
      return audioBuffer;
    }
  }

  /**
   * Resume the audio context (needed after user gesture on some browsers).
   * Returns true if the context is running.
   */
  async resumeAudioContext(): Promise<boolean> {
    if (!this.audioContext) return false;
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    return this.audioContext.state === "running";
  }

  /**
   * Play audio through the effects chain
   */
  playAudio(audioBuffer: AudioBuffer): void {
    if (!this.audioContext || !this.effectsChain) {
      console.warn("Audio effects not initialized");
      return;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.effectsChain.inputGain);
    source.start();
  }

  /**
   * Get the input node for connecting external sources
   */
  getInputNode(): GainNode | null {
    return this.effectsChain?.inputGain ?? null;
  }

  /**
   * Update options dynamically
   */
  updateOptions(newOptions: Partial<AudioEffectsOptions>): void {
    this.options = { ...this.options, ...newOptions };

    if (this.effectsChain) {
      if (newOptions.lowBoostDb !== undefined) {
        this.effectsChain.lowShelf.gain.value = this.options.lowBoostDb;
      }
      if (newOptions.presenceDb !== undefined) {
        this.effectsChain.eq.gain.value = this.options.presenceDb;
      }
      if (newOptions.reverbMix !== undefined) {
        this.effectsChain.reverbGain.gain.value = this.options.reverbMix;
        this.effectsChain.dryGain.gain.value = 1 - this.options.reverbMix;
      }
      if (newOptions.outputVolume !== undefined) {
        this.effectsChain.masterGain.gain.value = this.options.outputVolume;
      }
    }
  }

  /**
   * Get current options
   */
  getOptions(): Readonly<Required<AudioEffectsOptions>> {
    return { ...this.options };
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.effectsChain = null;
    this.isInitialized = false;
  }
}

// Pre-configured effect profiles
export const VOICE_PROFILES = {
  /** Classic darts caller - deep, resonant, moderate reverb */
  dartsCaller: {
    lowBoostDb: 8,
    presenceDb: -3,
    compressorThreshold: -20,
    compressorRatio: 10,
    reverbMix: 0.35,
    outputVolume: 0.9,
  },

  /** Extra dramatic - deeper, more reverb, higher compression */
  dramatic: {
    lowBoostDb: 10,
    presenceDb: -4,
    compressorThreshold: -18,
    compressorRatio: 12,
    reverbMix: 0.45,
    outputVolume: 0.85,
  },

  /** Subtle enhancement - just EQ and light reverb */
  subtle: {
    lowBoostDb: 4,
    presenceDb: 0,
    compressorThreshold: -30,
    compressorRatio: 4,
    reverbMix: 0.2,
    outputVolume: 0.95,
  },
} as const;

export type VoiceProfileName = keyof typeof VOICE_PROFILES;
