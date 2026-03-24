import { Search } from 'lucide-react'
import { cn } from '@lib/utils'
import type { TaskStatus } from '@/types'

type FilterStatus = 'all' | TaskStatus | 'today' | 'overdue'

interface Props {
  filter: { status: FilterStatus; searchQuery: string; projectId: string | null }
  onFilter: (f: Partial<{ status: FilterStatus; searchQuery: string; projectId: string | null }>) => void
}

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Done' },
  { value: 'today', label: 'Today' },
  { value: 'overdue', label: 'Overdue' },
]

export function TaskFilters({ filter, onFilter }: Props) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 gap-1 overflow-x-auto scrollbar-none">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onFilter({ status: tab.value })}
            className={cn(
              'px-3 py-1 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              filter.status === tab.value
                ? 'bg-white dark:bg-neutral-900 shadow-sm text-neutral-900 dark:text-neutral-100'
                : 'text-neutral-500 hover:text-neutral-700',
              tab.value === 'overdue' && filter.status !== 'overdue' && 'text-red-400 hover:text-red-500',
              tab.value === 'today' && filter.status !== 'today' && 'text-orange-400 hover:text-orange-500',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="relative flex-1 sm:max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          value={filter.searchQuery}
          onChange={(e) => onFilter({ searchQuery: e.target.value })}
          placeholder="Search tasks..."
          className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
        />
      </div>
    </div>
  )
}
