import { NavLink } from 'react-router-dom'
import { Timer, ListTodo, BarChart3, SlidersHorizontal } from 'lucide-react'
import { cn } from '@lib/utils'
import { ROUTES } from '@config/router'

const navItems = [
  { to: ROUTES.TIMER, icon: Timer, label: 'Timer' },
  { to: ROUTES.TASKS, icon: ListTodo, label: 'Tareas' },
  { to: ROUTES.STATS, icon: BarChart3, label: 'Stats' },
  { to: ROUTES.SETTINGS, icon: SlidersHorizontal, label: 'Ajustes' },
]

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-[#121826] border-t border-neutral-200/80 dark:border-[#1f2836] pb-safe">
      <div className="flex">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium transition-colors',
                isActive ? 'text-accent' : 'text-neutral-400 dark:text-[#5d6675]',
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
