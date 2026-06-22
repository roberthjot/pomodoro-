// Default timer durations in minutes
export const DEFAULT_TIMER = {
  pomodoroDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  hyperfocusDuration: 52,
  hyperfocusBreakDuration: 17,
} as const

// Default sound settings
export const DEFAULT_SOUND = {
  alertSound: 'bell' as const,
  volume: 80,
  tickingEnabled: false,
  tickingVolume: 30,
  ambientSound: 'none' as const,
  ambientVolume: 40,
}

// Ambient sound options
export const AMBIENT_OPTIONS = [
  { value: 'none' as const,        label: 'None',        emoji: '🔇', description: '' },
  { value: 'brown-noise' as const, label: 'Brown Noise', emoji: '🟤', description: 'Deep rumble' },
  { value: 'rain' as const,        label: 'Rain',        emoji: '🌧️', description: 'Gentle rain' },
  { value: 'ocean' as const,       label: 'Ocean',       emoji: '🌊', description: 'Ocean waves' },
  { value: 'white-noise' as const, label: 'White Noise', emoji: '📡', description: 'Flat static' },
]

// Default notification settings
export const DEFAULT_NOTIFICATIONS = {
  browserNotifications: false,
  notifyOnSessionEnd: true,
  notifyOnBreakEnd: true,
}

// Default appearance settings
export const DEFAULT_APPEARANCE = {
  theme: 'system' as const,
  accentColor: '#ef4444',
}

// Productivity score target
export const DAILY_TARGET_POMODOROS = 8

// Task limits
export const MAX_TASK_TITLE_LENGTH = 200
export const MAX_TASK_NOTES_LENGTH = 1000
export const MAX_TAGS_PER_TASK = 5
export const MAX_ESTIMATED_POMODOROS = 20

// DnD reorder threshold
export const DND_REINDEX_THRESHOLD = 0.001
export const DND_INITIAL_ORDER_STEP = 1000

// Keyboard shortcuts
export const SHORTCUTS = [
  { key: 'Space', description: 'Play / Pause' },
  { key: 'R', description: 'Reset timer' },
  { key: 'S', description: 'Skip to next session' },
  { key: '1', description: 'Switch to Pomodoro' },
  { key: '2', description: 'Switch to Short Break' },
  { key: '3', description: 'Switch to Long Break' },
  { key: '4', description: 'Switch to Hiperfoco' },
] as const

// Full color theme presets (name + accent + gradient preview)
export const COLOR_THEMES = [
  { name: 'Tomate', accent: '#ef4444', from: '#ef4444', to: '#f97316' },
  { name: 'Océano', accent: '#3b82f6', from: '#3b82f6', to: '#06b6d4' },
  { name: 'Bosque', accent: '#22c55e', from: '#22c55e', to: '#14b8a6' },
  { name: 'Atardecer', accent: '#f59e0b', from: '#f59e0b', to: '#ec4899' },
  { name: 'Lavanda', accent: '#8b5cf6', from: '#8b5cf6', to: '#d946ef' },
  { name: 'Rosa', accent: '#ec4899', from: '#ec4899', to: '#f43f5e' },
] as const

// Accent color presets
export const ACCENT_COLORS = [
  { label: 'Red', value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Green', value: '#22c55e' },
  { label: 'Teal', value: '#14b8a6' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Pink', value: '#ec4899' },
] as const
