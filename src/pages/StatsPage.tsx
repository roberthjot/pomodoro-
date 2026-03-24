import { useStats } from '@hooks/useStats'
import { StatCard } from '@components/stats/StatCard'
import { DailyChart } from '@components/stats/DailyChart'
import { WeeklyChart } from '@components/stats/WeeklyChart'
import { StreakDisplay } from '@components/stats/StreakDisplay'
import { ProductivityScore } from '@components/stats/ProductivityScore'
import { Skeleton } from '@components/ui/Skeleton'
import { formatMinutes } from '@lib/utils'
import { Timer, Target } from 'lucide-react'

export function StatsPage() {
  const stats = useStats()

  if (stats.isLoading) {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        <Skeleton className="h-8 w-32" />
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

      {/* Overview grid */}
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
