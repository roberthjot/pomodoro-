import { Outlet } from 'react-router-dom'
import { Flame } from 'lucide-react'
import { Sidebar } from './Sidebar'
import { BottomNav } from './BottomNav'
import { useAuthStore } from '@stores/authStore'

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
    <div className="flex h-screen bg-[#f5f6f8] dark:bg-[#0a0e17] overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
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
