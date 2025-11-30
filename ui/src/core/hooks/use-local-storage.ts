import { useState, useSyncExternalStore } from 'react';

function createLocalStorageStore<T>(key: string, initialValue: T) {
  let listeners: Array<() => void> = [];

  const subscribe = (listener: () => void) => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  };

  const getSnapshot = (): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  };

  const getServerSnapshot = (): T => {
    return initialValue;
  };

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const currentValue = getSnapshot();
      const valueToStore = value instanceof Function ? value(currentValue) : value;
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
      listeners.forEach((listener) => listener());
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      listeners.forEach((listener) => listener());
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return { subscribe, getSnapshot, getServerSnapshot, setValue, removeValue };
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [store] = useState(() => createLocalStorageStore(key, initialValue));

  const value = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );

  return [value, store.setValue, store.removeValue];
}
