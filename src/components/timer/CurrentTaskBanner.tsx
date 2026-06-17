import { useState } from 'react'
import { CheckSquare, X } from 'lucide-react'
import { Modal } from '@components/ui/Modal'
import { getModeAccent } from '@lib/modeAccent'
import type { Task, TimerMode } from '@/types'

interface Props {
  task: Task | undefined
  tasks: Task[]
  mode: TimerMode
  onSelectTask: (id: string | null) => Promise<void>
}

export function CurrentTaskBanner({ task, tasks, mode, onSelectTask }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const { a } = getModeAccent(mode)
  const activeTasks = tasks.filter((t) => t.status === 'active')

  return (
    <>
      <button
        onClick={() => setShowPicker(true)}
        className="w-full flex items-center gap-3 bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] hover:border-neutral-300 dark:hover:border-[#2a3645] rounded-2xl px-4 py-3 transition-colors text-left shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
      >
        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: task ? a : '#9aa1ad' }} />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-[#5d6675]">
            Tarea actual
          </p>
          <p
            className={`text-sm truncate ${task ? 'font-medium text-neutral-900 dark:text-[#f3f4f7]' : 'text-neutral-400 dark:text-[#5d6675]'}`}
          >
            {task ? task.title : 'Elige una tarea…'}
          </p>
        </div>
        {task ? (
          <>
            <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-[#9aa3b2] shrink-0">
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
            <X
              size={14}
              className="text-neutral-300 dark:text-[#5d6675] hover:text-red-400 shrink-0 transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                onSelectTask(null)
              }}
            />
          </>
        ) : null}
      </button>

      <Modal isOpen={showPicker} onClose={() => setShowPicker(false)} title="Elige una tarea" size="sm">
        {activeTasks.length === 0 ? (
          <p className="text-sm text-neutral-400 text-center py-4">
            No hay tareas activas. Agrega una en la pestaña Tareas.
          </p>
        ) : (
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {activeTasks.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  onSelectTask(t.id)
                  setShowPicker(false)
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  task?.id === t.id
                    ? 'border-accent bg-accent/5 dark:bg-accent/10'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                }`}
              >
                <CheckSquare size={14} className={task?.id === t.id ? 'text-accent' : 'text-neutral-400'} />
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 flex-1 truncate">
                  {t.title}
                </span>
                <span className="text-xs font-mono text-neutral-400 shrink-0">
                  {t.completedPomodoros}/{t.estimatedPomodoros}
                </span>
              </button>
            ))}
          </div>
        )}
      </Modal>
    </>
  )
}
