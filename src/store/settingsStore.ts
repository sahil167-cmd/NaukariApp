/**
 * WorkerConnect — Settings Store (Zustand)
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage } from '../utils/storage';
import { STORAGE_KEYS } from '../constants';
import type { AppSettings } from '../types';

interface SettingsState extends AppSettings {
  setLanguage: (lang: string) => void;
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  toggleNotifications: () => void;
  toggleJobAlerts: () => void;
  toggleSmsAlerts: () => void;
  resetSettings: () => void;
}

const defaultSettings: AppSettings = {
  language: 'en',
  themeMode: 'light',
  notificationsEnabled: true,
  jobAlerts: true,
  smsAlerts: false,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setLanguage: (language) => set({ language }),
      setThemeMode: (themeMode) => set({ themeMode }),
      toggleNotifications: () =>
        set((s) => ({ notificationsEnabled: !s.notificationsEnabled })),
      toggleJobAlerts: () => set((s) => ({ jobAlerts: !s.jobAlerts })),
      toggleSmsAlerts: () => set((s) => ({ smsAlerts: !s.smsAlerts })),
      resetSettings: () => set(defaultSettings),
    }),
    {
      name: STORAGE_KEYS.THEME_MODE,
      storage: createJSONStorage(() => storage),
    }
  )
);
