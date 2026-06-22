import { Search } from 'lucide-react'
import { cn } from '@lib/utils'
import type { TaskStatus } from '@/types'

type FilterStatus = 'all' | TaskStatus | 'today' | 'overdue'

interface Props {
  filter: { status: FilterStatus; searchQuery: string; projectId: string | null }
  onFilter: (f: Partial<{ status: FilterStatus; searchQuery: string; projectId: string | null }>) => void
}

const STATUS_TABS: { value: FilterStatus; label: string; accent?: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'active', label: 'Activas' },
  { value: 'completed', label: 'Hechas' },
  { value: 'today', label: 'Hoy', accent: '#f97316' },
  { value: 'overdue', label: 'Atrasadas', accent: '#ef4444' },
]

export function TaskFilters({ filter, onFilter }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Text tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
        {STATUS_TABS.map((tab) => {
          const active = filter.status === tab.value
          return (
            <button
              key={tab.value}
              onClick={() => onFilter({ status: tab.value })}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all',
                active
                  ? 'bg-accent/10 text-accent'
                  : 'text-neutral-500 dark:text-[#9aa3b2] hover:text-neutral-800 dark:hover:text-[#f3f4f7] hover:bg-neutral-100 dark:hover:bg-[#0f1420]',
              )}
              style={active && tab.accent ? { color: tab.accent, backgroundColor: `${tab.accent}1a` } : undefined}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div className="relative sm:w-56 shrink-0">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-[#5d6675]" />
        <input
          value={filter.searchQuery}
          onChange={(e) => onFilter({ searchQuery: e.target.value })}
          placeholder="Buscar…"
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-neutral-200/80 dark:border-[#1f2836] bg-white dark:bg-[#121826] text-sm text-neutral-900 dark:text-[#f3f4f7] placeholder:text-neutral-400 dark:placeholder:text-[#5d6675] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all"
        />
      </div>
    </div>
  )
}
