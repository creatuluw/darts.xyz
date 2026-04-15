import { writable } from "svelte/store";

function createLoadingStore() {
    const { subscribe, update } = writable<
        { key: string; message: string }[]
    >([]);

    function start(key: string, message: string) {
        update((items) => {
            const filtered = items.filter((i) => i.key !== key);
            return [...filtered, { key, message }];
        });
    }

    function finish(key: string) {
        update((items) => items.filter((i) => i.key !== key));
    }

    return { subscribe, start, finish };
}

export const loadingStore = createLoadingStore();
