import { useState, useMemo } from 'react'
import { Plus, X, FolderOpen } from 'lucide-react'
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
import type { CreateTaskInput, Project } from '@/types'

export function TasksPage() {
  const { filteredTasks, activeTask, isLoading, filter, setFilter, createTask, updateTask, deleteTask, reorderTasks, setActiveTask } = useTasks()
  const { projects, createProject, deleteProject } = useProjects()

  const [showForm, setShowForm] = useState(false)
  const [showProjectForm, setShowProjectForm] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectColor, setProjectColor] = useState<string>(ACCENT_COLORS[0].value)
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)

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

  // Group tasks by project when no project filter is active
  const grouped = useMemo(() => {
    if (activeProjectId) return null
    const groups: { project: Project | null; tasks: typeof filteredTasks }[] = []

    projects.forEach((proj) => {
      const pts = filteredTasks.filter((t) => t.projectId === proj.id)
      if (pts.length > 0) groups.push({ project: proj, tasks: pts })
    })

    const unassigned = filteredTasks.filter((t) => !t.projectId || !projects.find((p) => p.id === t.projectId))
    if (unassigned.length > 0) groups.push({ project: null, tasks: unassigned })

    return groups
  }, [filteredTasks, projects, activeProjectId])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 animate-fade-in">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-full" />
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Tasks</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Task
        </Button>
      </div>

      {/* Projects bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => handleProjectFilter(null)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border transition-all',
            !activeProjectId
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400',
          )}
        >
          <FolderOpen size={13} /> All
        </button>

        {projects.map((p) => (
          <div key={p.id} className="relative group/proj">
            <button
              onClick={() => handleProjectFilter(activeProjectId === p.id ? null : p.id)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-lg text-sm font-medium border transition-all pr-6',
                activeProjectId === p.id ? 'text-white' : 'text-neutral-700 dark:text-neutral-300',
              )}
              style={{
                borderColor: p.color,
                backgroundColor: activeProjectId === p.id ? p.color : 'transparent',
              }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
              {p.name}
            </button>
            <button
              onClick={() => { deleteProject(p.id); if (activeProjectId === p.id) handleProjectFilter(null) }}
              className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded opacity-0 group-hover/proj:opacity-100 transition-opacity text-neutral-400 hover:text-red-500"
            >
              <X size={11} />
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowProjectForm(true)}
          className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs text-neutral-400 hover:text-accent border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-accent transition-all"
        >
          <Plus size={11} /> Add project
        </button>
      </div>

      {/* Filters */}
      <TaskFilters filter={filter} onFilter={setFilter} />

      {/* Task list */}
      {filteredTasks.length === 0 ? (
        <EmptyTaskState onAdd={() => setShowForm(true)} />
      ) : grouped ? (
        // Grouped by project
        <div className="flex flex-col gap-5">
          {grouped.map(({ project, tasks }) => (
            <div key={project?.id ?? 'unassigned'} className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {project ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                    <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">{project.name}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                    <span className="text-sm font-semibold text-neutral-500">No project</span>
                  </>
                )}
                <span className="text-xs text-neutral-400">({tasks.length})</span>
              </div>
              <TaskList
                tasks={tasks}
                activeTask={activeTask}
                onUpdate={updateTask}
                onDelete={deleteTask}
                onSetActive={setActiveTask}
                onReorder={reorderTasks}
                projects={projects}
              />
            </div>
          ))}
        </div>
      ) : (
        // Flat list when project filter active
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

      {/* New task form */}
      <TaskForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} projects={projects} />

      {/* New project form */}
      <Modal isOpen={showProjectForm} onClose={() => setShowProjectForm(false)} title="New project" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g. Work, Personal..." autoFocus />
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Color</label>
            <div className="flex flex-wrap gap-2">
              {ACCENT_COLORS.map(({ value }) => (
                <button
                  key={value}
                  onClick={() => setProjectColor(value)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-transform',
                    projectColor === value ? 'scale-125 ring-2 ring-offset-2 ring-neutral-400' : 'hover:scale-110',
                  )}
                  style={{ backgroundColor: value }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowProjectForm(false)}>Cancel</Button>
            <Button onClick={handleCreateProject} disabled={!projectName.trim()}>Create</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
