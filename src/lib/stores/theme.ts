import { writable } from 'svelte/store';

type ThemeName = 'focus' | 'coastal' | 'ogee';
type ColorMode = 'light' | 'dark';

const VALID_THEMES: ThemeName[] = ['focus', 'coastal', 'ogee'];

function getSystemDark(): boolean {
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyMode(mode: ColorMode) {
    if (typeof window === 'undefined') return;
    if (mode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

function createThemeStore() {
    const storedTheme = typeof window !== 'undefined' ? localStorage.getItem('dart-monster-theme') : null;
    const storedMode = typeof window !== 'undefined' ? localStorage.getItem('dart-monster-mode') : null;

    const initialTheme: ThemeName = storedTheme && VALID_THEMES.includes(storedTheme as ThemeName) ? (storedTheme as ThemeName) : 'focus';
    const initialMode: ColorMode = storedMode === 'light' || storedMode === 'dark' ? (storedMode as ColorMode) : (getSystemDark() ? 'dark' : 'light');

    if (typeof window !== 'undefined') {
        document.documentElement.setAttribute('data-theme', initialTheme);
        applyMode(initialMode);
    }

    const theme = writable<ThemeName>(initialTheme);
    const mode = writable<ColorMode>(initialMode);

    return {
        theme: {
            subscribe: theme.subscribe,
            getTheme: () => {
                let current = initialTheme;
                theme.subscribe(v => current = v)();
                return current;
            },
            setTheme: (name: ThemeName) => {
                if (!VALID_THEMES.includes(name)) return;
                if (typeof window !== 'undefined') {
                    localStorage.setItem('dart-monster-theme', name);
                    document.documentElement.setAttribute('data-theme', name);
                }
                theme.set(name);
            }
        },
        mode: {
            subscribe: mode.subscribe,
            getMode: () => {
                let current = initialMode;
                mode.subscribe(v => current = v)();
                return current;
            },
            setMode: (m: ColorMode) => {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('dart-monster-mode', m);
                    applyMode(m);
                }
                mode.set(m);
            },
            toggle: () => {
                let current: ColorMode | null = null;
                mode.subscribe(v => current = v)();
                const next: ColorMode = current === 'dark' ? 'light' : 'dark';
                if (typeof window !== 'undefined') {
                    localStorage.setItem('dart-monster-mode', next);
                    applyMode(next);
                }
                mode.set(next);
            }
        }
    };
}

export const themeStore = createThemeStore();
