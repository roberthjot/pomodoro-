import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '@stores/settingsStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Play, Pencil, Trash2, CheckCircle2, Circle, CalendarClock } from 'lucide-react'
import { cn } from '@lib/utils'
import { PomodoroCounter } from './PomodoroCounter'
import { TagBadge } from './TagBadge'
import { ConfirmDialog } from '@components/ui/ConfirmDialog'
import type { Task, CreateTaskInput, Project } from '@/types'
import { TaskForm } from './TaskForm'

interface Props {
  task: Task
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onSetActive: (id: string | null) => Promise<void>
  isActive: boolean
  projects: Project[]
}

function getDueDateInfo(dueDate: Date | null): { label: string; className: string } | null {
  if (!dueDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Overdue', className: 'text-red-500 bg-red-50 dark:bg-red-500/10' }
  if (diff === 0) return { label: 'Today', className: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' }
  if (diff === 1) return { label: 'Tomorrow', className: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10' }
  return {
    label: due.toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    className: 'text-neutral-400 bg-neutral-100 dark:bg-neutral-800',
  }
}

export function TaskItem({ task, onUpdate, onDelete, onSetActive, isActive, projects }: Props) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const navigate = useNavigate()
  const pomodoroDuration = useSettingsStore((s) => s.timer.pomodoroDuration) ?? 25

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

  const dueDateInfo = getDueDateInfo(task.dueDate)
  const project = projects.find((p) => p.id === task.projectId)

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative flex items-start gap-3 p-3 rounded-xl border bg-white dark:bg-neutral-900 transition-all group overflow-hidden',
          isDragging ? 'opacity-50 shadow-lg' : '',
          isActive ? 'border-accent/50 bg-accent/5 dark:bg-accent/10' : 'border-neutral-200 dark:border-neutral-800',
          task.status === 'completed' && 'opacity-60',
        )}
      >
        {/* Project color bar */}
        {project && (
          <div className="absolute left-0 top-0 bottom-0 w-1 rounded-none" style={{ backgroundColor: project.color }} />
        )}

        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className={cn('mt-0.5 text-neutral-300 dark:text-neutral-600 cursor-grab active:cursor-grabbing hover:text-neutral-500 transition-colors', project && 'ml-1')}
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
            <PomodoroCounter completed={task.completedPomodoros} estimated={task.estimatedPomodoros} minutesPerPomodoro={pomodoroDuration} />
            {dueDateInfo && (
              <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium', dueDateInfo.className)}>
                <CalendarClock size={10} />
                {dueDateInfo.label}
              </span>
            )}
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

      <TaskForm key={task.id} isOpen={showEdit} onClose={() => setShowEdit(false)} onSubmit={handleEditSubmit} initialData={task} projects={projects} />
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
