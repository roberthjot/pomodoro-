import { useCallback, useEffect, useRef } from 'react'
import { useTimerStore } from '@stores/timerStore'
import { useTaskStore } from '@stores/taskStore'
import { useAuthStore } from '@stores/authStore'
import { useSettingsStore } from '@stores/settingsStore'
import { useStatsStore } from '@stores/statsStore'
import { useSound } from './useSound'
import { useNotifications } from './useNotifications'
import { recordSession } from '@services/stats.service'
import { updateStreakAndCounters } from '@services/user.service'
import { updateTask as persistTaskUpdate } from '@services/task.service'
import { formatTime } from '@lib/utils'
import { todayKey } from '@lib/dateUtils'
import { ambientMusic } from '@lib/ambientMusic'
import toast from 'react-hot-toast'
import type { TimerMode } from '@/types'

export function useTimer() {
  const timer = useTimerStore()
  const settings = useSettingsStore()
  const { user, userProfile } = useAuthStore()
  const taskStore = useTaskStore()
  const statsStore = useStatsStore()
  const { playAlert, playTick, stopTick } = useSound()
  const { notify } = useNotifications()
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getDuration = useCallback(
    (mode: TimerMode): number => {
      const { timer: t } = settings
      const map: Record<TimerMode, number> = {
        pomodoro: t.pomodoroDuration * 60,
        shortBreak: t.shortBreakDuration * 60,
        longBreak: t.longBreakDuration * 60,
        hyperfocus: (t.hyperfocusDuration ?? 52) * 60,
      }
      return map[mode]
    },
    [settings],
  )

  // Sync title with timer
  useEffect(() => {
    if (timer.status === 'running') {
      document.title = `${formatTime(timer.secondsRemaining)} — Pomodoro`
    } else {
      document.title = 'Pomodoro Focus Timer'
    }
  }, [timer.secondsRemaining, timer.status])

  // Fix drift when tab becomes visible again
  useEffect(() => {
    const handler = () => {
      if (timer.status !== 'running' || !timer.startedAt) return
      const elapsed = Math.floor((Date.now() - timer.startedAt) / 1000)
      const corrected = Math.max(0, timer.totalSeconds - elapsed)
      timer.setSecondsRemaining(corrected)
    }
    document.addEventListener('visibilitychange', handler)
    return () => document.removeEventListener('visibilitychange', handler)
  }, [timer.status, timer.startedAt, timer.totalSeconds]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearInterval_ = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const onSessionComplete = useCallback(async () => {
    clearInterval_()
    stopTick()
    ambientMusic.stop()
    timer.setStatus('finished')
    playAlert()
    notify(timer.mode)

    const durationMinutes = Math.floor(getDuration(timer.mode) / 60)

    if (timer.mode === 'pomodoro' || timer.mode === 'hyperfocus') {
      timer.incrementPomodoroCount()
      timer.incrementSessionCount()

      // Increment task pomodoro count — read fresh state to avoid stale closure
      const activeTask = useTaskStore.getState().getActiveTask()
      console.log('[timer] session complete — activeTask:', activeTask?.id, activeTask?.title, 'completedPomodoros:', activeTask?.completedPomodoros)
      if (activeTask) {
        const nextCompletedPomodoros = (activeTask.completedPomodoros ?? 0) + 1
        const estimated = activeTask.estimatedPomodoros ?? 1
        const isDone = nextCompletedPomodoros >= estimated
        const taskUpdates = {
          completedPomodoros: nextCompletedPomodoros,
          status: isDone ? ('completed' as const) : activeTask.status,
          completedAt: isDone ? new Date() : activeTask.completedAt,
          isActiveTask: isDone ? false : activeTask.isActiveTask,
        }

        console.log('[timer] updating task:', taskUpdates)
        useTaskStore.getState().updateTask(activeTask.id, taskUpdates)

        const currentUser = useAuthStore.getState().user
        if (currentUser) {
          try {
            await persistTaskUpdate(currentUser.uid, activeTask.id, taskUpdates)
          } catch (error) {
            console.error('Failed to persist task pomodoro progress', error)
            toast.error('Pomodoro completed, but task progress could not be synced.')
          }
        }
      } else {
        console.warn('[timer] no active task found — pomodoro not credited to any task')
      }

      // Save session to Firestore
      if (user) {
        try {
          const startedAt = timer.startedAt ? new Date(timer.startedAt) : new Date()
          const completedAt = new Date()
          await recordSession(user.uid, {
            taskId: activeTask?.id ?? null,
            taskTitle: activeTask?.title ?? null,
            mode: 'pomodoro',
            durationMinutes,
            startedAt,
            completedAt,
            wasInterrupted: false,
            dateKey: todayKey(),
          })

          // Update streak
          if (userProfile) {
            const lastDate = userProfile.lastSessionDate
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)

            let newStreak = userProfile.currentStreak
            if (!lastDate) {
              newStreak = 1
            } else {
              const last = new Date(lastDate)
              last.setHours(0, 0, 0, 0)
              if (last.getTime() === yesterday.getTime()) {
                newStreak += 1
              } else if (last.getTime() < yesterday.getTime()) {
                newStreak = 1
              }
            }

            const longestStreak = Math.max(newStreak, userProfile.longestStreak)
            statsStore.setStreak(newStreak, longestStreak)

            await updateStreakAndCounters(user.uid, {
              currentStreak: newStreak,
              longestStreak,
              totalSessions: userProfile.totalSessions + 1,
              totalFocusMinutes: userProfile.totalFocusMinutes + durationMinutes,
              lastSessionDate: new Date(),
            })
          }
        } catch (error) {
          console.error('Failed to persist completed pomodoro session', error)
          toast.error('Pomodoro completed, but it could not be synced.')
        }
      }
    }

    // Determine next mode
    const longBreakInterval = settings.timer.longBreakInterval
    let nextMode: TimerMode = 'shortBreak'
    let nextDuration: number

    if (timer.mode === 'hyperfocus') {
      // Hyperfocus → 17-min break, then back to hyperfocus
      nextMode = 'shortBreak'
      nextDuration = (settings.timer.hyperfocusBreakDuration ?? 17) * 60
      timer.setFromHyperfocus(true)
    } else if (timer.mode === 'pomodoro') {
      const newCount = timer.pomodoroCount + 1
      nextMode = newCount % longBreakInterval === 0 ? 'longBreak' : 'shortBreak'
      nextDuration = getDuration(nextMode)
    } else {
      // Break completed
      if (timer.fromHyperfocus) {
        nextMode = 'hyperfocus'
        timer.setFromHyperfocus(false)
      } else {
        nextMode = 'pomodoro'
      }
      nextDuration = getDuration(nextMode)
    }

    // Auto-start logic
    const autoStart =
      (timer.mode === 'pomodoro' && settings.timer.autoStartBreaks) ||
      (timer.mode !== 'pomodoro' && settings.timer.autoStartPomodoros)

    setTimeout(() => {
      timer.setMode(nextMode, nextDuration)
      if (autoStart) {
        timer.setStartedAt(Date.now())
        timer.setStatus('running')
        startInterval()
        ambientMusic.play()
      }
    }, 500)
  }, [timer, settings, user, userProfile, taskStore, statsStore, playAlert, notify, stopTick, getDuration]) // eslint-disable-line react-hooks/exhaustive-deps

  const startInterval = useCallback(() => {
    clearInterval_()
    intervalRef.current = setInterval(() => {
      useTimerStore.setState((s) => {
        if (s.secondsRemaining <= 1) {
          return { secondsRemaining: 0 }
        }
        return { secondsRemaining: s.secondsRemaining - 1 }
      })
    }, 1000)
  }, [])

  // Watch for zero
  useEffect(() => {
    if (timer.status === 'running' && timer.secondsRemaining === 0) {
      onSessionComplete()
    }
  }, [timer.secondsRemaining, timer.status, onSessionComplete])

  const start = useCallback(() => {
    timer.setStartedAt(Date.now())
    timer.setStatus('running')
    playTick()
    ambientMusic.play()
    startInterval()
  }, [timer, playTick, startInterval])

  const pause = useCallback(() => {
    clearInterval_()
    stopTick()
    ambientMusic.stop()
    timer.setStatus('paused')
  }, [timer, stopTick])

  const resume = useCallback(() => {
    timer.setStartedAt(Date.now() - (timer.totalSeconds - timer.secondsRemaining) * 1000)
    timer.setStatus('running')
    playTick()
    ambientMusic.play()
    startInterval()
  }, [timer, playTick, startInterval])

  const reset = useCallback(() => {
    clearInterval_()
    stopTick()
    ambientMusic.stop()
    timer.resetTimer(getDuration(timer.mode))
  }, [timer, stopTick, getDuration])

  const skip = useCallback(() => {
    clearInterval_()
    stopTick()
    ambientMusic.stop()
    if (timer.mode === 'hyperfocus') {
      const breakDuration = (settings.timer.hyperfocusBreakDuration ?? 17) * 60
      timer.setFromHyperfocus(true)
      timer.setMode('shortBreak', breakDuration)
    } else if (timer.fromHyperfocus) {
      timer.setFromHyperfocus(false)
      timer.setMode('hyperfocus', getDuration('hyperfocus'))
    } else {
      const modes: TimerMode[] = ['pomodoro', 'shortBreak', 'longBreak']
      const currentIdx = modes.indexOf(timer.mode as 'pomodoro' | 'shortBreak' | 'longBreak')
      const nextMode = modes[(currentIdx + 1) % modes.length]
      timer.setMode(nextMode, getDuration(nextMode))
    }
  }, [timer, stopTick, getDuration, settings])

  const switchMode = useCallback(
    (mode: TimerMode) => {
      clearInterval_()
      stopTick()
      ambientMusic.stop()
      timer.setFromHyperfocus(false)
      timer.setMode(mode, getDuration(mode))
    },
    [timer, stopTick, getDuration],
  )

  // Resume a running timer when the page (re)mounts — after navigating
  // away/back, switching windows, or reloading. Recomputes the real elapsed
  // time so the countdown stays accurate and never resets.
  useEffect(() => {
    const s = useTimerStore.getState()
    if (s.status !== 'running') return
    let remaining = s.secondsRemaining
    if (s.startedAt) {
      const elapsed = Math.floor((Date.now() - s.startedAt) / 1000)
      remaining = Math.max(0, s.totalSeconds - elapsed)
      s.setSecondsRemaining(remaining)
    }
    if (remaining > 0) {
      playTick()
      ambientMusic.play()
      startInterval()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      clearInterval_()
      stopTick()
      ambientMusic.stop()
    }
  }, [stopTick])

  const progress =
    timer.totalSeconds > 0 ? (timer.totalSeconds - timer.secondsRemaining) / timer.totalSeconds : 0

  return {
    mode: timer.mode,
    status: timer.status,
    secondsRemaining: timer.secondsRemaining,
    timeDisplay: formatTime(timer.secondsRemaining),
    progress,
    pomodoroCount: timer.pomodoroCount,
    sessionCount: timer.sessionCount,
    activeTaskId: timer.activeTaskId,
    start,
    pause,
    resume,
    reset,
    skip,
    switchMode,
  }
}
