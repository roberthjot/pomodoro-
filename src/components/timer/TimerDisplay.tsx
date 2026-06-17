import { TimerProgress } from './TimerProgress'
import { getModeAccent, MODE_RING_LABEL } from '@lib/modeAccent'
import type { TimerMode, TimerStatus } from '@/types'

interface TimerDisplayProps {
  timeDisplay: string
  progress: number
  status: TimerStatus
  mode: TimerMode
  size?: number
}

const STATUS_LABEL: Record<TimerStatus, string> = {
  idle: 'listo',
  running: 'en marcha',
  paused: 'en pausa',
  finished: 'completado',
}

export function TimerDisplay({ timeDisplay, progress, status, mode, size = 292 }: TimerDisplayProps) {
  const { a } = getModeAccent(mode)

  return (
    <div className="relative flex items-center justify-center">
      <TimerProgress progress={progress} mode={mode} running={status === 'running'} size={size} />
      <div className="absolute flex flex-col items-center gap-1">
        <span
          className="font-mono font-bold tabular-nums text-neutral-900 dark:text-[#f3f4f7]"
          style={{ fontSize: size >= 280 ? 58 : 50, letterSpacing: '-0.02em', lineHeight: 1 }}
        >
          {timeDisplay}
        </span>
        <span
          className="text-xs font-bold uppercase tracking-[0.1em] mt-1"
          style={{ color: a }}
        >
          {MODE_RING_LABEL[mode]}
        </span>
        <span className="text-xs text-neutral-400 dark:text-[#5d6675]">{STATUS_LABEL[status]}</span>
      </div>
    </div>
  )
}
