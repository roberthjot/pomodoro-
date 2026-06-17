import { useState, useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { Timer, ListTodo, BarChart3, SlidersHorizontal, Flame, Moon, Sun, Monitor, LogOut } from 'lucide-react'
import { cn } from '@lib/utils'
import { ROUTES } from '@config/router'
import { useAuthStore } from '@stores/authStore'
import { useTheme } from '@hooks/useTheme'
import { signOut as firebaseSignOut } from '@services/auth.service'
import { Avatar } from '@components/ui/Avatar'

const navItems = [
  { to: ROUTES.TIMER, icon: Timer, label: 'Temporizador' },
  { to: ROUTES.TASKS, icon: ListTodo, label: 'Tareas' },
  { to: ROUTES.STATS, icon: BarChart3, label: 'Estadísticas' },
  { to: ROUTES.SETTINGS, icon: SlidersHorizontal, label: 'Ajustes' },
]

export function Sidebar() {
  const { userProfile, setUser, setUserProfile } = useAuthStore()
  const { theme, setTheme } = useTheme()
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const streak = userProfile?.currentStreak ?? 0
  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  const signOut = async () => {
    await firebaseSignOut()
    setUser(null)
    setUserProfile(null)
  }

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <aside className="hidden md:flex flex-col w-[230px] shrink-0 border-r border-neutral-200/80 dark:border-[#1f2836] bg-white dark:bg-[#121826] p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 px-2 py-2 mb-4">
        <div
          className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-white" />
        </div>
        <div className="min-w-0">
          <p className="font-bold text-neutral-900 dark:text-[#f3f4f7] leading-tight">pomodoro</p>
          <p className="text-xs text-neutral-400 dark:text-[#5d6675] leading-tight">enfoque diario</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium',
                isActive
                  ? 'bg-accent/10 text-accent'
                  : 'text-neutral-500 dark:text-[#9aa3b2] hover:bg-neutral-100 dark:hover:bg-[#0f1420] hover:text-neutral-900 dark:hover:text-[#f3f4f7]',
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom: streak + user */}
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-neutral-50 dark:bg-[#0f1420] border border-neutral-200/70 dark:border-[#1f2836]">
          <Flame size={18} className="text-orange-500 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-neutral-900 dark:text-[#f3f4f7] leading-tight">
              {streak} {streak === 1 ? 'día' : 'días'}
            </p>
            <p className="text-xs text-neutral-400 dark:text-[#5d6675] leading-tight">racha activa</p>
          </div>
        </div>

        <div ref={menuRef} className="relative">
          {showMenu && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-[#121826] border border-neutral-200 dark:border-[#1f2836] rounded-xl shadow-lg py-1 z-50">
              <button
                onClick={() => setTheme(nextTheme)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-neutral-600 dark:text-[#9aa3b2] hover:bg-neutral-100 dark:hover:bg-[#0f1420] transition-colors"
              >
                <ThemeIcon size={14} />
                Tema: {theme === 'light' ? 'claro' : theme === 'dark' ? 'oscuro' : 'sistema'}
              </button>
              <button
                onClick={() => { setShowMenu(false); signOut() }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <LogOut size={14} />
                Cerrar sesión
              </button>
            </div>
          )}
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-[#0f1420] transition-colors"
          >
            <Avatar src={userProfile?.photoURL} name={userProfile?.displayName} size="sm" />
            <div className="min-w-0 text-left">
              <p className="text-sm font-medium text-neutral-900 dark:text-[#f3f4f7] truncate leading-tight">
                {userProfile?.displayName || 'Usuario'}
              </p>
              <p className="text-xs text-neutral-400 dark:text-[#5d6675] truncate leading-tight">
                {userProfile?.email}
              </p>
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
}
