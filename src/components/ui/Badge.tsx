import { cn } from '@lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
        !color && 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400',
        className,
      )}
      style={color ? { backgroundColor: color + '22', color } : undefined}
    >
      {children}
    </span>
  )
}
