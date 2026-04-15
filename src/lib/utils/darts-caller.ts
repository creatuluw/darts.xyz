/**
 * Darts Caller TTS Utility
 *
 * Uses ElevenLabs pre-generated soundboard for scores and static events.
 * Uses Kokoro TTS for player-specific events (dynamic player names).
 * Runs 100% locally in the browser for Kokoro, with static audio files for ElevenLabs.
 */

import { KokoroTTS } from "kokoro-js";
import { DramaticVoiceEffects, VOICE_PROFILES } from "./audio-effects";

// RawAudio type - kokoro-js returns this but doesn't export it
interface RawAudio {
  sampleRate: number;
  channels: Float32Array[];
}

// ============================================================================
// Types
// ============================================================================

export interface CallerOptions {
  profile?: "dartsCaller" | "dramatic" | "subtle";
  /** Voice name for Kokoro - use bm_george, bm_daniel, bm_fable, bm_lewis for British male */
  voice?: string;
  volume?: number;
  speed?: number;
  useEffects?: boolean;
  /** Path to audio files directory (ElevenLabs soundboard) */
  audioPath?: string;
  /** Prefix for voice-specific soundboard files (e.g., "scotty-" for scotty-score-100.mp3) */
  voicePrefix?: string;
}

export interface AnnouncementResult {
  success: boolean;
  engine: "elevenlabs" | "kokoro" | "webSpeech" | "none";
  error?: string;
}

// ============================================================================
// RawAudio to AudioBuffer Conversion
// ============================================================================

function rawAudioToAudioBuffer(rawAudio: RawAudio): AudioBuffer {
  const { sampleRate, channels } = rawAudio;
  const numChannels = channels.length;
  const numSamples = channels[0].length;

  const audioBuffer = new AudioBuffer({
    sampleRate,
    numberOfChannels: numChannels,
    length: numSamples,
  });

  for (let i = 0; i < numChannels; i++) {
    audioBuffer.getChannelData(i).set(channels[i]);
  }

  return audioBuffer;
}

// ============================================================================
// Darts Caller Class
// ============================================================================

export class DartsCaller {
  private tts: KokoroTTS | null = null;
  private effects: DramaticVoiceEffects | null = null;
  private options: {
    profile: "dartsCaller" | "dramatic" | "subtle";
    voice: string;
    volume: number;
    speed: number;
    useEffects: boolean;
    audioPath: string;
    voicePrefix: string;
  };
  private isInitialized = false;
  private initPromise: Promise<void> | null = null;
  private currentAudioContext: AudioContext | null = null;
  private audioBufferCache = new Map<string, AudioBuffer>();
  private currentSource: AudioBufferSourceNode | null = null;
  private inFlightFetches = new Map<string, Promise<AudioBuffer>>();

  constructor(options: CallerOptions = {}) {
    this.options = {
      profile: options.profile ?? "dartsCaller",
      voice: options.voice ?? "bm_george",
      volume: options.volume ?? 0.9,
      speed: options.speed ?? 1.0,
      useEffects: options.useEffects ?? true,
      audioPath: options.audioPath ?? "/audio",
      voicePrefix: options.voicePrefix ?? "",
    };
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = this.doInitialize();
    await this.initPromise;
    this.isInitialized = true;
  }

  private async doInitialize(): Promise<void> {
    try {
      // Initialize audio effects
      if (
        this.options.useEffects &&
        typeof window !== "undefined" &&
        "AudioContext" in window
      ) {
        const profileConfig = VOICE_PROFILES[this.options.profile];
        this.effects = new DramaticVoiceEffects({
          ...profileConfig,
          outputVolume: this.options.volume,
          enabled: true,
        });
        await this.effects.initialize();
      }

      // Initialize Kokoro TTS (for player-specific events)
      if (typeof window !== "undefined" && "AudioContext" in window) {
        try {
          this.tts = await KokoroTTS.from_pretrained(
            "onnx-community/Kokoro-82M-v1.0-ONNX",
            {
              dtype: "q8",
              device: "wasm",
            },
          );
          console.log("Kokoro TTS initialized with voice:", this.options.voice);
        } catch (err) {
          console.warn("Kokoro initialization failed:", err);
          this.tts = null;
        }
      }
    } catch (error) {
      console.error("DartsCaller initialization failed:", error);
    }
  }

