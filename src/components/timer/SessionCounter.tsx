import { cn } from '@lib/utils'

interface Props {
  count: number
  interval: number
}

export function SessionCounter({ count, interval }: Props) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: interval }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'w-2.5 h-2.5 rounded-full transition-all',
            i < (count % interval) ? 'bg-accent' : 'bg-neutral-200 dark:bg-neutral-700',
          )}
        />
      ))}
      <span className="text-xs text-neutral-400 ml-1">
        Session {count + 1}
      </span>
    </div>
  )
}
