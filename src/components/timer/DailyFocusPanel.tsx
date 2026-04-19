import { CheckCircle2, Circle, RefreshCw } from 'lucide-react'
import { useDailyFocusStore } from '@stores/dailyFocusStore'
import { cn } from '@lib/utils'

interface Props {
  onReset: () => void
}

export function DailyFocusPanel({ onReset }: Props) {
  const { tasks, checked, toggleCheck } = useDailyFocusStore()

  const activeTasks = tasks.filter((t) => t.trim())
  if (activeTasks.length === 0) return null

  const allDone = tasks.every((t, i) => !t.trim() || checked[i])

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          🎯 Top 3 del día
        </p>
        <button
          onClick={onReset}
          className="text-neutral-400 hover:text-accent transition-colors p-0.5 rounded"
          title="Cambiar tareas"
        >
          <RefreshCw size={12} />
        </button>
      </div>

      <div className="flex flex-col gap-1.5">
        {tasks.map((task, i) => {
          if (!task.trim()) return null
          const isChecked = checked[i as 0 | 1 | 2]
          return (
            <button
              key={i}
              onClick={() => toggleCheck(i as 0 | 1 | 2)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left w-full transition-all',
                'bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200 dark:hover:bg-neutral-700',
                isChecked && 'opacity-50',
              )}
            >
              {isChecked ? (
                <CheckCircle2 size={15} className="text-accent shrink-0" />
              ) : (
                <Circle size={15} className="text-neutral-400 shrink-0" />
              )}
              <span className={cn('flex-1 text-neutral-800 dark:text-neutral-200', isChecked && 'line-through text-neutral-400')}>
                {task}
              </span>
            </button>
          )
        })}
      </div>

      {allDone && (
        <p className="text-xs text-center text-accent mt-2 font-medium">
          ✅ ¡Completaste tus 3 tareas del día!
        </p>
      )}
    </div>
  )
}
