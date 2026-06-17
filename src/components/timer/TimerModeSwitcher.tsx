import { Zap } from 'lucide-react'
import { cn } from '@lib/utils'
import { getModeAccent } from '@lib/modeAccent'
import type { TimerMode } from '@/types'

interface Props {
  mode: TimerMode
  onSwitch: (mode: TimerMode) => void
}

const MODES: { value: TimerMode; label: string; icon?: boolean }[] = [
  { value: 'pomodoro', label: 'Pomodoro' },
  { value: 'shortBreak', label: 'Descanso' },
  { value: 'longBreak', label: 'D. largo' },
  { value: 'hyperfocus', label: 'Hiperfoco', icon: true },
]

export function TimerModeSwitcher({ mode, onSwitch }: Props) {
  return (
    <div className="inline-flex bg-neutral-100 dark:bg-[#0f1420] rounded-[13px] p-[5px] gap-1">
      {MODES.map((m) => {
        const active = mode === m.value
        return (
          <button
            key={m.value}
            onClick={() => onSwitch(m.value)}
            className={cn(
              'flex items-center gap-1.5 py-2 px-3.5 rounded-[9px] text-sm font-medium transition-all whitespace-nowrap',
              active
                ? 'bg-white dark:bg-[#121826] shadow-[0_1px_3px_rgba(17,24,39,0.08)] text-neutral-900 dark:text-[#f3f4f7]'
                : 'text-neutral-500 dark:text-[#9aa3b2] hover:text-neutral-700 dark:hover:text-[#f3f4f7]',
            )}
          >
            {m.icon && (
              <Zap
                size={13}
                style={{ color: getModeAccent('hyperfocus').a }}
                fill={getModeAccent('hyperfocus').a}
              />
            )}
            {m.label}
          </button>
        )
      })}
    </div>
  )
}