  setProfile(profile: "dartsCaller" | "dramatic" | "subtle"): void {
    this.options.profile = profile;
    if (this.effects) {
      const profileConfig = VOICE_PROFILES[profile];
      this.effects.updateOptions(profileConfig);
    }
  }

  isUsingKokoro(): boolean {
    return this.tts !== null;
  }

  /**
   * Play a pre-generated audio file from the ElevenLabs soundboard
   */
  private async fetchAndDecode(audioPath: string): Promise<AudioBuffer> {
    const response = await fetch(audioPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch audio file: ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();

    if (!this.currentAudioContext) {
      this.currentAudioContext = new AudioContext();
    }
    const ctx = this.currentAudioContext;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }
    return ctx.decodeAudioData(arrayBuffer);
  }

  private async getOrCacheBuffer(audioPath: string): Promise<AudioBuffer> {
    if (this.audioBufferCache.has(audioPath)) {
      return this.audioBufferCache.get(audioPath)!;
    }

    if (this.inFlightFetches.has(audioPath)) {
      return this.inFlightFetches.get(audioPath)!;
    }

    const promise = this.fetchAndDecode(audioPath);
    this.inFlightFetches.set(audioPath, promise);

    try {
      const buffer = await promise;
      this.audioBufferCache.set(audioPath, buffer);
      return buffer;
    } finally {
      this.inFlightFetches.delete(audioPath);
    }
  }

  private async playSoundFile(filename: string): Promise<AnnouncementResult> {
    if (typeof window === "undefined" || !("AudioContext" in window)) {
      return {
        success: false,
        engine: "none",
        error: "No audio context available",
      };
    }

    await this.initialize();

    const audioPath = `${this.options.audioPath}/${filename}`;

    try {
      const audioBuffer = await this.getOrCacheBuffer(audioPath);
      this.playBufferSimple(audioBuffer);
      return { success: true, engine: "elevenlabs" };
    } catch (err) {
      console.error("[DartsCaller] Failed to play sound file:", filename, err);
      return { success: false, engine: "elevenlabs", error: String(err) };
    }
  }

  // ============================================================================
  // Score Announcements (ElevenLabs Soundboard)
  // ============================================================================

  /**
   * Announce a score using pre-generated ElevenLabs audio file
   */
  async announceScore(score: number): Promise<AnnouncementResult> {
    if (score === 0) return { success: true, engine: "none" };
    if (score < 0 || score > 180) {
      return {
        success: false,
        engine: "none",
        error: "Score must be between 0 and 180",
      };
    }

    return this.playSoundFile(
      this.options.voicePrefix + "score-" + score + ".mp3",
    );
  }

