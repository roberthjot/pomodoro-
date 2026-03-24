interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

export function ChartTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-neutral-600 dark:text-neutral-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-neutral-900 dark:text-neutral-100">
          <span className="font-bold">{p.value}</span>{' '}
          <span className="text-neutral-400">{p.name}</span>
        </p>
      ))}
    </div>
  )
}
