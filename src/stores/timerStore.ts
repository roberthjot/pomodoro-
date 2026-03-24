import { create } from 'zustand'
import type { TimerMode, TimerStatus } from '@/types'

interface TimerState {
  mode: TimerMode
  status: TimerStatus
  secondsRemaining: number
  totalSeconds: number
  pomodoroCount: number
  sessionCount: number
  activeTaskId: string | null
  startedAt: number | null
}

interface TimerActions {
  setMode: (mode: TimerMode, totalSeconds: number) => void
  setStatus: (status: TimerStatus) => void
  setSecondsRemaining: (seconds: number) => void
  setTotalSeconds: (seconds: number) => void
  incrementPomodoroCount: () => void
  incrementSessionCount: () => void
  resetPomodoroCount: () => void
  setActiveTaskId: (taskId: string | null) => void
  setStartedAt: (ts: number | null) => void
  resetTimer: (totalSeconds: number) => void
}

export const useTimerStore = create<TimerState & TimerActions>((set) => ({
  mode: 'pomodoro',
  status: 'idle',
  secondsRemaining: 25 * 60,
  totalSeconds: 25 * 60,
  pomodoroCount: 0,
  sessionCount: 0,
  activeTaskId: null,
  startedAt: null,

  setMode: (mode, totalSeconds) =>
    set({ mode, secondsRemaining: totalSeconds, totalSeconds, status: 'idle', startedAt: null }),

  setStatus: (status) => set({ status }),

  setSecondsRemaining: (seconds) => set({ secondsRemaining: seconds }),

  setTotalSeconds: (totalSeconds) => set({ totalSeconds }),

  incrementPomodoroCount: () => set((s) => ({ pomodoroCount: s.pomodoroCount + 1 })),

  incrementSessionCount: () => set((s) => ({ sessionCount: s.sessionCount + 1 })),

  resetPomodoroCount: () => set({ pomodoroCount: 0 }),

  setActiveTaskId: (activeTaskId) => set({ activeTaskId }),

  setStartedAt: (startedAt) => set({ startedAt }),

  resetTimer: (totalSeconds) =>
    set({ secondsRemaining: totalSeconds, totalSeconds, status: 'idle', startedAt: null }),
}))
