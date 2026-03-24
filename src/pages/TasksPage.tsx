import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTasks } from '@hooks/useTasks'
import { TaskList } from '@components/tasks/TaskList'
import { TaskForm } from '@components/tasks/TaskForm'
import { TaskFilters } from '@components/tasks/TaskFilters'
import { EmptyTaskState } from '@components/tasks/EmptyTaskState'
import { Button } from '@components/ui/Button'
import { Skeleton } from '@components/ui/Skeleton'
import type { CreateTaskInput } from '@/types'

export function TasksPage() {
  const { filteredTasks, activeTask, isLoading, filter, setFilter, createTask, updateTask, deleteTask, reorderTasks, setActiveTask } = useTasks()
  const [showForm, setShowForm] = useState(false)

  const handleCreate = async (input: CreateTaskInput) => {
    await createTask(input)
  }

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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Tasks</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus size={16} /> New Task
        </Button>
      </div>

      <TaskFilters filter={filter} onFilter={setFilter} />

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
        />
      )}

      <TaskForm isOpen={showForm} onClose={() => setShowForm(false)} onSubmit={handleCreate} />
    </div>
  )
}
