import { create } from 'zustand'
import type { Task, TaskStatus } from '@/types'

interface TaskFilter {
  status: 'all' | TaskStatus
  tags: string[]
  searchQuery: string
}

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  error: string | null
  filter: TaskFilter
}

interface TaskActions {
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  reorderTasks: (tasks: Task[]) => void
  incrementCompleted: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setFilter: (filter: Partial<TaskFilter>) => void
  // Selector — not stored, derived on call
  getFilteredTasks: () => Task[]
  getActiveTask: () => Task | undefined
}

export const useTaskStore = create<TaskState & TaskActions>((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,
  filter: { status: 'all', tags: [], searchQuery: '' },

  setTasks: (tasks) => set({ tasks }),

  addTask: (task) => set((s) => ({ tasks: [...s.tasks, task] })),

  updateTask: (id, updates) =>
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t)),
    })),

  deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

  reorderTasks: (tasks) => set({ tasks }),

  incrementCompleted: (id) =>
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === id ? { ...t, completedPomodoros: t.completedPomodoros + 1, updatedAt: new Date() } : t,
      ),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  setFilter: (filter) => set((s) => ({ filter: { ...s.filter, ...filter } })),

  getFilteredTasks: () => {
    const { tasks, filter } = get()
    return tasks
      .filter((t) => {
        if (filter.status !== 'all' && t.status !== filter.status) return false
        if (filter.tags.length > 0 && !filter.tags.some((tag) => t.tags.includes(tag))) return false
        if (filter.searchQuery && !t.title.toLowerCase().includes(filter.searchQuery.toLowerCase()))
          return false
        return true
      })
      .sort((a, b) => a.order - b.order)
  },

  getActiveTask: () => {
    const { tasks } = get()
    return tasks.find((t) => t.isActiveTask)
  },
}))
