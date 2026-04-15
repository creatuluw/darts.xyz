import { writable } from "svelte/store";

function createFullscreenStore() {
    const { subscribe, set } = writable(false);

    return {
        subscribe,
        set,
        refresh() {
            set(!!document?.fullscreenElement);
        },
    };
}

export const fullscreenStore = createFullscreenStore();
