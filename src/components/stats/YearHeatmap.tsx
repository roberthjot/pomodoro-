import { useMemo, useState } from 'react'
import type { DailyStats } from '@/types'

const DAY_LABELS = ['L', '', 'X', '', 'V', '', 'D']
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']

function toKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function levelColor(count: number): string {
  if (count <= 0) return 'bg-neutral-100 dark:bg-[#1c2533]'
  if (count <= 2) return 'bg-accent/25'
  if (count <= 4) return 'bg-accent/50'
  if (count <= 6) return 'bg-accent/75'
  return 'bg-accent'
}

export function YearHeatmap({ dailyStats }: { dailyStats: DailyStats[] }) {
  const [hover, setHover] = useState<{ key: string; count: number; x: number; y: number } | null>(null)

  const { weeks, monthMarks } = useMemo(() => {
    const map = new Map(dailyStats.map((s) => [s.dateKey, s.pomodorosCompleted]))

    // Start ~26 weeks back (half year) aligned to Monday, through today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const start = new Date(today)
    start.setDate(start.getDate() - 26 * 7)
    // align to Monday (getDay: 0=Sun..6=Sat -> Monday index)
    const dow = (start.getDay() + 6) % 7
    start.setDate(start.getDate() - dow)

    const weeks: { key: string; count: number; future: boolean }[][] = []
    const monthMarks: { col: number; label: string }[] = []
    let cursor = new Date(start)
    let col = 0
    let lastMonth = -1

    while (cursor <= today || cursor.getDay() !== 1) {
      const week: { key: string; count: number; future: boolean }[] = []
      for (let d = 0; d < 7; d++) {
        const key = toKey(cursor)
        const future = cursor > today
        week.push({ key, count: map.get(key) ?? 0, future })
        if (d === 0 && cursor.getMonth() !== lastMonth) {
          lastMonth = cursor.getMonth()
          monthMarks.push({ col, label: MONTHS[cursor.getMonth()] })
        }
        cursor.setDate(cursor.getDate() + 1)
      }
      weeks.push(week)
      col++
      if (col > 60) break
    }
    return { weeks, monthMarks }
  }, [dailyStats])

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-[#f3f4f7]">Tu año de enfoque</h3>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-[#5d6675]">
          <span>menos</span>
          <span className="w-2.5 h-2.5 rounded-[3px] bg-neutral-100 dark:bg-[#1c2533]" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-accent/25" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-accent/50" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-accent/75" />
          <span className="w-2.5 h-2.5 rounded-[3px] bg-accent" />
          <span>más</span>
        </div>
      </div>

      <div className="relative overflow-x-auto scrollbar-none">
        <div className="inline-flex flex-col gap-1 min-w-full">
          {/* Month labels */}
          <div className="flex gap-1 pl-6">
            {weeks.map((_, col) => {
              const mark = monthMarks.find((m) => m.col === col)
              return (
                <div key={col} className="w-2.5 text-[9px] text-neutral-400 dark:text-[#5d6675]">
                  {mark ? mark.label : ''}
                </div>
              )
            })}
          </div>

          <div className="flex gap-1">
            {/* Day-of-week labels */}
            <div className="flex flex-col gap-1 pr-0.5">
              {DAY_LABELS.map((d, i) => (
                <div key={i} className="w-2.5 h-2.5 text-[8px] leading-[10px] text-neutral-400 dark:text-[#5d6675]">
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, col) => (
              <div key={col} className="flex flex-col gap-1">
                {week.map((day) => (
                  <div
                    key={day.key}
                    className={`w-2.5 h-2.5 rounded-[3px] ${day.future ? 'opacity-0' : levelColor(day.count)}`}
                    onMouseEnter={(e) => {
                      const r = (e.target as HTMLElement).getBoundingClientRect()
                      setHover({ key: day.key, count: day.count, x: r.left, y: r.top })
                    }}
                    onMouseLeave={() => setHover(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {hover && (
          <div
            className="fixed z-50 px-2 py-1 rounded-lg bg-neutral-900 dark:bg-black text-white text-xs pointer-events-none -translate-x-1/2 -translate-y-full shadow-lg"
            style={{ left: hover.x + 5, top: hover.y - 4 }}
          >
            {hover.count} pomodoro{hover.count === 1 ? '' : 's'} · {hover.key}
          </div>
        )}
      </div>
    </div>
  )
}
