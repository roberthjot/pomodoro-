import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '@stores/settingsStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Play, Pencil, Trash2, Check, CalendarClock } from 'lucide-react'
import { cn } from '@lib/utils'
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

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function getDueDateInfo(dueDate: Date | null): { label: string; className: string } | null {
  if (!dueDate) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return { label: 'Atrasada', className: 'text-red-500 bg-red-50 dark:bg-red-500/10' }
  if (diff === 0) return { label: 'Hoy', className: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' }
  if (diff === 1) return { label: 'Mañana', className: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10' }
  return {
    label: due.toLocaleDateString('es', { day: 'numeric', month: 'short' }),
    className: 'text-neutral-400 bg-neutral-100 dark:bg-[#1c2533]',
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

  const completed = task.status === 'completed'
  const handleComplete = async () => {
    await onUpdate(task.id, {
      status: completed ? 'active' : 'completed',
      completedAt: completed ? null : new Date(),
    })
  }

  const dueDateInfo = getDueDateInfo(task.dueDate)
  const project = projects.find((p) => p.id === task.projectId)
  const remaining = task.estimatedPomodoros - task.completedPomodoros
  const timeLabel =
    remaining <= 0 ? 'listo' : `~${formatDuration(remaining * pomodoroDuration)}`

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative flex items-center gap-3 px-4 py-3.5 rounded-2xl border transition-all group',
          isDragging ? 'opacity-50 shadow-lg' : '',
          isActive
            ? 'border-accent/40 bg-accent/[0.06] dark:bg-accent/10'
            : 'border-neutral-200/80 dark:border-[#1f2836] bg-white dark:bg-[#121826]',
          completed && 'opacity-60',
        )}
      >
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-neutral-300 dark:text-[#3a4555] cursor-grab active:cursor-grabbing hover:text-neutral-500 transition-colors shrink-0"
        >
          <GripVertical size={16} />
        </button>

        {/* Checkbox */}
        <button
          onClick={handleComplete}
          className={cn(
            'shrink-0 w-[22px] h-[22px] rounded-[7px] border-2 flex items-center justify-center transition-all',
            completed
              ? 'bg-[#22c55e] border-[#22c55e]'
              : 'border-neutral-300 dark:border-[#3a4555] hover:border-accent',
          )}
        >
          {completed && <Check size={13} className="text-white" strokeWidth={3} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              'text-sm font-medium',
              completed ? 'line-through text-neutral-400 dark:text-[#5d6675]' : 'text-neutral-900 dark:text-[#f3f4f7]',
            )}
          >
            {task.title}
          </p>
          {task.notes && <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-0.5 line-clamp-1">{task.notes}</p>}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            {project && (
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium"
                style={{ color: project.color, backgroundColor: `${project.color}1f` }}
              >
                {project.name}
              </span>
            )}
            {task.tags.map((tag) => (
              <TagBadge key={tag} tag={tag} color={task.tagColors[tag]} />
            ))}

            {/* Pomodoro dots */}
            <div className="flex items-center gap-1">
              {Array.from({ length: task.estimatedPomodoros }).map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    i < task.completedPomodoros ? 'bg-accent' : 'bg-neutral-200 dark:bg-[#1c2533]',
                  )}
                />
              ))}
            </div>
            <span className="text-xs font-mono text-neutral-400 dark:text-[#5d6675]">
              {task.completedPomodoros}/{task.estimatedPomodoros}
            </span>
            <span className="text-xs text-neutral-300 dark:text-[#3a4555]">· {timeLabel}</span>

            {dueDateInfo && (
              <span className={cn('inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-medium', dueDateInfo.className)}>
                <CalendarClock size={10} />
                {dueDateInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* "En curso" pill for active task */}
        {isActive && !completed && (
          <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold text-accent bg-accent/10 group-hover:hidden">
            En curso
          </span>
        )}

        {/* Hover actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button onClick={handlePlay} className="p-1.5 rounded-lg text-neutral-400 hover:text-accent hover:bg-accent/10 transition-colors" title="Iniciar timer con esta tarea">
            <Play size={14} />
          </button>
          <button onClick={() => setShowEdit(true)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 dark:hover:bg-[#1c2533] transition-colors">
            <Pencil size={14} />
          </button>
          <button onClick={() => setShowDelete(true)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <TaskForm key={task.id} isOpen={showEdit} onClose={() => setShowEdit(false)} onSubmit={handleEditSubmit} initialData={task} projects={projects} />
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={async () => { await onDelete(task.id); setShowDelete(false) }}
        title="Eliminar tarea"
        message={`¿Eliminar "${task.title}"? Esto no se puede deshacer.`}
        confirmLabel="Eliminar"
        isDestructive
      />
    </>
  )
}
