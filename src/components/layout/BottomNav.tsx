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

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 pb-safe">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors',
                isActive ? 'text-accent' : 'text-neutral-400 dark:text-neutral-500',
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
