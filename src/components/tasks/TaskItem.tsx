import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Play, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react'
import { cn } from '@lib/utils'
import { PomodoroCounter } from './PomodoroCounter'
import { TagBadge } from './TagBadge'
import { ConfirmDialog } from '@components/ui/ConfirmDialog'
import type { Task, CreateTaskInput } from '@/types'
import { TaskForm } from './TaskForm'

interface Props {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onSetActive: (id: string | null) => Promise<void>
  isActive: boolean
}

export function TaskItem({ task, onUpdate, onDelete, onSetActive, isActive }: Props) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const navigate = useNavigate()

  const handlePlay = async () => {
    if (!isActive) await onSetActive(task.id)
    navigate('/')
  }

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = { transform: CSS.Transform.toString(transform), transition }

  const handleEditSubmit = async (input: CreateTaskInput) => {
    await onUpdate(task.id, { ...input })
  }

  const handleComplete = async () => {
    await onUpdate(task.id, {
      status: task.status === 'completed' ? 'active' : 'completed',
      completedAt: task.status === 'completed' ? null : new Date(),
    })
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'flex items-start gap-3 p-3 rounded-xl border bg-white dark:bg-neutral-900 transition-all group',
          isDragging ? 'opacity-50 shadow-lg' : '',
          isActive ? 'border-accent/50 bg-accent/5 dark:bg-accent/10' : 'border-neutral-200 dark:border-neutral-800',
          task.status === 'completed' && 'opacity-60',
        )}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 text-neutral-300 dark:text-neutral-600 cursor-grab active:cursor-grabbing hover:text-neutral-500 transition-colors"
        >
          <GripVertical size={16} />
        </button>

        {/* Complete toggle */}
        <button onClick={handleComplete} className="mt-0.5 text-neutral-400 hover:text-accent transition-colors shrink-0">
          {task.status === 'completed' ? <CheckCircle2 size={18} className="text-accent" /> : <Circle size={18} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium text-neutral-900 dark:text-neutral-100', task.status === 'completed' && 'line-through text-neutral-400')}>
            {task.title}
          </p>
          {task.notes && (
            <p className="text-xs text-neutral-400 mt-0.5 line-clamp-1">{task.notes}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <PomodoroCounter completed={task.completedPomodoros} estimated={task.estimatedPomodoros} />
            {task.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} color={task.tagColors[tag]} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePlay}
            className="p-1.5 rounded-lg transition-colors text-neutral-400 hover:text-accent hover:bg-accent/10"
            title="Start timer with this task"
          >
            <Play size={14} />
          </button>
          <button
            onClick={() => setShowEdit(true)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => setShowDelete(true)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <TaskForm isOpen={showEdit} onClose={() => setShowEdit(false)} onSubmit={handleEditSubmit} initialData={task} />
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={async () => { await onDelete(task.id); setShowDelete(false) }}
        title="Delete task"
        message={`Delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDestructive
      />
    </>
  )
}
