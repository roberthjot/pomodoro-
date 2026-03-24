import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  type FieldValue,
} from 'firebase/firestore'
import { db } from '@config/firebase'
import type { UserProfile } from '@/types'
import type { User } from 'firebase/auth'

function userRef(uid: string) {
  return doc(db, 'users', uid)
}

export async function getOrCreateUserProfile(user: User): Promise<UserProfile> {
  const ref = userRef(user.uid)
  const snap = await getDoc(ref)

  if (snap.exists()) {
    const data = snap.data()
    return {
      ...data,
      createdAt: data.createdAt?.toDate() ?? new Date(),
      updatedAt: data.updatedAt?.toDate() ?? new Date(),
      lastSessionDate: data.lastSessionDate?.toDate() ?? null,
    } as UserProfile
  }

  const newProfile: Record<string, unknown> & { createdAt: FieldValue; updatedAt: FieldValue } = {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    totalSessions: 0,
    totalFocusMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
  }

  await setDoc(ref, newProfile)

  return {
    uid: user.uid,
    email: user.email ?? '',
    displayName: user.displayName ?? '',
    photoURL: user.photoURL ?? null,
    createdAt: new Date(),
    updatedAt: new Date(),
    totalSessions: 0,
    totalFocusMinutes: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastSessionDate: null,
  }
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>,
): Promise<void> {
  await updateDoc(userRef(uid), { ...updates, updatedAt: serverTimestamp() })
}

export async function updateStreakAndCounters(
  uid: string,
  {
    currentStreak,
    longestStreak,
    totalSessions,
    totalFocusMinutes,
    lastSessionDate,
  }: {
    currentStreak: number
    longestStreak: number
    totalSessions: number
    totalFocusMinutes: number
    lastSessionDate: Date
  },
): Promise<void> {
  await updateDoc(userRef(uid), {
    currentStreak,
    longestStreak,
    totalSessions,
    totalFocusMinutes,
    lastSessionDate,
    updatedAt: serverTimestamp(),
  })
}
