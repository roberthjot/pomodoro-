import { cn } from '@lib/utils'
import type { ReactNode } from 'react'

interface Props {
  label: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  className?: string
}

export function StatCard({ label, value, subtitle, icon, className }: Props) {
  return (
    <div className={cn('bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-neutral-400">{icon}</span>}
      </div>
      <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-mono">{value}</span>
      {subtitle && <span className="text-xs text-neutral-400">{subtitle}</span>}
    </div>
  )
}
