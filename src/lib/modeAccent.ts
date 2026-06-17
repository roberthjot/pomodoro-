import type { TimerMode } from '@/types'

/** Accent gradient (A → B) per timer mode, from the design handoff. */
export const MODE_ACCENT: Record<TimerMode, { a: string; b: string }> = {
  pomodoro: { a: '#ef4444', b: '#f97316' },
  shortBreak: { a: '#14b8a6', b: '#22c55e' },
  longBreak: { a: '#3b82f6', b: '#6366f1' },
  hyperfocus: { a: '#8b5cf6', b: '#d946ef' },
}

/** Spanish label shown inside the ring (uppercase). */
export const MODE_RING_LABEL: Record<TimerMode, string> = {
  pomodoro: 'Enfoque',
  shortBreak: 'Descanso',
  longBreak: 'Descanso largo',
  hyperfocus: 'Hiperfoco',
}

export function getModeAccent(mode: TimerMode) {
  return MODE_ACCENT[mode] ?? MODE_ACCENT.pomodoro
}

export function modeGradient(mode: TimerMode, angle = '135deg'): string {
  const { a, b } = getModeAccent(mode)
  return `linear-gradient(${angle}, ${a}, ${b})`
}
