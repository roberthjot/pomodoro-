import { useId } from 'react'
import { getModeAccent } from '@lib/modeAccent'
import type { TimerMode } from '@/types'

interface TimerProgressProps {
  progress: number
  mode: TimerMode
  running?: boolean
  size?: number
  strokeWidth?: number
}

export function TimerProgress({
  progress,
  mode,
  running = false,
  size = 292,
  strokeWidth = 15,
}: TimerProgressProps) {
  const gradId = useId()
  const { a, b } = getModeAccent(mode)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const dashoffset = circumference * (1 - Math.min(progress, 1))

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Pulsing halo behind the ring while running */}
      {running && (
        <div
          className="absolute rounded-full animate-pulse-slow"
          style={{
            inset: strokeWidth,
            background: `radial-gradient(circle, ${a}22 0%, transparent 70%)`,
          }}
        />
      )}

      <svg width={size} height={size} className="rotate-[-90deg] relative">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>

        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-200 dark:text-[#1c2533]"
        />

        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashoffset}
          style={{ transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>
    </div>
  )
}
