import { useSyncExternalStore } from "react";

/**
 * Tiny browser-storage backed store for Phase 01 mock state (cart, orders,
 * progress, preferences). Server renders always see `initial`; the browser
 * value takes over right after hydration.
 */
export type LocalStore<T> = {
  get: () => T;
  set: (next: T | ((current: T) => T)) => void;
  subscribe: (listener: () => void) => () => void;
  initial: T;
};

export const createLocalStore = <T,>(key: string, initial: T): LocalStore<T> => {
  let cache: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    if (typeof window === "undefined") return initial;
    if (cache !== undefined) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      cache = raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      cache = initial;
    }
    return cache;
  };

  const emit = () => listeners.forEach((listener) => listener());

  const set: LocalStore<T>["set"] = (next) => {
    const value = typeof next === "function" ? (next as (current: T) => T)(read()) : next;
    cache = value;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked: keep the in-memory value for this visit.
    }
    emit();
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key) return;
      cache = undefined;
      emit();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };

  return { get: read, set, subscribe, initial };
};

export const useLocalStore = <T,>(store: LocalStore<T>): T =>
  useSyncExternalStore(store.subscribe, store.get, () => store.initial);
