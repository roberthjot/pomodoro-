export function isNotificationSupported(): boolean {
  return 'Notification' in window
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isNotificationSupported()) return 'denied'
  return Notification.requestPermission()
}

export function sendNotification(title: string, options?: NotificationOptions): void {
  if (!isNotificationSupported()) return
  if (Notification.permission !== 'granted') return
  new Notification(title, {
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    ...options,
  })
}
