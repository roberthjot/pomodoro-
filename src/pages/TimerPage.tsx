import { useCallback, useEffect, useState } from 'react'
import { useTimer } from '@hooks/useTimer'
import { useTasks } from '@hooks/useTasks'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
import { useSettingsStore } from '@stores/settingsStore'
import { useDailyFocusStore } from '@stores/dailyFocusStore'
import { TimerDisplay } from '@components/timer/TimerDisplay'
import { TimerControls } from '@components/timer/TimerControls'
import { TimerModeSwitcher } from '@components/timer/TimerModeSwitcher'
import { SessionCounter } from '@components/timer/SessionCounter'
import { CurrentTaskBanner } from '@components/timer/CurrentTaskBanner'
import { ShortcutsHint } from '@components/timer/ShortcutsHint'
import { DailyFocusModal } from '@components/timer/DailyFocusModal'
import { DailyFocusPanel } from '@components/timer/DailyFocusPanel'
import { DayZoneIndicator } from '@components/timer/DayZoneIndicator'
import type { TimerMode } from '@/types'

const MODE_NAMES: Record<TimerMode, string> = {
  pomodoro: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
  hyperfocus: 'Hiperfoco',
}

export function TimerPage() {
  const timer = useTimer()
  const { tasks, activeTask, setActiveTask } = useTasks()
  const { timer: timerSettings } = useSettingsStore()
  const { isNewDay } = useDailyFocusStore()
  const [showDailyModal, setShowDailyModal] = useState(false)

  // Show daily focus modal once per day on first visit
  useEffect(() => {
    if (isNewDay()) {
      const timeout = setTimeout(() => setShowDailyModal(true), 600)
      return () => clearTimeout(timeout)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handlePlayPause = useCallback(() => {
    if (timer.status === 'idle' || timer.status === 'finished') timer.start()
    else if (timer.status === 'running') timer.pause()
    else timer.resume()
  }, [timer])

  const handleSwitchMode = useCallback(
    (num: 1 | 2 | 3 | 4) => {
      const modes: TimerMode[] = ['pomodoro', 'shortBreak', 'longBreak', 'hyperfocus']
      timer.switchMode(modes[num - 1])
    },
    [timer],
  )

  useKeyboardShortcuts({
    onPlayPause: handlePlayPause,
    onReset: timer.reset,
    onSkip: timer.skip,
    onSwitchMode: handleSwitchMode,
  })

  return (
    <div className="flex flex-col items-center gap-5 py-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <TimerModeSwitcher mode={timer.mode} onSwitch={timer.switchMode} />
      </div>

      <DayZoneIndicator />

      <TimerDisplay
        timeDisplay={timer.timeDisplay}
        progress={timer.progress}
        status={timer.status}
        modeName={MODE_NAMES[timer.mode]}
      />

      <SessionCounter
        count={timer.pomodoroCount}
        interval={timerSettings.longBreakInterval}
      />

      <div className="w-full max-w-sm">
        <CurrentTaskBanner task={activeTask} tasks={tasks} onSelectTask={setActiveTask} />
      </div>

      <TimerControls
        status={timer.status}
        onStart={timer.start}
        onPause={timer.pause}
        onResume={timer.resume}
        onReset={timer.reset}
        onSkip={timer.skip}
      />

      <DailyFocusPanel onReset={() => setShowDailyModal(true)} />

      <ShortcutsHint />

      <DailyFocusModal
        isOpen={showDailyModal}
        onClose={() => setShowDailyModal(false)}
      />
    </div>
  )
}
