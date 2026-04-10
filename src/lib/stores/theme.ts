import { writable } from 'svelte/store';

type ThemeName = 'focus' | 'coastal' | 'ogee';

const VALID_THEMES: ThemeName[] = ['focus', 'coastal', 'ogee'];

function createThemeStore() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('dart-monster-theme') : null;
    const initial: ThemeName = stored && VALID_THEMES.includes(stored as ThemeName) ? (stored as ThemeName) : 'focus';

    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', initial);
    }

    const { subscribe, set } = writable<ThemeName>(initial);

    return {
        subscribe,
        getTheme: () => {
            // get current value — we'll track it internally
            let current = initial;
            subscribe(v => current = v)();
            return current;
        },
        setTheme: (name: ThemeName) => {
            if (!VALID_THEMES.includes(name)) return;
            if (typeof window !== 'undefined') {
                localStorage.setItem('dart-monster-theme', name);
                document.documentElement.setAttribute('data-theme', name);
            }
            set(name);
        }
    };
}

export const themeStore = createThemeStore();
