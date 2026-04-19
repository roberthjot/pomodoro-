import { useState, useEffect } from 'react'
import { cn } from '@lib/utils'

interface ZoneInfo {
  label: string
  emoji: string
  className: string
}

function getZone(hour: number): ZoneInfo | null {
  if (hour >= 10 && hour < 13)
    return { label: 'Zona arranque', emoji: '🌅', className: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' }
  if (hour >= 13 && hour < 19)
    return { label: 'Zona ocio', emoji: '☀️', className: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20' }
  if (hour >= 19 && hour < 23)
    return { label: 'Zona trabajo profundo', emoji: '🌙', className: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' }
  return null
}

export function DayZoneIndicator() {
  const [zone, setZone] = useState<ZoneInfo | null>(() => getZone(new Date().getHours()))

  useEffect(() => {
    const interval = setInterval(() => {
      setZone(getZone(new Date().getHours()))
    }, 60_000)
    return () => clearInterval(interval)
  }, [])

  if (!zone) return null

  return (
    <div className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium', zone.className)}>
      <span>{zone.emoji}</span>
      <span>{zone.label}</span>
    </div>
  )
}
