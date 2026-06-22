import { useState } from 'react'
import { Plus, X, Folder, Hash } from 'lucide-react'
import { useTasks } from '@hooks/useTasks'
import { useProjects } from '@hooks/useProjects'
import { TaskList } from '@components/tasks/TaskList'
import { TaskForm } from '@components/tasks/TaskForm'
import { TaskFilters } from '@components/tasks/TaskFilters'
import { EmptyTaskState } from '@components/tasks/EmptyTaskState'
import { Button } from '@components/ui/Button'
import { Modal } from '@components/ui/Modal'
import { Input } from '@components/ui/Input'
import { Skeleton } from '@components/ui/Skeleton'
import { ACCENT_COLORS } from '@config/constants'
import { cn } from '@lib/utils'
import type { CreateTaskInput } from '@/types'

function isToday(d: Date | null): boolean {
  if (!d) return false
  const t = new Date()
  return d.getFullYear() === t.getFullYear() && d.getMonth() === t.getMonth() && d.getDate() === t.getDate()
}

export function TasksPage() {
  const { tasks, filteredTasks, activeTask, isLoading, filter, setFilter, createTask, updateTask, deleteTask, reorderTasks, setActiveTask } = useTasks()
  const { projects, createProject, deleteProject } = useProjects()

  const [showForm, setShowForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectColor, setProjectColor] = useState<string>(ACCENT_COLORS[0].value)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

  const pendingCount = tasks.filter((t) => t.status === 'active').length
  const completedTodayCount = tasks.filter((t) => t.status === 'completed' && isToday(t.completedAt)).length
  const countFor = (pid: string | null) =>
    tasks.filter((t) => t.status === 'active' && (pid === null ? true : t.projectId === pid)).length

  const handleCreate = async (input: CreateTaskInput) => {
    await createTask({ ...input, projectId: activeProjectId ?? input.projectId })
  }

  const handleProjectFilter = (projectId: string | null) => {
    setActiveProjectId(projectId)
    setFilter({ projectId })
  }

  const handleCreateProject = async () => {
    if (!projectName.trim()) return
    await createProject({ name: projectName.trim(), color: projectColor })
    setProjectName('')
    setProjectColor(ACCENT_COLORS[0].value)
    setShowProjectForm(false)
  }

  const activeProject = projects.find((p) => p.id === activeProjectId)

  if (isLoading) {
    return (
      <div className="max-w-[920px] mx-auto flex flex-col gap-3 animate-fade-in">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    )
  }

  // Project list item (shared desktop sidebar + mobile chips)
  const ProjectButton = ({ id, color, name, count }: { id: string | null; color?: string; name: string; count: number }) => {
    const selected = activeProjectId === id
    return (
      <button
        onClick={() => handleProjectFilter(id)}
        className={cn(
          'group/p flex items-center gap-2.5 rounded-lg text-sm font-medium transition-all w-full',
          'px-3 py-2',
          selected
            ? 'bg-accent/10 text-accent'
            : 'text-neutral-600 dark:text-[#9aa3b2] hover:bg-neutral-100 dark:hover:bg-[#0f1420]',
        )}
      >
        {color ? (
          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        ) : (
          <Folder size={15} className="shrink-0" />
        )}
        <span className="flex-1 text-left truncate">{name}</span>
        {id !== null && (
          <X
            size={13}
            className="opacity-0 group-hover/p:opacity-100 text-neutral-400 hover:text-red-500 transition-all shrink-0"
            onClick={(e) => { e.stopPropagation(); deleteProject(id); if (activeProjectId === id) handleProjectFilter(null) }}
          />
        )}
        <span className={cn('text-xs font-mono shrink-0', id !== null && 'group-hover/p:hidden', selected ? 'text-accent' : 'text-neutral-400 dark:text-[#5d6675]')}>
          {count}
        </span>
      </button>
    )
  }

  return (
    <div className="max-w-[920px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-[-0.02em] text-neutral-900 dark:text-[#f3f4f7]">Tareas</h1>
          <p className="text-sm text-neutral-400 dark:text-[#5d6675] mt-0.5">
            {pendingCount} {pendingCount === 1 ? 'pendiente' : 'pendientes'} · {completedTodayCount} completadas hoy
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-white font-semibold text-sm transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)', boxShadow: '0 6px 16px #ef444450' }}
        >
          <Plus size={16} /> Nueva
        </button>
      </div>

      <div className="flex gap-6">
        {/* Projects sidebar (desktop) */}
        <aside className="hidden md:flex flex-col gap-1 w-52 shrink-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-[#5d6675] px-3 mb-1">Proyectos</p>
          <ProjectButton id={null} name="Todas" count={countFor(null)} />
          {projects.map((p) => (
            <ProjectButton key={p.id} id={p.id} color={p.color} name={p.name} count={countFor(p.id)} />
          ))}
          <button
            onClick={() => setShowProjectForm(true)}
            className="flex items-center gap-2 px-3 py-2 mt-1 rounded-lg text-sm text-neutral-400 dark:text-[#5d6675] hover:text-accent transition-colors"
          >
            <Plus size={14} /> Nuevo proyecto
          </button>
        </aside>

        {/* Main column */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Mobile project chips */}
          <div className="md:hidden flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
            <button onClick={() => handleProjectFilter(null)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border transition-all', !activeProjectId ? 'border-accent bg-accent/10 text-accent' : 'border-neutral-200 dark:border-[#1f2836] text-neutral-500')}>
              <Folder size={13} /> Todas
            </button>
            {projects.map((p) => (
              <button key={p.id} onClick={() => handleProjectFilter(activeProjectId === p.id ? null : p.id)} className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap border transition-all', activeProjectId === p.id ? 'text-white' : 'text-neutral-600 dark:text-[#9aa3b2] border-neutral-200 dark:border-[#1f2836]')} style={{ borderColor: p.color, backgroundColor: activeProjectId === p.id ? p.color : undefined }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProjectId === p.id ? '#fff' : p.color }} />
                {p.name}
              </button>
            ))}
            <button onClick={() => setShowProjectForm(true)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-neutral-400 border border-dashed border-neutral-300 dark:border-[#2a3645] whitespace-nowrap">
              <Plus size={13} /> Nuevo
            </button>
          </div>

          {/* Current project title (when filtered) */}
          {activeProject && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeProject.color }} />
              <h2 className="text-base font-semibold text-neutral-800 dark:text-[#f3f4f7]">{activeProject.name}</h2>
              <span className="text-sm text-neutral-400">({countFor(activeProject.id)})</span>
            </div>
          )}

          {/* Quick add */}
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-neutral-300 dark:border-[#2a3645] text-neutral-400 dark:text-[#5d6675] hover:border-accent hover:text-accent transition-colors text-left"
          >
            <span className="w-[21px] h-[21px] rounded-md border-2 border-current opacity-60" />
            <span className="text-sm flex-1">Añadir una tarea…</span>
            <Hash size={13} className="opacity-50" />
          </button>

          {/* Filters */}
          <TaskFilters filter={filter} onFilter={setFilter} />

          {/* Task list (flat) */}
          {filteredTasks.length === 0 ? (
            <EmptyTaskState onAdd={() => setShowForm(true)} />
          ) : (
            <TaskList
              tasks={filteredTasks}
              activeTask={activeTask}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onSetActive={setActiveTask}
              onReorder={reorderTasks}
              projects={projects}
            />
          )}
        </div>
      </div>

      {/* New task form */}
      <TaskForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} projects={projects} />

      {/* New project form */}
      <Modal isOpen={showProjectForm} onClose={() => setShowProjectForm(false)} title="Nuevo proyecto" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Nombre del proyecto" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="ej. Trabajo, Personal..." autoFocus />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map(({ value }) => (
                <button
                  key={value}
                  onClick={() => setProjectColor(value)}
                  className={cn('w-7 h-7 rounded-full transition-transform', projectColor === value ? 'scale-125 ring-2 ring-offset-2 ring-neutral-400' : 'hover:scale-110')}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowProjectForm(false)}>Cancelar</Button>
            <Button onClick={handleCreateProject} disabled={!projectName.trim()}>Crear</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
