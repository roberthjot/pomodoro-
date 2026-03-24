import { useEffect, useCallback } from 'react'
import { useTaskStore } from '@stores/taskStore'
import { useAuthStore } from '@stores/authStore'
import * as taskService from '@services/task.service'
import type { CreateTaskInput, UpdateTaskInput } from '@/types'
import { DND_REINDEX_THRESHOLD, DND_INITIAL_ORDER_STEP } from '@config/constants'

export function useTasks() {
  const store = useTaskStore()
  const { user } = useAuthStore()

  // Real-time Firestore listener
  useEffect(() => {
    if (!user) return
    store.setLoading(true)
    const unsub = taskService.subscribeToTasks(user.uid, (tasks) => {
      store.setTasks(tasks)
      store.setLoading(false)
    })
    return unsub
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  const createTask = useCallback(
    async (input: CreateTaskInput) => {
      if (!user) return
      const tasks = store.tasks
      const maxOrder = tasks.length > 0 ? Math.max(...tasks.map((t) => t.order)) : 0
      const order = maxOrder + DND_INITIAL_ORDER_STEP
      const task = await taskService.createTask(user.uid, input, order)
      store.addTask(task)
    },
    [user, store],
  )

  const updateTask = useCallback(
    async (id: string, updates: UpdateTaskInput) => {
      if (!user) return
      store.updateTask(id, updates)
      await taskService.updateTask(user.uid, id, updates)
    },
    [user, store],
  )

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return
      store.deleteTask(id)
      await taskService.deleteTask(user.uid, id)
    },
    [user, store],
  )

  const reorderTasks = useCallback(
    async (sourceIndex: number, destinationIndex: number) => {
      if (!user) return
      const tasks = [...store.getFilteredTasks()]
      const [moved] = tasks.splice(sourceIndex, 1)
      tasks.splice(destinationIndex, 0, moved)

      const prev = tasks[destinationIndex - 1]?.order ?? 0
      const next = tasks[destinationIndex + 1]?.order ?? (prev + DND_INITIAL_ORDER_STEP * 2)
      const newOrder = (prev + next) / 2

      // Trigger reindex if precision is too low
      if (Math.abs(next - prev) < DND_REINDEX_THRESHOLD) {
        const ids = tasks.map((t) => t.id)
        await taskService.reindexTasks(user.uid, ids)
        return
      }

      const updated = tasks.map((t, i) =>
        i === destinationIndex ? { ...t, order: newOrder } : t,
      )
      store.reorderTasks(updated)
      await taskService.reorderTasks(user.uid, [{ id: moved.id, order: newOrder }])
    },
    [user, store],
  )

  const setActiveTask = useCallback(
    async (taskId: string | null) => {
      if (!user) return
      const currentActive = store.getActiveTask()
      // Optimistic update
      if (currentActive) store.updateTask(currentActive.id, { isActiveTask: false })
      if (taskId) store.updateTask(taskId, { isActiveTask: true })
      await taskService.setActiveTask(user.uid, taskId, currentActive?.id ?? null)
    },
    [user, store],
  )

  return {
    tasks: store.tasks,
    filteredTasks: store.getFilteredTasks(),
    activeTask: store.getActiveTask(),
    isLoading: store.isLoading,
    filter: store.filter,
    setFilter: store.setFilter,
    createTask,
    updateTask,
    deleteTask,
    reorderTasks,
    setActiveTask,
  }
}
