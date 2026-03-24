import { useStats } from '@hooks/useStats'
import { StatCard } from '@components/stats/StatCard'
import { DailyChart } from '@components/stats/DailyChart'
import { WeeklyChart } from '@components/stats/WeeklyChart'
import { StreakDisplay } from '@components/stats/StreakDisplay'
import { ProductivityScore } from '@components/stats/ProductivityScore'
import { Skeleton } from '@components/ui/Skeleton'
import { formatMinutes } from '@lib/utils'
import { Timer, Target, Clock, Flame } from 'lucide-react'

function formatDuration(minutes: number): string {
  if (minutes === 0) return '0m'
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function StatsPage() {
  const stats = useStats()

  const todayKey = new Date().toISOString().split('T')[0]
  const today = stats.dailyStats.find((s) => s.dateKey === todayKey)
  const todayPomodoros = today?.pomodorosCompleted ?? 0
  const todayMinutes = today?.focusMinutes ?? 0

  if (stats.isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-28 w-full" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Statistics</h1>

      {/* Today summary */}
      <div className="rounded-2xl border border-accent/20 bg-accent/5 dark:bg-accent/10 p-4 flex flex-col gap-3">
        <p className="text-xs font-semibold text-accent uppercase tracking-wide">Today</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center shrink-0">
              <Clock size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{formatDuration(todayMinutes)}</p>
              <p className="text-xs text-neutral-400">focus time</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center shrink-0">
              <Flame size={16} className="text-orange-500" />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{todayPomodoros}</p>
              <p className="text-xs text-neutral-400">pomodoros</p>
            </div>
          </div>
        </div>
      </div>

      {/* All time grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Total Sessions"
          value={stats.totalSessions}
          subtitle="all time"
          icon={<Target size={16} />}
        />
        <StatCard
          label="Focus Time"
          value={formatMinutes(stats.totalFocusMinutes)}
          subtitle="all time"
          icon={<Timer size={16} />}
        />
        <StreakDisplay current={stats.currentStreak} longest={stats.longestStreak} />
        <ProductivityScore score={stats.productivityScore} />
      </div>

      <DailyChart data={stats.weeklyData} />
      <WeeklyChart data={stats.monthlyData} />
    </div>
  )
}
