import { useState } from 'react'
import { CheckSquare, ChevronDown, X } from 'lucide-react'
import { Modal } from '@components/ui/Modal'
import type { Task } from '@/types'

interface Props {
  task: Task | undefined
  tasks: Task[]
  onSelectTask: (id: string | null) => Promise<void>
}

export function CurrentTaskBanner({ task, tasks, onSelectTask }: Props) {
  const [showPicker, setShowPicker] = useState(false)

  const activeTasks = tasks.filter((t) => t.status === 'active')

  return (
    <>
      <button
        onClick={() => setShowPicker(true)}
        className="w-full flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl px-4 py-2 transition-colors"
      >
        <CheckSquare size={14} className={task ? 'text-accent' : 'text-neutral-400'} />
        <span className={`text-sm flex-1 text-left truncate ${task ? 'font-medium text-neutral-700 dark:text-neutral-300' : 'text-neutral-400'}`}>
          {task ? task.title : 'No task selected — click to pick one'}
        </span>
        {task ? (
          <>
            <span className="text-xs text-neutral-400 shrink-0">
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
            <X
              size={14}
              className="text-neutral-400 hover:text-red-400 shrink-0 transition-colors"
              onClick={(e) => { e.stopPropagation(); onSelectTask(null) }}
            />
          </>
        ) : (
          <ChevronDown size={14} className="text-neutral-400 shrink-0" />
        )}
      </button>

      <Modal isOpen={showPicker} onClose={() => setShowPicker(false)} title="Select task" size="sm">
        {activeTasks.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-4">No active tasks. Add one in the Tasks tab.</p>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {activeTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => { onSelectTask(t.id); setShowPicker(false) }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  task?.id === t.id
                    ? 'border-accent bg-accent/5 dark:bg-accent/10'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                <CheckSquare size={14} className={task?.id === t.id ? 'text-accent' : 'text-neutral-400'} />
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 flex-1 truncate">{t.title}</span>
                <span className="text-xs text-neutral-400 shrink-0">🍅 {t.completedPomodoros}/{t.estimatedPomodoros}</span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}
