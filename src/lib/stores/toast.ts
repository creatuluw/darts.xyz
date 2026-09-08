import { writable } from 'svelte/store';

type ToastType = 'success' | 'info' | 'error';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  timeout: ReturnType<typeof setTimeout>;
}

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);
  let nextId = 0;

  function addToast(message: string, type: ToastType = 'info', duration = 3000) {
    const id = nextId++;
    const timeout = setTimeout(() => removeToast(id), duration);

    update((toasts) => [...toasts, { id, message, type, timeout }]);
  }

  function removeToast(id: number) {
    update((toasts) => {
      const toast = toasts.find((t) => t.id === id);
      if (toast) clearTimeout(toast.timeout);
      return toasts.filter((t) => t.id !== id);
    });
  }

  return { subscribe, addToast, removeToast };
}

export const toasts = createToastStore();
export const addToast = toasts.addToast;
export const removeToast = toasts.removeToast;
