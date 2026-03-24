export type TaskStatus = 'active' | 'completed' | 'archived'

export interface Task {
  id: string
  title: string
  notes: string
  status: TaskStatus
  estimatedPomodoros: number
  completedPomodoros: number
  tags: string[]
  tagColors: Record<string, string>
  order: number
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  isActiveTask: boolean
}

export type CreateTaskInput = Pick<Task, 'title' | 'notes' | 'estimatedPomodoros' | 'tags' | 'tagColors'>
export type UpdateTaskInput = Partial<Omit<Task, 'id' | 'createdAt'>>
