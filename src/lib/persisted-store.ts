import '@/lib/local-storage';

import { useSyncExternalStore } from 'react';

/**
 * A tiny synchronous store backed by `localStorage` (SQLite on native, the browser on web).
 * Components subscribe with `use()` and re-render whenever `set()` is called.
 */
export function createPersistedStore<T>(key: string, initial: T) {
  let value = read();
  const listeners = new Set<() => void>();

  function read(): T {
    try {
      const raw = globalThis.localStorage?.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  }

  function get() {
    return value;
  }

  function set(next: T) {
    value = next;
    try {
      globalThis.localStorage?.setItem(key, JSON.stringify(next));
    } catch {
      // Keep the in-memory value even if persisting fails.
    }
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function use() {
    return useSyncExternalStore(subscribe, get, () => initial);
  }

  return { get, set, use };
}

export function createId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
