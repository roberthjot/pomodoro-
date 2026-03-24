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
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@config/firebase'
import type { Project, CreateProjectInput } from '@/types'
import { DND_INITIAL_ORDER_STEP } from '@config/constants'

function projectsRef(uid: string) {
  return collection(db, 'users', uid, 'projects')
}

function projectRef(uid: string, projectId: string) {
  return doc(db, 'users', uid, 'projects', projectId)
}

function toProject(id: string, data: Record<string, unknown>): Project {
  return {
    id,
    name: data.name as string,
    color: data.color as string,
    order: (data.order as number) ?? 0,
    createdAt: (data.createdAt as { toDate: () => Date })?.toDate() ?? new Date(),
    updatedAt: (data.updatedAt as { toDate: () => Date })?.toDate() ?? new Date(),
  }
}

export function subscribeToProjects(uid: string, callback: (projects: Project[]) => void): Unsubscribe {
  const q = query(projectsRef(uid), orderBy('order', 'asc'))
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => toProject(d.id, d.data())))
  })
}

export async function createProject(uid: string, input: CreateProjectInput, order: number): Promise<Project> {
  const data = { ...input, order, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }
  const ref = await addDoc(projectsRef(uid), data)
  return { ...input, id: ref.id, order, createdAt: new Date(), updatedAt: new Date() }
}

export async function deleteProject(uid: string, projectId: string): Promise<void> {
  await deleteDoc(projectRef(uid, projectId))
}

export async function updateProject(uid: string, projectId: string, updates: Partial<Pick<Project, 'name' | 'color'>>): Promise<void> {
  await updateDoc(projectRef(uid, projectId), { ...updates, updatedAt: serverTimestamp() })
}

export { DND_INITIAL_ORDER_STEP }