  /**
   * Announce a 180 using the special ElevenLabs recording
   */
  async announce180(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "score-180.mp3");
  }

  // ============================================================================
  // Static Event Announcements (ElevenLabs Soundboard)
  // ============================================================================

  /**
   * Announce bust
   */
  async announceBust(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "bust.mp3");
  }

  /**
   * Announce game on
   */
  async announceGameOn(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "game-on.mp3");
  }

  /**
   * Announce century (100+)
   */
  async announceCentury(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "century.mp3");
  }

  /**
   * Announce high ton (140+)
   */
  async announceHighTon(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "high-ton.mp3");
  }

  /**
   * Announce ton-80 (180)
   */
  async announceTon80(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "ton-80.mp3");
  }

  /**
   * Announce next leg
   */
  async announceNextLeg(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "next-leg.mp3");
  }

  /**
   * Announce next set
   */
  async announceNextSet(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "next-set.mp3");
  }

  /**
   * Announce change of throw
   */
  async announceChangeOfThrow(): Promise<AnnouncementResult> {
    return this.playSoundFile(this.options.voicePrefix + "change-of-throw.mp3");
  }

  /**
   * Announce player 1 or 2 starting
   */
  async announcePlayerStarting(
    playerNumber: 1 | 2,
  ): Promise<AnnouncementResult> {
    return this.playSoundFile(
      this.options.voicePrefix + "player" + playerNumber + "-starting.mp3",
    );
  }

  // ============================================================================
  // Player-Specific Events (Kokoro TTS - Dynamic Player Names)
  // ============================================================================

  /**
   * Announce checkout - uses Kokoro because it needs dynamic player name
   */
  async announceCheckout(playerName: string): Promise<AnnouncementResult> {
    await this.initialize();
    // Try ElevenLabs first, fall back to Kokoro if file doesn't exist
    const result = await this.playSoundFile(
      this.options.voicePrefix + "checkout.mp3",
    );
    if (result.success) {
      return result;
    }
    // Fallback to Kokoro with dynamic player name
    const text = `GAME SHOT! ${playerName}!`;
    return this.speakKokoro(text, 1.1, 0.7);
  }

  /**
   * Announce leg winner - uses Kokoro because it needs dynamic player name
   */
  async announceLegWinner(playerName: string): Promise<AnnouncementResult> {
    await this.initialize();
    const text = `${playerName} wins the leg!`;
    return this.speakKokoro(text, 1.15, 0.75);
  }

  /**
   * Announce set winner - uses Kokoro because it needs dynamic player name
   */
  async announceSetWinner(playerName: string): Promise<AnnouncementResult> {
    await this.initialize();
    const text = `${playerName} wins the set!`;
    return this.speakKokoro(text, 1.15, 0.7);
  }

  /**
   * Announce match winner - uses Kokoro because it needs dynamic player name
   */
  async announceMatchWinner(playerName: string): Promise<AnnouncementResult> {
    await this.initialize();
    const text = `${playerName} wins the match!`;
    return this.speakKokoro(text, 1.2, 0.7);
  }

  /**
   * Announce first throw - uses Kokoro because it needs dynamic player name
   */
  async announceFirstThrow(playerName: string): Promise<AnnouncementResult> {
    await this.initialize();
    // Try ElevenLabs first, fall back to Kokoro if file doesn't exist
    const result = await this.playSoundFile(
      this.options.voicePrefix + "first-throw.mp3",
    );
    if (result.success) {
      return result;
    }
    // Fallback to Kokoro with dynamic player name
    const text = `${playerName} to throw first`;
    return this.speakKokoro(text, 0.95, 0.9);
  }

  // ============================================================================
  // Kokoro TTS Speak
  // ============================================================================

  /**
   * Speak using Kokoro TTS with effects
   */
  private async speakKokoro(
    text: string,
    speed: number = 1.0,
    pitch: number = 1.0,
  ): Promise<AnnouncementResult> {
    if (this.tts) {
      try {
        const rawAudio = await this.tts.generate(text, {
          voice: this.options.voice as any,
          speed,
        });

        const audioBuffer = rawAudioToAudioBuffer(
          rawAudio as unknown as RawAudio,
        );

        // Play through effects or direct
        if (this.effects && this.options.useEffects) {
          const processedBuffer = await this.effects.processAudio(audioBuffer);
          this.playBuffer(processedBuffer);
        } else {
          this.playBuffer(audioBuffer);
        }

        return { success: true, engine: "kokoro" };
      } catch (err) {
        console.warn("Kokoro speech failed:", err);
      }
    }

    // Fallback to Web Speech API
    return this.speakWithWebSpeech(text, speed, pitch);
  }

  /**
   * Fallback to Web Speech API
   */
  private speakWithWebSpeech(
    text: string,
    speed: number,
    pitch: number,
  ): AnnouncementResult {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      return { success: false, engine: "none", error: "No TTS available" };
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speed;
    utterance.pitch = pitch;
    utterance.volume = this.options.volume;

    // Try to find a British male voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) => v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
      ) ||
      voices.find((v) => v.lang === "en-GB") ||
      voices.find((v) => v.lang.startsWith("en"));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    speechSynthesis.speak(utterance);
    return { success: true, engine: "webSpeech" };
  }

  /**
   * Play an AudioBuffer through the audio context
   */
  private stopCurrentSource(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
      } catch {}
      this.currentSource = null;
    }
  }

  private async playBuffer(buffer: AudioBuffer): Promise<void> {
    if (typeof window === "undefined" || !("AudioContext" in window)) return;

    if (!this.currentAudioContext) {
      this.currentAudioContext = new AudioContext();
    }

    const ctx = this.currentAudioContext;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    this.stopCurrentSource();

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    this.currentSource = source;

    if (this.effects && this.options.useEffects) {
      const inputNode = this.effects.getInputNode();
      if (inputNode) {
        source.connect(inputNode);
      } else {
        const gainNode = ctx.createGain();
        gainNode.gain.value = this.options.volume;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
      }
    } else {
      const gainNode = ctx.createGain();
      gainNode.gain.value = this.options.volume;
      source.connect(gainNode);
      gainNode.connect(ctx.destination);
    }

    source.onended = () => {
      if (this.currentSource === source) {
        this.currentSource = null;
      }
    };

    source.start();
  }

  private async playBufferSimple(buffer: AudioBuffer): Promise<void> {
    if (typeof window === "undefined" || !("AudioContext" in window)) return;

    if (!this.currentAudioContext) {
      this.currentAudioContext = new AudioContext();
    }

    const ctx = this.currentAudioContext;
    if (ctx.state === "suspended") {
      await ctx.resume();
    }

    this.stopCurrentSource();

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    this.currentSource = source;

    const gainNode = ctx.createGain();
    gainNode.gain.value = this.options.volume;
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    source.onended = () => {
      if (this.currentSource === source) {
        this.currentSource = null;
      }
    };

    source.start();
  }

  cancel(): void {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
  }

  dispose(): void {
    this.cancel();
    this.stopCurrentSource();
    if (this.effects) {
      this.effects.dispose();
      this.effects = null;
    }
    if (this.currentAudioContext) {
      this.currentAudioContext.close();
      this.currentAudioContext = null;
    }
    this.audioBufferCache.clear();
    this.inFlightFetches.clear();
    this.tts = null;
    this.isInitialized = false;
    this.initPromise = null;
  }
}

