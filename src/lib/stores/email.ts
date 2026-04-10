import { writable, derived } from "svelte/store";

const STORAGE_KEY = "darts_email";

function isBrowser(): boolean {
  try {
    return typeof window !== "undefined";
  } catch {
    return false;
  }
}

function getInitialValue(): string {
  if (isBrowser()) {
    try {
      return localStorage.getItem(STORAGE_KEY) || "";
    } catch {
      return "";
    }
  }
  return "";
}

function createEmailStore() {
  const store = writable<string>(getInitialValue());

  return {
    subscribe: store.subscribe,
    setEmail: (newEmail: string) => {
      if (isBrowser()) {
        try {
          localStorage.setItem(STORAGE_KEY, newEmail);
        } catch {
          // ignore storage errors
        }
      }
      store.set(newEmail);
    },
    clearEmail: () => {
      if (isBrowser()) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore storage errors
        }
      }
      store.set("");
    },
    getEmail: (): string => {
      let currentValue = "";
      store.subscribe((v) => (currentValue = v))();
      return currentValue;
    },
    isAuthenticated: derived(store, ($email) => $email.length > 0),
  };
}

export const emailStore = createEmailStore();
