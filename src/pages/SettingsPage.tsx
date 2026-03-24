import { useState } from 'react'
import { Play, Square } from 'lucide-react'
import { useSettings } from '@hooks/useSettings'
import { useAuth } from '@hooks/useAuth'
import { useSettingsStore } from '@stores/settingsStore'
import { Slider } from '@components/ui/Slider'
import { Toggle } from '@components/ui/Toggle'
import { Select } from '@components/ui/Select'
import { Button } from '@components/ui/Button'
import { Avatar } from '@components/ui/Avatar'
import { ConfirmDialog } from '@components/ui/ConfirmDialog'
import { ACCENT_COLORS, AMBIENT_OPTIONS } from '@config/constants'
import { ambientMusic } from '@lib/ambientMusic'
import { cn } from '@lib/utils'
import type { AmbientSound } from '@/types'

type Tab = 'timer' | 'sound' | 'notifications' | 'appearance' | 'account'

const TABS: { value: Tab; label: string }[] = [
  { value: 'timer', label: 'Timer' },
  { value: 'sound', label: 'Sound' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'appearance', label: 'Appearance' },
  { value: 'account', label: 'Account' },
]

const SOUND_OPTIONS = [
  { value: 'bell', label: 'Bell' },
  { value: 'digital', label: 'Digital' },
  { value: 'none', label: 'None' },
]

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>('timer')
  const { settings, updateTimerSettings, updateSoundSettings, updateNotificationSettings, updateAppearanceSettings } = useSettings()
  const { userProfile, signOut } = useAuth()
  const { appearance } = useSettingsStore()
  const [showSignOut, setShowSignOut] = useState(false)
  const [previewing, setPreviewing] = useState<AmbientSound | null>(null)

  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>

      {/* Tabs */}
      <div className="flex overflow-x-auto pb-1 gap-1 scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'px-4 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all',
              tab === t.value
                ? 'bg-accent text-white'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800',
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 flex flex-col gap-5">
        {tab === 'timer' && (
          <>
            <Slider label="Pomodoro" value={settings.timer.pomodoroDuration} min={1} max={60} unit="m" onChange={(v) => updateTimerSettings({ pomodoroDuration: v })} />
            <Slider label="Short Break" value={settings.timer.shortBreakDuration} min={1} max={30} unit="m" onChange={(v) => updateTimerSettings({ shortBreakDuration: v })} />
            <Slider label="Long Break" value={settings.timer.longBreakDuration} min={5} max={60} unit="m" onChange={(v) => updateTimerSettings({ longBreakDuration: v })} />
            <Slider label="Long break every" value={settings.timer.longBreakInterval} min={2} max={8} unit=" sessions" onChange={(v) => updateTimerSettings({ longBreakInterval: v })} />
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <Toggle label="Auto-start breaks" description="Automatically start break after a pomodoro" checked={settings.timer.autoStartBreaks} onChange={(v) => updateTimerSettings({ autoStartBreaks: v })} />
            <Toggle label="Auto-start pomodoros" description="Automatically start next pomodoro after a break" checked={settings.timer.autoStartPomodoros} onChange={(v) => updateTimerSettings({ autoStartPomodoros: v })} />
          </>
        )}

        {tab === 'sound' && (
          <>
            <Select label="Alert sound" value={settings.sound.alertSound} options={SOUND_OPTIONS} onChange={(v) => updateSoundSettings({ alertSound: v as 'bell' | 'digital' | 'none' })} />
            <Slider label="Volume" value={settings.sound.volume} min={0} max={100} unit="%" onChange={(v) => updateSoundSettings({ volume: v })} />
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <Toggle label="Ticking sound" description="Play tick sound during focus sessions" checked={settings.sound.tickingEnabled} onChange={(v) => updateSoundSettings({ tickingEnabled: v })} />
            <Slider label="Ticking volume" value={settings.sound.tickingVolume} min={0} max={100} unit="%" onChange={(v) => updateSoundSettings({ tickingVolume: v })} />
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <div className="flex flex-col gap-3">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Ambient music</span>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {AMBIENT_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      updateSoundSettings({ ambientSound: opt.value })
                      if (previewing) { ambientMusic.stopPreview(); setPreviewing(null) }
                    }}
                    className={cn(
                      'relative flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition-all select-none',
                      settings.sound.ambientSound === opt.value
                        ? 'border-accent bg-accent/5 dark:bg-accent/10'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600',
                    )}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300 text-center leading-tight">{opt.label}</span>
                    {opt.value !== 'none' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (previewing === opt.value) {
                            ambientMusic.stopPreview()
                            setPreviewing(null)
                          } else {
                            setPreviewing(opt.value)
                            ambientMusic.preview(opt.value, () => setPreviewing(null))
                          }
                        }}
                        className="mt-0.5 flex items-center gap-0.5 text-xs text-neutral-400 hover:text-accent transition-colors"
                      >
                        {previewing === opt.value
                          ? <><Square size={9} className="fill-current" /> Stop</>
                          : <><Play size={9} className="fill-current" /> Play</>
                        }
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {settings.sound.ambientSound !== 'none' && (
              <Slider label="Ambient volume" value={settings.sound.ambientVolume} min={0} max={100} unit="%" onChange={(v) => updateSoundSettings({ ambientVolume: v })} />
            )}
          </>
        )}

        {tab === 'notifications' && (
          <>
            <Toggle label="Browser notifications" description="Show system notifications when sessions end" checked={settings.notifications.browserNotifications} onChange={(v) => updateNotificationSettings({ browserNotifications: v })} />
            <Toggle label="Notify on session end" checked={settings.notifications.notifyOnSessionEnd} onChange={(v) => updateNotificationSettings({ notifyOnSessionEnd: v })} />
            <Toggle label="Notify on break end" checked={settings.notifications.notifyOnBreakEnd} onChange={(v) => updateNotificationSettings({ notifyOnBreakEnd: v })} />
          </>
        )}

        {tab === 'appearance' && (
          <>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Theme</span>
              <div className="flex gap-2">
                {(['light', 'dark', 'system'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => updateAppearanceSettings({ theme: t })}
                    className={cn(
                      'flex-1 py-2 rounded-xl text-sm font-medium border transition-all capitalize',
                      appearance.theme === t
                        ? 'border-accent text-accent bg-accent/5'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-400',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Accent color</span>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map(({ value, label }) => (
                  <button
                    key={value}
                    title={label}
                    onClick={() => updateAppearanceSettings({ accentColor: value })}
                    className={cn(
                      'w-8 h-8 rounded-full transition-transform',
                      appearance.accentColor === value ? 'scale-125 ring-2 ring-offset-2 ring-neutral-400' : 'hover:scale-110',
                    )}
                    style={{ backgroundColor: value }}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {tab === 'account' && (
          <>
            <div className="flex items-center gap-3">
              <Avatar src={userProfile?.photoURL} name={userProfile?.displayName} size="lg" />
              <div>
                <p className="font-medium text-neutral-900 dark:text-neutral-100">{userProfile?.displayName || 'User'}</p>
                <p className="text-sm text-neutral-400">{userProfile?.email}</p>
              </div>
            </div>
            <div className="h-px bg-neutral-100 dark:bg-neutral-800" />
            <Button variant="danger" onClick={() => setShowSignOut(true)}>Sign Out</Button>
          </>
        )}
      </div>

      <ConfirmDialog
        isOpen={showSignOut}
        onClose={() => setShowSignOut(false)}
        onConfirm={async () => { await signOut(); setShowSignOut(false) }}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
      />
    </div>
  )
}
