import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@config/firebase'
import type { UserSettings } from '@/types'

function settingsRef(uid: string) {
  return doc(db, 'users', uid, 'settings', 'preferences')
}

export async function getUserSettings(uid: string): Promise<UserSettings | null> {
  const snap = await getDoc(settingsRef(uid))
  if (!snap.exists()) return null
  const data = snap.data()
  return {
    ...data,
    updatedAt: data.updatedAt?.toDate() ?? new Date(),
  } as UserSettings
}

export async function saveUserSettings(
  uid: string,
  settings: Omit<UserSettings, 'updatedAt'>,
): Promise<void> {
  await setDoc(settingsRef(uid), { ...settings, updatedAt: serverTimestamp() }, { merge: true })
}
