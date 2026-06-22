import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '@config/firebase'
import type { PomodoroSession, DailyStats } from '@/types'
import { todayKey } from '@lib/dateUtils'

function sessionsRef(uid: string) {
  return collection(db, 'users', uid, 'sessions')
}

function dailyStatsRef(uid: string) {
  return collection(db, 'users', uid, 'dailyStats')
}

function dailyStatDoc(uid: string, dateKey: string) {
  return doc(db, 'users', uid, 'dailyStats', dateKey)
}

export async function recordSession(
  uid: string,
  session: Omit<PomodoroSession, 'id'>,
): Promise<string> {
  const ref = await addDoc(sessionsRef(uid), {
    ...session,
    startedAt: session.startedAt,
    completedAt: session.completedAt,
    createdAt: serverTimestamp(),
  })

  // Upsert daily stats
  const dateKey = session.dateKey
  const dailyRef = dailyStatDoc(uid, dateKey)
  const snap = await getDoc(dailyRef)

  if (snap.exists()) {
    const existing = snap.data() as DailyStats
    await setDoc(dailyRef, {
      ...existing,
      pomodorosCompleted:
        session.mode === 'pomodoro'
          ? existing.pomodorosCompleted + 1
          : existing.pomodorosCompleted,
      focusMinutes:
        session.mode === 'pomodoro'
          ? existing.focusMinutes + session.durationMinutes
          : existing.focusMinutes,
      breakMinutes:
        session.mode !== 'pomodoro'
          ? existing.breakMinutes + session.durationMinutes
          : existing.breakMinutes,
      sessionIds: [...(existing.sessionIds ?? []), ref.id],
    })
  } else {
    await setDoc(dailyRef, {
      dateKey,
      date: new Date(),
      pomodorosCompleted: session.mode === 'pomodoro' ? 1 : 0,
      focusMinutes: session.mode === 'pomodoro' ? session.durationMinutes : 0,
      breakMinutes: session.mode !== 'pomodoro' ? session.durationMinutes : 0,
      tasksCompleted: 0,
      productivityScore: 0,
      sessionIds: [ref.id],
    })
  }

  return ref.id
}

export async function getRecentSessions(uid: string, count = 5): Promise<PomodoroSession[]> {
  const q = query(sessionsRef(uid), orderBy('completedAt', 'desc'), limit(count))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      taskId: data.taskId ?? null,
      taskTitle: data.taskTitle ?? null,
      mode: data.mode,
      durationMinutes: data.durationMinutes ?? 0,
      startedAt: data.startedAt?.toDate?.() ?? new Date(),
      completedAt: data.completedAt?.toDate?.() ?? new Date(),
      wasInterrupted: data.wasInterrupted ?? false,
      dateKey: data.dateKey ?? '',
    } as PomodoroSession
  })
}

export async function getSessionsForDay(uid: string, dateKey: string): Promise<PomodoroSession[]> {
  const q = query(sessionsRef(uid), where('dateKey', '==', dateKey))
  const snap = await getDocs(q)
  const sessions = snap.docs.map((d) => {
    const data = d.data()
    return {
      id: d.id,
      taskId: data.taskId ?? null,
      taskTitle: data.taskTitle ?? null,
      mode: data.mode,
      durationMinutes: data.durationMinutes ?? 0,
      startedAt: data.startedAt?.toDate?.() ?? new Date(),
      completedAt: data.completedAt?.toDate?.() ?? new Date(),
      wasInterrupted: data.wasInterrupted ?? false,
      dateKey: data.dateKey ?? '',
    } as PomodoroSession
  })
  return sessions.sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
}

export async function getDailyStats(uid: string, days = 30): Promise<DailyStats[]> {
  const q = query(dailyStatsRef(uid), orderBy('date', 'desc'), limit(days))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data()
    return {
      ...data,
      date: data.date?.toDate() ?? new Date(),
    } as DailyStats
  })
}

export async function incrementTasksCompleted(uid: string): Promise<void> {
  const dateKey = todayKey()
  const ref = dailyStatDoc(uid, dateKey)
  const snap = await getDoc(ref)
  if (snap.exists()) {
    const data = snap.data() as DailyStats
    await setDoc(ref, { ...data, tasksCompleted: data.tasksCompleted + 1 })
  }
}
