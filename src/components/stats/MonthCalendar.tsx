import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DailyStats } from '@/types'

const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const DOW = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const card =
  'rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] p-5 shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]'

function keyOf(y: number, m: number, d: number): string {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export function MonthCalendar({ dailyStats }: { dailyStats: DailyStats[] }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const map = new Map(dailyStats.map((s) => [s.dateKey, s.pomodorosCompleted]))
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const todayKey = keyOf(now.getFullYear(), now.getMonth(), now.getDate())

  const cells: ({ day: number; key: string; count: number } | null)[] = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const key = keyOf(year, month, d)
    cells.push({ day: d, key, count: map.get(key) ?? 0 })
  }

  const prev = () => { if (month === 0) { setMonth(11); setYear((y) => y - 1) } else setMonth((m) => m - 1) }
  const next = () => { if (month === 11) { setMonth(0); setYear((y) => y + 1) } else setMonth((m) => m + 1) }

  const intensity = (c: number) => {
    if (c <= 0) return 'bg-neutral-50 dark:bg-[#0f1420] text-neutral-300 dark:text-[#3a4555]'
    if (c <= 2) return 'bg-accent/15 text-neutral-700 dark:text-[#f3f4f7]'
    if (c <= 5) return 'bg-accent/40 text-neutral-800 dark:text-white'
    return 'bg-accent text-white'
  }

  return (
    <div className={card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-neutral-800 dark:text-[#f3f4f7]">{MONTHS[month]} {year}</h3>
        <div className="flex items-center gap-1">
          <button onClick={prev} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-[#f3f4f7] hover:bg-neutral-100 dark:hover:bg-[#1c2533] transition-colors">
            <ChevronLeft size={16} />
          </button>
          <button onClick={next} className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-[#f3f4f7] hover:bg-neutral-100 dark:hover:bg-[#1c2533] transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {DOW.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-semibold text-neutral-400 dark:text-[#5d6675] pb-1">{d}</div>
        ))}
        {cells.map((cell, i) =>
          cell === null ? (
            <div key={`e${i}`} />
          ) : (
            <div
              key={cell.key}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-colors ${intensity(cell.count)} ${cell.key === todayKey ? 'ring-2 ring-accent' : ''}`}
              title={`${cell.count} pomodoros`}
            >
              <span className="text-xs font-mono font-medium leading-none">{cell.day}</span>
              {cell.count > 0 && <span className="text-[8px] leading-none mt-0.5 opacity-80">{cell.count}</span>}
            </div>
          ),
        )}
      </div>
    </div>
  )
}
