import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, parseISO } from 'date-fns'

export function toDateKey(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function yesterdayKey(): string {
  return toDateKey(subDays(new Date(), 1))
}

export function getWeekRange(): { start: Date; end: Date } {
  const now = new Date()
  return { start: startOfWeek(now, { weekStartsOn: 1 }), end: endOfWeek(now, { weekStartsOn: 1 }) }
}

export function getMonthRange(): { start: Date; end: Date } {
  const now = new Date()
  return { start: startOfMonth(now), end: endOfMonth(now) }
}

export function getLast30DayKeys(): string[] {
  return Array.from({ length: 30 }, (_, i) => toDateKey(subDays(new Date(), i))).reverse()
}

export function getLast7DayKeys(): string[] {
  return Array.from({ length: 7 }, (_, i) => toDateKey(subDays(new Date(), i))).reverse()
}

export function formatDisplayDate(dateKey: string): string {
  return format(parseISO(dateKey), 'MMM d')
}

export function formatFullDate(date: Date): string {
  return format(date, 'MMMM d, yyyy')
}
