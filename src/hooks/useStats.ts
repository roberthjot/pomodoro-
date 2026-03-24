import { useEffect } from 'react'
import { useStatsStore } from '@stores/statsStore'
import { useAuthStore } from '@stores/authStore'
import { getDailyStats } from '@services/stats.service'
import { calculateProductivityScore } from '@lib/scoreUtils'
import { getLast7DayKeys, formatDisplayDate } from '@lib/dateUtils'
import type { DailyStats } from '@/types'

export function useStats() {
  const store = useStatsStore()
  const { user, userProfile } = useAuthStore()

  useEffect(() => {
    if (!user) return
    store.setLoading(true)
    getDailyStats(user.uid, 90).then((stats) => {
      store.setDailyStats(stats)
      store.setLoading(false)

      if (userProfile) {
        store.setStreak(userProfile.currentStreak, userProfile.longestStreak)
        store.setTotals(userProfile.totalFocusMinutes, userProfile.totalSessions)
        const last7Keys = getLast7DayKeys()
        const last7 = last7Keys.map(
          (key) => stats.find((s) => s.dateKey === key) ?? emptyDay(key),
        )
        const { total } = calculateProductivityScore(last7, userProfile.currentStreak)
        store.setProductivityScore(total)
      }
    })
  }, [user?.uid, userProfile?.currentStreak]) // eslint-disable-line react-hooks/exhaustive-deps

  const getChartData = (days: number) => {
    const keys = Array.from({ length: days }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (days - 1 - i))
      return d.toISOString().split('T')[0]
    })
    return keys.map((key) => {
      const stat = store.dailyStats.find((s) => s.dateKey === key)
      return {
        date: formatDisplayDate(key),
        pomodoros: stat?.pomodorosCompleted ?? 0,
        focusMinutes: stat?.focusMinutes ?? 0,
      }
    })
  }

  return {
    dailyStats: store.dailyStats,
    weeklyData: getChartData(7),
    monthlyData: getChartData(30),
    currentStreak: store.currentStreak,
    longestStreak: store.longestStreak,
    totalFocusMinutes: store.totalFocusMinutes,
    totalSessions: store.totalSessions,
    productivityScore: store.productivityScore,
    isLoading: store.isLoading,
    dateRange: store.dateRange,
    setDateRange: store.setDateRange,
  }
}

function emptyDay(dateKey: string): DailyStats {
  return {
    dateKey,
    date: new Date(dateKey),
    pomodorosCompleted: 0,
    focusMinutes: 0,
    breakMinutes: 0,
    tasksCompleted: 0,
    productivityScore: 0,
    sessionIds: [],
  }
}
