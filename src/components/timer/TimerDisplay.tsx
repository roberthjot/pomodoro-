import { TimerProgress } from './TimerProgress'
import { cn } from '@lib/utils'

interface TimerDisplayProps {
  timeDisplay: string
  progress: number
  status: string
  modeName: string
}

export function TimerDisplay({ timeDisplay, progress, status, modeName }: TimerDisplayProps) {
  return (
    <div className="relative flex items-center justify-center">
      <TimerProgress progress={progress} />
      <div className="absolute flex flex-col items-center gap-1">
        <span
          className={cn(
            'font-mono text-5xl font-bold tabular-nums tracking-tight text-neutral-900 dark:text-neutral-100',
            status === 'running' && 'text-accent',
          )}
        >
          {timeDisplay}
        </span>
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-widest">{modeName}</span>
      </div>
    </div>
  )
}
