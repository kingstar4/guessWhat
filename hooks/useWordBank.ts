import { WordDB } from '@/utils/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import defaultData from '../assets/words.json';

const STORAGE_KEY = 'headeup:wordbank:v1';

export function useWordBank() {
  const [words, setWords] = useState<WordDB | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load the default data from bundled JSON
  const loadFromBundle = useCallback(async (): Promise<WordDB> => {
    return (defaultData as WordDB) ?? { version: 1 }
  }, []);

  // Load from AsyncStorage cache
  const loadFromAsync = useCallback(async (): Promise<WordDB | null> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as WordDB) : null;
    } catch (e) {
      console.warn('Failed to load wordbank from cache', e);
      return null;
    }
  }, []);

  // Save WordDB to AsyncStorage
  const saveToAsync = useCallback(async (db: WordDB) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
    }
    catch (e) {
      console.warn('Failed to save wordbank to cache', e);
    }
  }, []);

  // Load words from local JSON and cache
  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Try to load from cache first
      let cached = await loadFromAsync();

      // Load from bundled JSON
      const bundled = await loadFromBundle();

      // If cache exists and has same version, use cache
      // Otherwise use bundled data and update cache
      if (cached && cached.version === bundled.version) {
        setWords(cached);
      } else {
        setWords(bundled);
        await saveToAsync(bundled);
      }
    } catch (e: any) {
      setError(e);
      // Fallback to bundled data
      const fallback = await loadFromBundle();
      setWords(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [loadFromBundle, loadFromAsync, saveToAsync]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const clearCache = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      const def = await loadFromBundle();
      await saveToAsync(def);
      setWords(def);
    } catch (e) {
      console.warn('Failed to clear cache', e);
    }
  }, [loadFromBundle, saveToAsync]);

  return { words, isLoading, error, refresh, clearCache } as const;
}
