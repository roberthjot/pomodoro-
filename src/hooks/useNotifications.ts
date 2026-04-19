import { useState, useEffect } from 'react'
import { useSettingsStore } from '@stores/settingsStore'
import {
  isNotificationSupported,
  requestNotificationPermission,
  sendNotification,
} from '@lib/notification'

export function useNotifications() {
  const { notifications } = useSettingsStore()
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if (isNotificationSupported()) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
    return result
  }

  const notifySessionEnd = (mode: 'pomodoro' | 'shortBreak' | 'longBreak' | 'hyperfocus') => {
    const isWork = mode === 'pomodoro' || mode === 'hyperfocus'
    if (!notifications.notifyOnSessionEnd && isWork) return
    if (!notifications.notifyOnBreakEnd && !isWork) return
    if (!notifications.browserNotifications) return

    const messages: Record<string, { title: string; body: string }> = {
      pomodoro: { title: 'Pomodoro complete!', body: 'Time for a break.' },
      hyperfocus: { title: '⚡ Hiperfoco completado!', body: 'Tómate 17 minutos de descanso.' },
      shortBreak: { title: 'Break over!', body: 'Ready to focus again?' },
      longBreak: { title: 'Long break over!', body: "Let's get back to work." },
    }

    const { title, body } = messages[mode]
    sendNotification(title, { body })
  }

  return {
    permission,
    requestPermission,
    notify: notifySessionEnd,
    isSupported: isNotificationSupported(),
  }
}
