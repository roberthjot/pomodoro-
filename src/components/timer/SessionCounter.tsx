import { getModeAccent } from '@lib/modeAccent'
import { cn } from '@lib/utils'
import type { TimerMode } from '@/types'

interface Props {
  count: number
  interval: number
  mode: TimerMode
}

export function SessionCounter({ count, interval, mode }: Props) {
  const { a } = getModeAccent(mode)
  const inCycle = count % interval
  const current = inCycle + 1

  return (
    <div className="flex items-center gap-2.5">
      {Array.from({ length: interval }).map((_, i) => (
        <div
          key={i}
          className={cn('w-2.5 h-2.5 rounded-full transition-all', i >= inCycle && 'bg-neutral-200 dark:bg-[#1c2533]')}
          style={i < inCycle ? { backgroundColor: a } : undefined}
        />
      ))}
      <span className="text-xs text-neutral-400 dark:text-[#5d6675] ml-1.5">
        sesión {current} de {interval}
      </span>
    </div>
  )
}
