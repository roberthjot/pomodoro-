import { useEffect, useRef } from 'react'
import { useSettingsStore } from '@stores/settingsStore'
import { useAuthStore } from '@stores/authStore'
import { getUserSettings, saveUserSettings } from '@services/settings.service'
import type { TimerSettings, SoundSettings, NotificationSettings, AppearanceSettings } from '@/types'

export function useSettings() {
  const store = useSettingsStore()
  const { user } = useAuthStore()
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load from Firestore on auth
  useEffect(() => {
    if (!user) return
    getUserSettings(user.uid).then((settings) => {
      if (settings) {
        store.loadFromFirestore({
          timer: settings.timer,
          sound: settings.sound,
          notifications: settings.notifications,
          appearance: settings.appearance,
        })
      }
    })
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  const scheduleSave = () => {
    if (!user) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      const current = useSettingsStore.getState()
      saveUserSettings(user.uid, {
        timer: current.timer,
        sound: current.sound,
        notifications: current.notifications,
        appearance: current.appearance,
      })
    }, 2000)
  }

  const updateTimerSettings = (s: Partial<TimerSettings>) => {
    store.updateTimerSettings(s)
    scheduleSave()
  }

  const updateSoundSettings = (s: Partial<SoundSettings>) => {
    store.updateSoundSettings(s)
    scheduleSave()
  }

  const updateNotificationSettings = (s: Partial<NotificationSettings>) => {
    store.updateNotificationSettings(s)
    scheduleSave()
  }

  const updateAppearanceSettings = (s: Partial<AppearanceSettings>) => {
    store.updateAppearanceSettings(s)
    scheduleSave()
  }

  return {
    settings: {
      timer: store.timer,
      sound: store.sound,
      notifications: store.notifications,
      appearance: store.appearance,
    },
    updateTimerSettings,
    updateSoundSettings,
    updateNotificationSettings,
    updateAppearanceSettings,
    resetToDefaults: store.resetToDefaults,
  }
}
