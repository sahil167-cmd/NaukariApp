/**
 * WorkerConnect — MMKV Storage Utility with AsyncStorage Fallback
 * Type-safe wrapper over react-native-mmkv / AsyncStorage.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Try to resolve MMKV class dynamically to prevent crash in Expo Go
let MMKVClass: any = null;
try {
  MMKVClass = require('react-native-mmkv').MMKV;
} catch (e) {
  // MMKV is not available (e.g. Expo Go)
}

class WebMMKV {
  getString(key: string): string | undefined {
    if (typeof window === 'undefined') return undefined;
    const val = localStorage.getItem(key);
    return val === null ? undefined : val;
  }
  set(key: string, value: string | boolean | number): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, String(value));
  }
  getBoolean(key: string): boolean | undefined {
    if (typeof window === 'undefined') return undefined;
    const val = localStorage.getItem(key);
    if (val === null) return undefined;
    return val === 'true';
  }
  delete(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  }
  clearAll(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  }

  // Zustand StateStorage compatibility
  getItem(key: string): string | null {
    return this.getString(key) ?? null;
  }
  setItem(key: string, value: string): void {
    this.set(key, value);
  }
  removeItem(key: string): void {
    this.delete(key);
  }
}

class AsyncStorageFallback {
  private cache: Map<string, string> = new Map();
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.initPromise = this.initialize();
  }

  private async initialize() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const pairs = await AsyncStorage.multiGet(keys);
      for (const [key, value] of pairs) {
        if (value !== null) {
          this.cache.set(key, value);
        }
      }
    } catch (e) {
      console.warn('Failed to initialize AsyncStorageFallback:', e);
    } finally {
      this.initialized = true;
    }
  }

  async waitForInit(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  getString(key: string): string | undefined {
    return this.cache.get(key);
  }

  set(key: string, value: string | boolean | number): void {
    const stringVal = String(value);
    this.cache.set(key, stringVal);
    AsyncStorage.setItem(key, stringVal).catch((e) => {
      console.error(`Failed to write key ${key} to AsyncStorage:`, e);
    });
  }

  getBoolean(key: string): boolean | undefined {
    const val = this.cache.get(key);
    if (val === undefined) return undefined;
    return val === 'true';
  }

  delete(key: string): void {
    this.cache.delete(key);
    AsyncStorage.removeItem(key).catch((e) => {
      console.error(`Failed to delete key ${key} from AsyncStorage:`, e);
    });
  }

  clearAll(): void {
    this.cache.clear();
    AsyncStorage.clear().catch((e) => {
      console.error('Failed to clear AsyncStorage:', e);
    });
  }

  // Zustand StateStorage compatibility
  async getItem(key: string): Promise<string | null> {
    await this.waitForInit();
    return this.getString(key) ?? null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.delete(key);
  }
}

class StorageWrapper {
  private backend: any;

  constructor(backend: any) {
    this.backend = backend;
  }

  getString(key: string): string | undefined {
    return this.backend.getString(key);
  }

  set(key: string, value: string | boolean | number): void {
    this.backend.set(key, value);
  }

  getBoolean(key: string): boolean | undefined {
    return this.backend.getBoolean(key);
  }

  delete(key: string): void {
    this.backend.delete(key);
  }

  clearAll(): void {
    this.backend.clearAll();
  }

  // Zustand StateStorage compatibility
  getItem(key: string): string | null | Promise<string | null> {
    if (typeof this.backend.getItem === 'function') {
      return this.backend.getItem(key);
    }
    return this.backend.getString(key) ?? null;
  }

  setItem(key: string, value: string): void | Promise<void> {
    if (typeof this.backend.setItem === 'function') {
      return this.backend.setItem(key, value);
    }
    this.backend.set(key, value);
  }

  removeItem(key: string): void | Promise<void> {
    if (typeof this.backend.removeItem === 'function') {
      return this.backend.removeItem(key);
    }
    this.backend.delete(key);
  }
}

let nativeMMKV: any = null;
if (Platform.OS !== 'web' && MMKVClass) {
  try {
    nativeMMKV = new MMKVClass({
      id: 'workerconnect-storage',
      encryptionKey: 'wc-secret-key-2024',
    });
  } catch (e: any) {
    if (e?.message?.includes('native MMKV') || e?.message?.includes('MMKV Module')) {
      console.log('MMKV native module not found (expected in Expo Go). Using AsyncStorage fallback.');
    } else {
      console.warn('MMKV initialization failed, using AsyncStorage fallback:', e);
    }
  }
}

export const storage = new StorageWrapper(
  nativeMMKV || (Platform.OS === 'web' ? new WebMMKV() : new AsyncStorageFallback())
);

export const Storage = {
  getString(key: string): string | undefined {
    return storage.getString(key);
  },

  setString(key: string, value: string): void {
    storage.set(key, value);
  },

  getBoolean(key: string): boolean | undefined {
    return storage.getBoolean(key);
  },

  setBoolean(key: string, value: boolean): void {
    storage.set(key, value);
  },

  getObject<T>(key: string): T | undefined {
    const raw = storage.getString(key);
    if (!raw) return undefined;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return undefined;
    }
  },

  setObject<T>(key: string, value: T): void {
    storage.set(key, JSON.stringify(value));
  },

  remove(key: string): void {
    storage.delete(key);
  },

  clearAll(): void {
    storage.clearAll();
  },
};

export default Storage;
