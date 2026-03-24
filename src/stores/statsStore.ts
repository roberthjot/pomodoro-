import { create } from 'zustand'
import type { DailyStats } from '@/types'

type DateRange = 'week' | 'month' | '3months'

interface StatsState {
  dailyStats: DailyStats[]
  currentStreak: number
  longestStreak: number
  totalFocusMinutes: number
  totalSessions: number
  productivityScore: number
  isLoading: boolean
  dateRange: DateRange
}

interface StatsActions {
  setDailyStats: (stats: DailyStats[]) => void
  setStreak: (current: number, longest: number) => void
  setTotals: (totalFocusMinutes: number, totalSessions: number) => void
  setProductivityScore: (score: number) => void
  setLoading: (loading: boolean) => void
  setDateRange: (range: DateRange) => void
  reset: () => void
}

export const useStatsStore = create<StatsState & StatsActions>((set) => ({
  dailyStats: [],
  currentStreak: 0,
  longestStreak: 0,
  totalFocusMinutes: 0,
  totalSessions: 0,
  productivityScore: 0,
  isLoading: false,
  dateRange: 'week',

  setDailyStats: (dailyStats) => set({ dailyStats }),
  setStreak: (currentStreak, longestStreak) => set({ currentStreak, longestStreak }),
  setTotals: (totalFocusMinutes, totalSessions) => set({ totalFocusMinutes, totalSessions }),
  setProductivityScore: (productivityScore) => set({ productivityScore }),
  setLoading: (isLoading) => set({ isLoading }),
  setDateRange: (dateRange) => set({ dateRange }),
  reset: () =>
    set({
      dailyStats: [],
      currentStreak: 0,
      longestStreak: 0,
      totalFocusMinutes: 0,
      totalSessions: 0,
      productivityScore: 0,
    }),
}))
