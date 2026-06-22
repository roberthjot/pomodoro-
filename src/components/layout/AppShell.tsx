import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useAuthStore } from '@stores/authStore'

/** Subtle ambient glow tinted by time of day. */
function timeTint(hour: number): string {
  if (hour >= 5 && hour < 12) return '#f9731633' // morning — warm amber
  if (hour >= 12 && hour < 18) return '#3b82f633' // afternoon — daylight blue
  if (hour >= 18 && hour < 22) return '#8b5cf633' // evening — violet
  return '#6366f133' // night — indigo
}

function AmbientBackground() {
  const [tint, setTint] = useState(() => timeTint(new Date().getHours()))
  useEffect(() => {
    const id = setInterval(() => setTint(timeTint(new Date().getHours())), 5 * 60 * 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 h-72 -z-0 opacity-60 transition-[background] duration-1000"
      style={{ background: `radial-gradient(120% 100% at 50% 0%, ${tint} 0%, transparent 70%)` }}
    />
  )
}

function MobileHeader() {
  const { userProfile } = useAuthStore()
  const streak = userProfile?.currentStreak ?? 0
  return (
    <header className="md:hidden flex items-center justify-between px-5 py-4 bg-white dark:bg-[#121826] border-b border-neutral-200/80 dark:border-[#1f2836]">
      <div className="flex items-center gap-2.5">
        <div
          className="w-7 h-7 rounded-[8px] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #ef4444, #f97316)' }}
        >
          <span className="w-2 h-2 rounded-full bg-white" />
        </div>
        <span className="font-bold text-neutral-900 dark:text-[#f3f4f7]">pomodoro</span>
      </div>
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10">
        <Flame size={13} className="text-orange-500" />
        <span className="text-xs font-semibold text-orange-500">{streak}</span>
      </div>
    </header>
  )
}

export function AppShell() {
  return (
    <div className="relative flex h-screen bg-[#f5f6f8] dark:bg-[#0a0e17] overflow-hidden">
      <AmbientBackground />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <MobileHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="px-5 py-6 md:px-11 md:py-10 pb-24 md:pb-10">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  )
}
