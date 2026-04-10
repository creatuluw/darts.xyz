import { writable, derived } from "svelte/store";

const ACCOUNTS_KEY = "darts_accounts";
const ACTIVE_KEY = "darts_email";

function isBrowser(): boolean {
  try {
    return typeof window !== "undefined";
  } catch {
    return false;
  }
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (!isBrowser()) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function removeKey(key: string) {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore storage errors
  }
}

// --- Accounts list store ---
function createAccountsStore() {
  const store = writable<string[]>(readJSON<string[]>(ACCOUNTS_KEY, []));

  return {
    subscribe: store.subscribe,
    get: (): string[] => {
      let val: string[] = [];
      store.subscribe((v) => (val = v))();
      return val;
    },
    add: (email: string) => {
      store.update((list) => {
        if (list.includes(email)) return list;
        const updated = [...list, email];
        writeJSON(ACCOUNTS_KEY, updated);
        return updated;
      });
    },
    remove: (email: string) => {
      store.update((list) => {
        const updated = list.filter((e) => e !== email);
        writeJSON(ACCOUNTS_KEY, updated);
        return updated;
      });
    },
    /** Remove all darts-related keys from localStorage */
    clearAll: () => {
      if (isBrowser()) {
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.startsWith("darts_") || key.startsWith("darts-"))) {
              keysToRemove.push(key);
            }
          }
          for (const key of keysToRemove) {
            localStorage.removeItem(key);
          }
        } catch {
          // ignore
        }
      }
      store.set([]);
    },
  };
}

export const accountsStore = createAccountsStore();

// --- Active email store ---
function createEmailStore() {
  const initial = isBrowser() ? localStorage.getItem(ACTIVE_KEY) || "" : "";
  const store = writable<string>(initial);

  // Ensure the active email is in the accounts list
  if (initial) {
    accountsStore.add(initial);
  }

  return {
    subscribe: store.subscribe,
    /** Set the active email and add it to accounts list */
    setEmail: (newEmail: string) => {
      if (isBrowser()) {
        try {
          localStorage.setItem(ACTIVE_KEY, newEmail);
        } catch {
          // ignore
        }
      }
      store.set(newEmail);
      accountsStore.add(newEmail);
    },
    /** Clear only the active email (returns to email gate) */
    clearEmail: () => {
      removeKey(ACTIVE_KEY);
      store.set("");
    },
    /** Switch to a different existing account */
    switchTo: (email: string) => {
      if (isBrowser()) {
        try {
          localStorage.setItem(ACTIVE_KEY, email);
        } catch {
          // ignore
        }
      }
      store.set(email);
    },
    /** Sign out: remove this account from the instance and switch away */
    signOut: (email: string) => {
      accountsStore.remove(email);
      const remaining = accountsStore.get();
      if (remaining.length > 0) {
        // Switch to the first remaining account
        const next = remaining[0];
        if (isBrowser()) {
          try {
            localStorage.setItem(ACTIVE_KEY, next);
          } catch {
            // ignore
          }
        }
        store.set(next);
      } else {
        removeKey(ACTIVE_KEY);
        store.set("");
      }
    },
    /** Nuclear: wipe everything from localStorage */
    clearAll: () => {
      accountsStore.clearAll();
      removeKey(ACTIVE_KEY);
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