// ============================================================================
// Standalone Functions
// ============================================================================

let defaultCaller: DartsCaller | null = null;

export async function initDartsCaller(
  options: CallerOptions = {},
): Promise<DartsCaller> {
  if (defaultCaller) {
    defaultCaller.dispose();
  }
  defaultCaller = new DartsCaller(options);
  await defaultCaller.initialize();
  return defaultCaller;
}

export function getDartsCaller(): DartsCaller | null {
  return defaultCaller;
}

// Score announcements (ElevenLabs)
export async function announceScore(
  score: number,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceScore(score);
}

export async function announce180(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announce180();
}

// Static events (ElevenLabs)
export async function announceBust(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceBust();
}

export async function announceGameOn(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceGameOn();
}

export async function announceCentury(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceCentury();
}

export async function announceHighTon(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceHighTon();
}

export async function announceTon80(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceTon80();
}

export async function announceNextLeg(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceNextLeg();
}

export async function announceNextSet(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceNextSet();
}

export async function announceChangeOfThrow(): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceChangeOfThrow();
}

export async function announcePlayerStarting(
  playerNumber: 1 | 2,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announcePlayerStarting(playerNumber);
}

// Player-specific events (Kokoro TTS)
export async function announceCheckout(
  playerName: string,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceCheckout(playerName);
}

export async function announceLegWinner(
  playerName: string,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceLegWinner(playerName);
}

export async function announceSetWinner(
  playerName: string,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceSetWinner(playerName);
}

export async function announceMatchWinner(
  playerName: string,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceMatchWinner(playerName);
}

export async function announceFirstThrow(
  playerName: string,
): Promise<AnnouncementResult> {
  if (!defaultCaller) {
    await initDartsCaller();
  }
  return defaultCaller!.announceFirstThrow(playerName);
}

export function cancelSpeech(): void {
  if (defaultCaller) {
    defaultCaller.cancel();
  }
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    speechSynthesis.cancel();
  }
}

export function isTTSAvailable(): boolean {
  return typeof window !== "undefined" && "AudioContext" in window;
}

// Re-export for convenience
export { VOICE_PROFILES };
export type { VoiceProfileName } from "./audio-effects";
