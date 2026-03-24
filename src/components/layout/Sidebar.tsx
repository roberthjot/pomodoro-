import { NavLink } from 'react-router-dom'
import { Timer, CheckSquare, BarChart2, Settings } from 'lucide-react'
import { cn } from '@lib/utils'
import { ROUTES } from '@config/router'

const navItems = [
  { to: ROUTES.TIMER, icon: Timer, label: 'Timer' },
  { to: ROUTES.TASKS, icon: CheckSquare, label: 'Tasks' },
  { to: ROUTES.STATS, icon: BarChart2, label: 'Stats' },
  { to: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex flex-col w-16 lg:w-56 border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-100 dark:border-neutral-800">
        <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center text-white text-sm font-bold shrink-0">
          P
        </div>
        <span className="hidden lg:block font-semibold text-neutral-900 dark:text-neutral-100 truncate">
          Pomodoro
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-2 flex flex-col gap-1">
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
                  : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100',
              )
            }
          >
            <Icon size={18} className="shrink-0" />
            <span className="hidden lg:block">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
