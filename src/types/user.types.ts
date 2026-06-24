export interface UserProfile {
  uid: string
  email: string
  displayName: string
  photoURL: string | null
  createdAt: Date
  updatedAt: Date
  totalSessions: number
  totalFocusMinutes: number
  currentStreak: number
  longestStreak: number
  lastSessionDate: Date | null
}

export type AmbientSound =
  | 'none'
  | 'brown-noise'
  | 'rain'
  | 'ocean'
  | 'white-noise'
  | 'wind'
  | 'stream'
  | 'fan'
  | 'drone'

export interface SoundSettings {
  alertSound: 'bell' | 'digital' | 'none'
  volume: number
  tickingEnabled: boolean
  tickingVolume: number
  ambientSound: AmbientSound
  ambientVolume: number
}

export interface NotificationSettings {
  browserNotifications: boolean
  notifyOnSessionEnd: boolean
  notifyOnBreakEnd: boolean
}

export interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  accentColor: string
}

export interface UserSettings {
  timer: import('./timer.types').TimerSettings
  sound: SoundSettings
  notifications: NotificationSettings
  appearance: AppearanceSettings
  updatedAt: Date
}
