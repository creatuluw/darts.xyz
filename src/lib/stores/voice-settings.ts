/**
 * Voice Settings Store
 *
 * Global store for managing voice/caller settings.
 * Persists to localStorage so settings survive page reloads.
 */

import { writable } from "svelte/store";

export interface VoiceSetting {
  id: string;
  name: string;
  prefix: string;
  voiceId: string;
  description: string;
}

export const VOICE_OPTIONS: VoiceSetting[] = [
  {
    id: "jack",
    name: "Jack",
    prefix: "",
    voiceId: "HXxCKoODRGGczJ39r5SZ",
    description: "Jack - Deep authoritative male voice",
  },
  {
    id: "scotty",
    name: "Scotty",
    prefix: "scotty-",
    voiceId: "wo6udizrrtpIxWGp2qJk",
    description: "Scottish style voice (wo6udizrrtpIxWGp2qJk)",
  },
  {
    id: "janet",
    name: "Janet",
    prefix: "voice3-",
    voiceId: "19STyYD15bswVz51nqLf",
    description: "Janet - Female voice",
  },
];

const STORAGE_KEY = "darts-voice-settings";

function getInitialValue(): string {
  if (typeof window === "undefined") return "scotty";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && VOICE_OPTIONS.find((v) => v.id === stored)) return stored;
  return "scotty";
}

function createVoiceSettingsStore() {
  const { subscribe, set, update } = writable<string>(getInitialValue());

  return {
    subscribe,
    set: (value: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, value);
      }
      set(value);
    },
    update,
    getVoiceSetting: (): VoiceSetting => {
      let currentValue = "default";
      subscribe((v) => (currentValue = v))();
      return (
        VOICE_OPTIONS.find((v) => v.id === currentValue) || VOICE_OPTIONS[0]
      );
    },
  };
}

export const voiceSettings = createVoiceSettingsStore();

export function getVoicePrefix(): string {
  const setting = VOICE_OPTIONS.find((v) => v.id === getInitialValue());
  return setting?.prefix || "";
}
