import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayKey } from '@lib/dateUtils'

interface DailyFocusState {
  dateKey: string
  tasks: [string, string, string]
  checked: [boolean, boolean, boolean]
  hasSetToday: boolean
}

interface DailyFocusActions {
  setTasks: (tasks: [string, string, string]) => void
  toggleCheck: (index: 0 | 1 | 2) => void
  isNewDay: () => boolean
}

export const useDailyFocusStore = create<DailyFocusState & DailyFocusActions>()(
  persist(
    (set, get) => ({
      dateKey: '',
      tasks: ['', '', ''],
      checked: [false, false, false],
      hasSetToday: false,

      setTasks: (tasks) =>
        set({ tasks, hasSetToday: true, dateKey: todayKey(), checked: [false, false, false] }),

      toggleCheck: (index) =>
        set((s) => {
          const checked = [...s.checked] as [boolean, boolean, boolean]
          checked[index] = !checked[index]
          return { checked }
        }),

      isNewDay: () => {
        const { dateKey, hasSetToday } = get()
        return !hasSetToday || dateKey !== todayKey()
      },
    }),
    { name: 'pomodoro-daily-focus' },
  ),
)
