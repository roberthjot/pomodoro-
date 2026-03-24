import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@config/firebase'
import { useAuthStore } from '@stores/authStore'
import * as authService from '@services/auth.service'
import { getOrCreateUserProfile } from '@services/user.service'

export function useAuth() {
  const { user, userProfile, isLoading, isInitialized, error, setUser, setUserProfile, setLoading, setInitialized, setError, clearError } =
    useAuthStore()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        try {
          const profile = await getOrCreateUserProfile(firebaseUser)
          setUserProfile(profile)
        } catch {
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }
      setInitialized(true)
    })
    return unsub
  }, [setUser, setUserProfile, setInitialized])

  const signInWithGoogle = async () => {
    setLoading(true)
    clearError()
    try {
      await authService.signInWithGoogle()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed')
    } finally {
      setLoading(false)
    }
  }

  const signInWithEmail = async (email: string, password: string) => {
    setLoading(true)
    clearError()
    try {
      await authService.signInWithEmail(email, password)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const register = async (email: string, password: string, displayName: string) => {
    setLoading(true)
    clearError()
    try {
      await authService.registerWithEmail(email, password, displayName)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Registration failed')
      throw e
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setUserProfile(null)
  }

  return { user, userProfile, isLoading, isInitialized, error, signInWithGoogle, signInWithEmail, register, signOut, clearError }
}
