export interface AchievementCtx {
  totalPomodoros: number
  totalFocusMinutes: number
  currentStreak: number
  longestStreak: number
}

export interface Achievement {
  id: string
  emoji: string
  title: string
  description: string
  unlocked: (c: AchievementCtx) => boolean
  progress: (c: AchievementCtx) => { current: number; target: number }
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-step',
    emoji: '🌱',
    title: 'Primer paso',
    description: 'Completa tu primer pomodoro',
    unlocked: (c) => c.totalPomodoros >= 1,
    progress: (c) => ({ current: Math.min(c.totalPomodoros, 1), target: 1 }),
  },
  {
    id: 'warming-up',
    emoji: '🔥',
    title: 'Calentando',
    description: 'Completa 10 pomodoros',
    unlocked: (c) => c.totalPomodoros >= 10,
    progress: (c) => ({ current: Math.min(c.totalPomodoros, 10), target: 10 }),
  },
  {
    id: 'dedicated',
    emoji: '💪',
    title: 'Dedicado',
    description: 'Completa 50 pomodoros',
    unlocked: (c) => c.totalPomodoros >= 50,
    progress: (c) => ({ current: Math.min(c.totalPomodoros, 50), target: 50 }),
  },
  {
    id: 'centurion',
    emoji: '🏆',
    title: 'Centurión',
    description: 'Completa 100 pomodoros',
    unlocked: (c) => c.totalPomodoros >= 100,
    progress: (c) => ({ current: Math.min(c.totalPomodoros, 100), target: 100 }),
  },
  {
    id: 'on-fire',
    emoji: '⚡',
    title: 'En racha',
    description: 'Mantén una racha de 3 días',
    unlocked: (c) => c.currentStreak >= 3 || c.longestStreak >= 3,
    progress: (c) => ({ current: Math.min(Math.max(c.currentStreak, c.longestStreak), 3), target: 3 }),
  },
  {
    id: 'perfect-week',
    emoji: '📅',
    title: 'Semana perfecta',
    description: 'Mantén una racha de 7 días',
    unlocked: (c) => c.longestStreak >= 7,
    progress: (c) => ({ current: Math.min(c.longestStreak, 7), target: 7 }),
  },
  {
    id: 'unstoppable',
    emoji: '🚀',
    title: 'Imparable',
    description: 'Mantén una racha de 30 días',
    unlocked: (c) => c.longestStreak >= 30,
    progress: (c) => ({ current: Math.min(c.longestStreak, 30), target: 30 }),
  },
  {
    id: 'marathon',
    emoji: '🧠',
    title: 'Maratón mental',
    description: 'Acumula 25 horas de foco',
    unlocked: (c) => c.totalFocusMinutes >= 1500,
    progress: (c) => ({ current: Math.min(Math.round(c.totalFocusMinutes / 60), 25), target: 25 }),
  },
]
