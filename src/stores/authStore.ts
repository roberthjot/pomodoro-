import { create } from 'zustand'
import type { User } from 'firebase/auth'
import type { UserProfile } from '@/types'

interface AuthState {
  user: User | null
  userProfile: UserProfile | null
  isLoading: boolean
  isInitialized: boolean
  error: string | null
}

interface AuthActions {
  setUser: (user: User | null) => void
  setUserProfile: (profile: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  userProfile: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  setUser: (user) => set({ user }),
  setUserProfile: (userProfile) => set({ userProfile }),
  setLoading: (isLoading) => set({ isLoading }),
  setInitialized: (isInitialized) => set({ isInitialized }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))
