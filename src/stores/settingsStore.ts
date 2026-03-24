import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimerSettings, SoundSettings, NotificationSettings, AppearanceSettings } from '@/types'
import {
  DEFAULT_TIMER,
  DEFAULT_SOUND,
  DEFAULT_NOTIFICATIONS,
  DEFAULT_APPEARANCE,
} from '@config/constants'

interface SettingsState {
  timer: TimerSettings
  sound: SoundSettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
  isSynced: boolean
}

interface SettingsActions {
  updateTimerSettings: (s: Partial<TimerSettings>) => void
  updateSoundSettings: (s: Partial<SoundSettings>) => void
  updateNotificationSettings: (s: Partial<NotificationSettings>) => void
  updateAppearanceSettings: (s: Partial<AppearanceSettings>) => void
  loadFromFirestore: (data: Omit<SettingsState, 'isSynced'>) => void
  resetToDefaults: () => void
  setSynced: (synced: boolean) => void
}

const defaultSettings: Omit<SettingsState, 'isSynced'> = {
  timer: { ...DEFAULT_TIMER },
  sound: { ...DEFAULT_SOUND },
  notifications: { ...DEFAULT_NOTIFICATIONS },
  appearance: { ...DEFAULT_APPEARANCE },
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      ...defaultSettings,
      isSynced: false,

      updateTimerSettings: (s) =>
        set((state) => ({ timer: { ...state.timer, ...s } })),

      updateSoundSettings: (s) =>
        set((state) => ({ sound: { ...state.sound, ...s } })),

      updateNotificationSettings: (s) =>
        set((state) => ({ notifications: { ...state.notifications, ...s } })),

      updateAppearanceSettings: (s) =>
        set((state) => ({ appearance: { ...state.appearance, ...s } })),

      loadFromFirestore: (data) =>
        set({ ...data, isSynced: true }),

      resetToDefaults: () =>
        set({ ...defaultSettings }),

      setSynced: (synced) => set({ isSynced: synced }),
    }),
    {
      name: 'pomodoro-settings',
      partialize: (state) => ({
        timer: state.timer,
        sound: state.sound,
        notifications: state.notifications,
        appearance: state.appearance,
      }),
    },
  ),
)
