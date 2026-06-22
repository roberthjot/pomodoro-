import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '@stores/settingsStore'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Play, Pencil, Trash2, Check } from 'lucide-react'
import { cn } from '@lib/utils'
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
  if (diff < 0) return { label: 'Atrasada', className: 'text-red-500' }
  if (diff === 0) return { label: 'Hoy', className: 'text-orange-500' }
  if (diff === 1) return { label: 'Mañana', className: 'text-yellow-600 dark:text-yellow-500' }
  return {
    label: due.toLocaleDateString('es', { day: 'numeric', month: 'short' }),
    className: 'text-neutral-400 dark:text-[#5d6675]',
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

  const completed = task.status === 'completed'
  const handleComplete = async () => {
    await onUpdate(task.id, {
      status: completed ? 'active' : 'completed',
      completedAt: completed ? null : new Date(),
    })
  }

  const dueDateInfo = getDueDateInfo(task.dueDate)
  const project = projects.find((p) => p.id === task.projectId)
  const pct = task.estimatedPomodoros > 0 ? (task.completedPomodoros / task.estimatedPomodoros) * 100 : 0

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          'relative flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl border transition-all group overflow-hidden',
          isDragging ? 'opacity-50 shadow-lg z-10' : '',
          isActive
            ? 'border-accent/40 bg-accent/[0.05] dark:bg-accent/10'
            : 'border-neutral-200/70 dark:border-[#1f2836] bg-white dark:bg-[#121826] hover:border-neutral-300 dark:hover:border-[#2a3645]',
          completed && 'opacity-55',
        )}
      >
        {/* Project color accent bar */}
        {project && <span className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: project.color }} />}

        {/* Drag handle — only on hover */}
        <button
          {...attributes}
          {...listeners}
          className="text-neutral-300 dark:text-[#3a4555] cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity shrink-0 -ml-1"
        >
          <GripVertical size={15} />
        </button>

        {/* Checkbox */}
        <button
          onClick={handleComplete}
          className={cn(
            'shrink-0 w-[21px] h-[21px] rounded-md border-2 flex items-center justify-center transition-all',
            completed ? 'bg-[#22c55e] border-[#22c55e]' : 'border-neutral-300 dark:border-[#3a4555] hover:border-accent',
          )}
        >
          {completed && <Check size={12} className="text-white" strokeWidth={3} />}
        </button>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <p className={cn('text-sm font-medium truncate', completed ? 'line-through text-neutral-400 dark:text-[#5d6675]' : 'text-neutral-900 dark:text-[#f3f4f7]')}>
            {task.title}
          </p>
          <div className="flex items-center gap-2 mt-1 text-xs text-neutral-400 dark:text-[#5d6675]">
            {project && (
              <span className="flex items-center gap-1 min-w-0">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
                <span className="truncate" style={{ color: project.color }}>{project.name}</span>
              </span>
            )}
            {project && (task.dueDate || task.estimatedPomodoros > 0) && <span className="text-neutral-300 dark:text-[#2a3645]">·</span>}
            <span className="font-mono shrink-0">~{Math.round((task.estimatedPomodoros - task.completedPomodoros) * pomodoroDuration)}min</span>
            {dueDateInfo && (
              <>
                <span className="text-neutral-300 dark:text-[#2a3645]">·</span>
                <span className={cn('shrink-0 font-medium', dueDateInfo.className)}>{dueDateInfo.label}</span>
              </>
            )}
          </div>
        </div>

        {/* Progress (compact) */}
        <div className="hidden sm:flex flex-col items-end gap-1 shrink-0 w-16">
          <span className="text-xs font-mono text-neutral-500 dark:text-[#9aa3b2]">
            {task.completedPomodoros}/{task.estimatedPomodoros}
          </span>
          <div className="w-full h-1 rounded-full bg-neutral-100 dark:bg-[#1c2533] overflow-hidden">
            <div className="h-full rounded-full bg-accent transition-[width] duration-300" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Right: active pill (default) / actions (hover) */}
        <div className="shrink-0 flex items-center justify-end" style={{ minWidth: 92 }}>
          {isActive && !completed && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-accent bg-accent/10 group-hover:hidden">
              En curso
            </span>
          )}
          <div className={cn('items-center gap-0.5 hidden group-hover:flex', !isActive && 'flex')}>
            <button onClick={handlePlay} className="p-1.5 rounded-lg text-neutral-400 hover:text-accent hover:bg-accent/10 transition-colors" title="Iniciar timer con esta tarea">
              <Play size={14} />
            </button>
            <button onClick={() => setShowEdit(true)} className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-[#f3f4f7] hover:bg-neutral-100 dark:hover:bg-[#1c2533] transition-colors">
              <Pencil size={14} />
            </button>
            <button onClick={() => setShowDelete(true)} className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      <TaskForm key={task.id} isOpen={showEdit} onClose={() => setShowEdit(false)} onSubmit={async (input: CreateTaskInput) => { await onUpdate(task.id, { ...input }) }} initialData={task} projects={projects} />
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
