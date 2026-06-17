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
import { DailyFocusModal } from '@components/timer/DailyFocusModal'
import { DailyFocusPanel } from '@components/timer/DailyFocusPanel'
import { DayZoneIndicator } from '@components/timer/DayZoneIndicator'
import { TodayRail } from '@components/timer/TodayRail'
import type { TimerMode } from '@/types'

export function TimerPage() {
  const timer = useTimer()
  const { tasks, activeTask, setActiveTask } = useTasks()
  const { timer: timerSettings } = useSettingsStore()
  const { isNewDay } = useDailyFocusStore()
  const [showDailyModal, setShowDailyModal] = useState(false)

  useEffect(() => {
    if (isNewDay()) {
      const t = setTimeout(() => setShowDailyModal(true), 600)
      return () => clearTimeout(t)
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
    <div className="flex justify-center gap-10 animate-fade-in">
      {/* Center column */}
      <div className="flex flex-col items-center gap-5 w-full max-w-md">
        <TimerModeSwitcher mode={timer.mode} onSwitch={timer.switchMode} />

        <DayZoneIndicator />

        <TimerDisplay
          timeDisplay={timer.timeDisplay}
          progress={timer.progress}
          status={timer.status}
          mode={timer.mode}
        />

        <SessionCounter
          count={timer.pomodoroCount}
          interval={timerSettings.longBreakInterval}
          mode={timer.mode}
        />

        <div className="w-full max-w-sm">
          <CurrentTaskBanner
            task={activeTask}
            tasks={tasks}
            mode={timer.mode}
            onSelectTask={setActiveTask}
          />
        </div>

        <TimerControls
          status={timer.status}
          mode={timer.mode}
          onStart={timer.start}
          onPause={timer.pause}
          onResume={timer.resume}
          onReset={timer.reset}
          onSkip={timer.skip}
        />

        <DailyFocusPanel onReset={() => setShowDailyModal(true)} />
      </div>

      {/* Right rail (desktop) */}
      <div className="hidden xl:block pt-1">
        <TodayRail mode={timer.mode} />
      </div>

      <DailyFocusModal isOpen={showDailyModal} onClose={() => setShowDailyModal(false)} />
    </div>
  )
}
