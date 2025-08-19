import { supabase } from '@/lib/supabase';
import { UseWordBankOptions, WordDB } from '@/utils/type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';
import defaultData from '../assets/words.json';
const STORAGE_KEY= 'headeup:wordbank:v1';

export function useWordBank(opts?: UseWordBankOptions){
     const { autoSync = true, mergeStrategy = 'replace', onSync } = opts || {};

     const [words, setWords] = useState<WordDB| null>(null);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState<Error | null>(null);
     
    //  To load the default data from 
     const loadFromBundle = useCallback(async(): Promise<WordDB> =>{
        return (defaultData as  WordDB) ?? {version: 1}
     },[]);

     const loadFromAsync = useCallback(async(): Promise<WordDB | null> =>{
        try{
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            return raw ? (JSON.parse(raw) as WordDB): null;
        }catch(e){
            console.warn('Failed to load wordbank from cache', e);
            return null;
        }
     },[]);

    //  Save WordDB to asyncStorage
     const saveToAsync = useCallback(async(db:WordDB)=>{
        try{
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
        }
        catch(e){
            console.warn('Failed to save wordbank to cache', e);
        }
     },[]);

  const fetchRemote = useCallback(async (): Promise<WordDB | null> => {
      try {
        // 1. Get meta info
        const { data: meta, error: metaErr } = await supabase
          .from('wordbank_meta')
          .select('*')
          .single();

        if (metaErr) throw metaErr;

        // 2. Get active categories
        const { data: categories, error: catErr } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true);

        if (catErr) throw catErr;

        // 3. Get active words
        const { data: words, error: wordErr } = await supabase
          .from('words')
          .select('*')
          .eq('is_active', true);

        if (wordErr) throw wordErr;

        // 4. Transform into WordDB shape
        const db: WordDB = {
          version: meta?.version || 1,
          last_updated: meta?.last_updated || new Date().toISOString(),
        };

        categories?.forEach(cat => {
          db[cat.name] = words?.filter(w => w.category_id === cat.id) || [];
        });

        return db;
      } catch (e) {
        console.warn('Supabase fetch failed', e);
        return null;
      }
}, []);


     
  const isServerNewer = useCallback((server?: WordDB | null, local?: WordDB | null) => {
    if (!server) return false;
    if (!local) return true;

    if (typeof server.version === 'number' && typeof local.version === 'number') {
      return server.version > local.version;
    }

    if (server.last_updated && local.last_updated) {
      return new Date(server.last_updated).getTime() > new Date(local.last_updated).getTime();
    }

    return false;
}, []);

  const mergeDBs = useCallback((local: WordDB, server: WordDB) => {
    if (!server) return local;
    if (mergeStrategy === 'replace') return server;

    const merged: WordDB = { ...(local || {}), version: server.version ?? local.version, last_updated: server.last_updated ?? local.last_updated };

    Object.keys(server).forEach((k) => {
      if (k === 'version' || k === 'last_updated') return;
      const serverVal = server[k];
      const localVal = local[k];

      if (Array.isArray(serverVal) && Array.isArray(localVal)) {
        const map = new Map<any, any>();
        localVal.forEach((item: any) => map.set(item.id, item));
        serverVal.forEach((item: any) => map.set(item.id, item));
        merged[k] = Array.from(map.values());
      } else {
        merged[k] = serverVal;
      }
    });
    return merged;
  }, [mergeStrategy]);

  const refresh = useCallback(async (force = false) => {
    setIsLoading(true);
    setError(null);

    try {
      let local = await loadFromAsync();
      if (!local) {
        local = await loadFromBundle();
        await saveToAsync(local);
      }

      if (!autoSync && !force) {
        setWords(local);
        setIsLoading(false);
        return;
      }

      const server = await fetchRemote();
      if (isServerNewer(server, local) || force) {
        const updated = mergeDBs(local, server ?? local);
        await saveToAsync(updated);
        setWords(updated);
        onSync?.(true);
      } else {
        setWords(local);
        onSync?.(false);
      }
    } catch (e: any) {
      setError(e);
      const fallback = (await loadFromAsync()) ?? (await loadFromBundle());
      setWords(fallback);
    } finally {
      setIsLoading(false);
    }
  }, [autoSync, fetchRemote, isServerNewer, loadFromBundle, loadFromAsync, mergeDBs, onSync, saveToAsync]);

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
