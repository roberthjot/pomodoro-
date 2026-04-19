import { cn } from '@lib/utils'
import type { TimerMode } from '@/types'

interface Props {
  mode: TimerMode
  onSwitch: (mode: TimerMode) => void
}

const MODES: { value: TimerMode; label: string }[] = [
  { value: 'pomodoro', label: 'Pomodoro' },
  { value: 'shortBreak', label: 'Short Break' },
  { value: 'longBreak', label: 'Long Break' },
  { value: 'hyperfocus', label: '⚡ Hiperfoco' },
]

export function TimerModeSwitcher({ mode, onSwitch }: Props) {
  return (
    <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 gap-1">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onSwitch(m.value)}
          className={cn(
            'flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-all',
            mode === m.value
              ? 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300',
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
