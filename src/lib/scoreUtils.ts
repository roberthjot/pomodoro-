import type { DailyStats, ProductivityBreakdown } from '@/types'
import { todayKey } from './dateUtils'
import { DAILY_TARGET_POMODOROS } from '@config/constants'

export function calculateProductivityScore(
  last7Days: DailyStats[],
  currentStreak: number,
): ProductivityBreakdown {
  const today = last7Days.find((d) => d.dateKey === todayKey())

  // Volume: 0-40 pts — based on today's pomodoros vs daily target
  const todayPomodoros = today?.pomodorosCompleted ?? 0
  const volumeScore = Math.min(40, (todayPomodoros / DAILY_TARGET_POMODOROS) * 40)

  // Consistency: 0-40 pts — how many of last 7 days had ≥1 pomodoro
  const activeDays = last7Days.filter((d) => d.pomodorosCompleted > 0).length
  const consistencyScore = (activeDays / 7) * 40

  // Streak bonus: 0-20 pts
  const streakBonus = Math.min(20, currentStreak * 2)

  const total = Math.round(volumeScore + consistencyScore + streakBonus)

  return {
    volumeScore: Math.round(volumeScore),
    consistencyScore: Math.round(consistencyScore),
    streakBonus: Math.round(streakBonus),
    total,
  }
}
