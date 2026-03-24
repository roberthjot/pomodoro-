import { Flame } from 'lucide-react'

interface Props {
  current: number
  longest: number
}

export function StreakDisplay({ current, longest }: Props) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Streak</span>
        <Flame size={16} className="text-orange-400" />
      </div>
      <div className="flex items-end gap-3">
        <div>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">{current}</span>
          <span className="text-xs text-neutral-400 ml-1">days</span>
        </div>
        <div className="pb-0.5">
          <span className="text-xs text-neutral-400">Best: {longest}d</span>
        </div>
      </div>
    </div>
  )
}
