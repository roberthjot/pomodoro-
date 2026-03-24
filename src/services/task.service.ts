import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@config/firebase'
import type { Task, CreateTaskInput, UpdateTaskInput } from '@/types'
import { DND_INITIAL_ORDER_STEP } from '@config/constants'

function tasksRef(uid: string) {
  return collection(db, 'users', uid, 'tasks')
}

function taskRef(uid: string, taskId: string) {
  return doc(db, 'users', uid, 'tasks', taskId)
}

function toTask(id: string, data: Record<string, unknown>): Task {
  return {
    id,
    title: data.title as string,
    notes: (data.notes as string) ?? '',
    status: data.status as Task['status'],
    estimatedPomodoros: data.estimatedPomodoros as number,
    completedPomodoros: data.completedPomodoros as number,
    tags: (data.tags as string[]) ?? [],
    tagColors: (data.tagColors as Record<string, string>) ?? {},
    order: data.order as number,
    createdAt: (data.createdAt as { toDate: () => Date })?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as { toDate: () => Date })?.toDate() ?? new Date(),
    completedAt: (data.completedAt as { toDate: () => Date } | null)?.toDate() ?? null,
    isActiveTask: (data.isActiveTask as boolean) ?? false,
    projectId: (data.projectId as string | null) ?? null,
    dueDate: (data.dueDate as { toDate: () => Date } | null)?.toDate() ?? null,
  }
}

export function subscribeToTasks(uid: string, callback: (tasks: Task[]) => void): Unsubscribe {
  const q = query(tasksRef(uid), orderBy('order', 'asc'))
  return onSnapshot(q, (snap) => {
    const tasks = snap.docs.map((d) => toTask(d.id, d.data()))
    callback(tasks)
  })
}

export async function createTask(uid: string, input: CreateTaskInput, order: number): Promise<Task> {
  const data = {
    ...input,
    status: 'active' as const,
    completedPomodoros: 0,
    order,
    isActiveTask: false,
    completedAt: null,
    projectId: input.projectId ?? null,
    dueDate: input.dueDate ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  const ref = await addDoc(tasksRef(uid), data)
  return { ...data, id: ref.id, createdAt: new Date(), updatedAt: new Date() }
}

export async function updateTask(uid: string, taskId: string, updates: UpdateTaskInput): Promise<void> {
  await updateDoc(taskRef(uid, taskId), { ...updates, updatedAt: serverTimestamp() })
}

export async function deleteTask(uid: string, taskId: string): Promise<void> {
  await deleteDoc(taskRef(uid, taskId))
}

export async function reorderTasks(
  uid: string,
  tasks: Array<{ id: string; order: number }>,
): Promise<void> {
  const batch = writeBatch(db)
  tasks.forEach(({ id, order }) => {
    batch.update(taskRef(uid, id), { order, updatedAt: serverTimestamp() })
  })
  await batch.commit()
}

export async function reindexTasks(uid: string, taskIds: string[]): Promise<void> {
  const batch = writeBatch(db)
  taskIds.forEach((id, i) => {
    batch.update(taskRef(uid, id), {
      order: (i + 1) * DND_INITIAL_ORDER_STEP,
      updatedAt: serverTimestamp(),
    })
  })
  await batch.commit()
}

export async function setActiveTask(uid: string, taskId: string | null, currentActiveId: string | null): Promise<void> {
  const batch = writeBatch(db)
  if (currentActiveId && currentActiveId !== taskId) {
    batch.update(taskRef(uid, currentActiveId), { isActiveTask: false })
  }
  if (taskId) {
    batch.update(taskRef(uid, taskId), { isActiveTask: true })
  }
  await batch.commit()
}
