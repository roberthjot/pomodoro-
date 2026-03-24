import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { LoginForm } from '@components/auth/LoginForm'
import { RegisterForm } from '@components/auth/RegisterForm'
import { GoogleSignInButton } from '@components/auth/GoogleSignInButton'
import { useAuth } from '@hooks/useAuth'
import { ROUTES } from '@config/router'

export function LoginPage() {
  const { user, signInWithGoogle, isLoading } = useAuth()
  const [tab, setTab] = useState<'login' | 'register'>('login')

  if (user) return <Navigate to={ROUTES.TIMER} replace />

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">P</div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Pomodoro</h1>
          <p className="text-sm text-neutral-500 mt-1">Focus. Flow. Finish.</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          {/* Tabs */}
          <div className="flex mb-6 bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`}
              >
                {t === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {tab === 'login' ? <LoginForm /> : <RegisterForm />}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
            <span className="text-xs text-neutral-400">or</span>
            <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
          </div>

          <GoogleSignInButton onClick={signInWithGoogle} loading={isLoading} />
        </div>
      </div>
    </div>
  )
}
