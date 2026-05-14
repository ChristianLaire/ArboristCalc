import { useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Debounced autosave — writes value to AsyncStorage 600ms after the last change.
// Pass any serialisable object; it is JSON-stringified before storage.
export function useAutosave<T extends object>(key: string, value: T, delayMs = 600): void {
  const timer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const serial = JSON.stringify(value);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      AsyncStorage.setItem(key, serial);
    }, delayMs);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [key, serial, delayMs]);
}

// Load a previously autosaved snapshot. Returns null if nothing was saved yet.
export async function loadAutosaved<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
