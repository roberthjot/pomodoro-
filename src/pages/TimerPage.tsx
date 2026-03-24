import { useCallback } from 'react'
import { useTimer } from '@hooks/useTimer'
import { useTasks } from '@hooks/useTasks'
import { useKeyboardShortcuts } from '@hooks/useKeyboardShortcuts'
import { useSettingsStore } from '@stores/settingsStore'
import { TimerDisplay } from '@components/timer/TimerDisplay'
import { TimerControls } from '@components/timer/TimerControls'
import { TimerModeSwitcher } from '@components/timer/TimerModeSwitcher'
import { SessionCounter } from '@components/timer/SessionCounter'
import { CurrentTaskBanner } from '@components/timer/CurrentTaskBanner'
import { ShortcutsHint } from '@components/timer/ShortcutsHint'
import type { TimerMode } from '@/types'

const MODE_NAMES: Record<TimerMode, string> = {
  pomodoro: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
}

export function TimerPage() {
  const timer = useTimer()
  const { tasks, activeTask, setActiveTask } = useTasks()
  const { timer: timerSettings } = useSettingsStore()

  const handlePlayPause = useCallback(() => {
    if (timer.status === 'idle' || timer.status === 'finished') timer.start()
    else if (timer.status === 'running') timer.pause()
    else timer.resume()
  }, [timer])

  const handleSwitchMode = useCallback(
    (num: 1 | 2 | 3) => {
      const modes: TimerMode[] = ['pomodoro', 'shortBreak', 'longBreak']
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
    <div className="flex flex-col items-center gap-6 py-4 animate-fade-in">
      <TimerModeSwitcher mode={timer.mode} onSwitch={timer.switchMode} />

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

      <ShortcutsHint />
    </div>
  )
}
