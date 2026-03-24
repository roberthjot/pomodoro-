import type { TimerMode } from './timer.types'

export interface PomodoroSession {
  id: string
  taskId: string | null
  taskTitle: string | null
  mode: TimerMode
  durationMinutes: number
  startedAt: Date
  completedAt: Date
  wasInterrupted: boolean
  dateKey: string
}

export interface DailyStats {
  dateKey: string
  date: Date
  pomodorosCompleted: number
  focusMinutes: number
  breakMinutes: number
  tasksCompleted: number
  productivityScore: number
  sessionIds: string[]
}

export interface ProductivityBreakdown {
  volumeScore: number
  consistencyScore: number
  streakBonus: number
  total: number
}
