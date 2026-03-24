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

  const notifySessionEnd = (mode: 'pomodoro' | 'shortBreak' | 'longBreak') => {
    if (!notifications.notifyOnSessionEnd && mode === 'pomodoro') return
    if (!notifications.notifyOnBreakEnd && mode !== 'pomodoro') return
    if (!notifications.browserNotifications) return

    const messages = {
      pomodoro: { title: 'Pomodoro complete!', body: 'Time for a break.' },
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
