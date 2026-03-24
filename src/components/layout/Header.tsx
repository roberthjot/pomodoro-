import { useState, useRef, useEffect } from 'react'
import { Moon, Sun, Monitor, LogOut } from 'lucide-react'
import { Avatar } from '@components/ui/Avatar'
import { useAuthStore } from '@stores/authStore'
import { useTheme } from '@hooks/useTheme'
import { signOut as firebaseSignOut } from '@services/auth.service'

export function Header() {
  const { userProfile, setUser, setUserProfile } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const signOut = async () => {
    await firebaseSignOut()
    setUser(null)
    setUserProfile(null)
  }
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <header className="flex items-center justify-end gap-3 px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <button
        onClick={() => setTheme(nextTheme)}
        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title={`Theme: ${theme}`}
      >
        <ThemeIcon size={18} />
      </button>

      <div ref={menuRef} className="relative">
        <button onClick={() => setShowMenu((v) => !v)} className="rounded-full">
          <Avatar src={userProfile?.photoURL} name={userProfile?.displayName} size="sm" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-10 w-48 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg py-1 z-50">
            <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                {userProfile?.displayName || 'User'}
              </p>
              <p className="text-xs text-neutral-400 truncate">{userProfile?.email}</p>
            </div>
            <button
              onClick={() => { setShowMenu(false); signOut() }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
