import { useState } from 'react'
import { Play, Square, Minus, Plus, Zap, LogOut } from 'lucide-react'
import { useSettings } from '@hooks/useSettings'
import { useAuth } from '@hooks/useAuth'
import { Slider } from '@components/ui/Slider'
import { Toggle } from '@components/ui/Toggle'
import { Select } from '@components/ui/Select'
import { Avatar } from '@components/ui/Avatar'
import { ConfirmDialog } from '@components/ui/ConfirmDialog'
import { ACCENT_COLORS, AMBIENT_OPTIONS } from '@config/constants'
import { ambientMusic } from '@lib/ambientMusic'
import { getModeAccent } from '@lib/modeAccent'
import { cn } from '@lib/utils'
import type { AmbientSound } from '@/types'

const SOUND_OPTIONS = [
  { value: 'bell', label: 'Campana' },
  { value: 'digital', label: 'Digital' },
  { value: 'none', label: 'Ninguno' },
]

const card =
  'rounded-2xl bg-white dark:bg-[#121826] border border-neutral-200/80 dark:border-[#1f2836] shadow-[0_1px_3px_rgba(17,24,39,0.06)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]'
const sectionLabel = 'text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-400 dark:text-[#5d6675] px-1'
const divider = 'h-px bg-neutral-100 dark:bg-[#1f2836]'

function Stepper({ value, min, max, step = 1, onChange }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange(Math.max(min, value - step))}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 dark:text-[#9aa3b2] hover:bg-neutral-100 dark:hover:bg-[#1c2533] transition-colors disabled:opacity-30"
        disabled={value <= min}
      >
        <Minus size={14} />
      </button>
      <span className="w-14 text-right font-mono text-sm font-semibold text-neutral-900 dark:text-[#f3f4f7]">
        {value} <span className="text-neutral-400 dark:text-[#5d6675] font-sans">min</span>
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + step))}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-neutral-500 dark:text-[#9aa3b2] hover:bg-neutral-100 dark:hover:bg-[#1c2533] transition-colors disabled:opacity-30"
        disabled={value >= max}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}

function DurationRow({ color, label, hyper, value, min, max, onChange }: { color: string; label: string; hyper?: boolean; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
        {hyper && <Zap size={13} style={{ color }} fill={color} />}
        <span className="text-sm font-medium text-neutral-800 dark:text-[#f3f4f7]">{label}</span>
      </div>
      <Stepper value={value} min={min} max={max} onChange={onChange} />
    </div>
  )
}

export function SettingsPage() {
  const { settings, updateTimerSettings, updateSoundSettings, updateNotificationSettings, updateAppearanceSettings } = useSettings()
  const { userProfile, signOut } = useAuth()
  const [showSignOut, setShowSignOut] = useState(false)
  const [previewing, setPreviewing] = useState<AmbientSound | null>(null)

  const accent = (m: 'pomodoro' | 'shortBreak' | 'longBreak' | 'hyperfocus') => getModeAccent(m).a

  return (
    <div className="max-w-[760px] mx-auto flex flex-col gap-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-[-0.02em] text-neutral-900 dark:text-[#f3f4f7]">Ajustes</h1>
        <p className="text-sm text-neutral-400 dark:text-[#5d6675] mt-0.5">Personaliza tu ritmo de enfoque</p>
      </div>

      {/* APARIENCIA */}
      <div className="flex flex-col gap-2">
        <p className={sectionLabel}>Apariencia</p>
        <div className={`${card} p-5 flex flex-col gap-4`}>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-[#f3f4f7]">Color de acento</p>
              <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-0.5">Define el color del temporizador y los gráficos</p>
            </div>
            <div className="flex gap-2.5">
              {ACCENT_COLORS.slice(0, 5).map(({ value, label }) => (
                <button
                  key={value}
                  title={label}
                  onClick={() => updateAppearanceSettings({ accentColor: value })}
                  className="w-[30px] h-[30px] rounded-xl transition-transform hover:scale-105"
                  style={{
                    backgroundColor: value,
                    boxShadow: settings.appearance.accentColor === value
                      ? `0 0 0 2px var(--tw-surface, #fff), 0 0 0 4px ${value}`
                      : undefined,
                  }}
                />
              ))}
            </div>
          </div>
          <div className={divider} />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-neutral-800 dark:text-[#f3f4f7]">Tema</p>
              <p className="text-xs text-neutral-400 dark:text-[#5d6675] mt-0.5">Claro u oscuro</p>
            </div>
            <div className="flex bg-neutral-100 dark:bg-[#0f1420] rounded-xl p-1 gap-1">
              {([['light', 'Claro'], ['dark', 'Oscuro'], ['system', 'Auto']] as const).map(([val, lbl]) => (
                <button
                  key={val}
                  onClick={() => updateAppearanceSettings({ theme: val })}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                    settings.appearance.theme === val
                      ? 'bg-white dark:bg-[#121826] shadow-sm text-neutral-900 dark:text-[#f3f4f7]'
                      : 'text-neutral-500 dark:text-[#9aa3b2]',
                  )}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DURACIÓN DE SESIONES */}
      <div className="flex flex-col gap-2">
        <p className={sectionLabel}>Duración de sesiones</p>
        <div className={`${card} p-5 flex flex-col gap-2`}>
          <DurationRow color={accent('pomodoro')} label="Pomodoro" value={settings.timer.pomodoroDuration} min={1} max={90} onChange={(v) => updateTimerSettings({ pomodoroDuration: v })} />
          <DurationRow color={accent('shortBreak')} label="Descanso corto" value={settings.timer.shortBreakDuration} min={1} max={30} onChange={(v) => updateTimerSettings({ shortBreakDuration: v })} />
          <DurationRow color={accent('longBreak')} label="Descanso largo" value={settings.timer.longBreakDuration} min={5} max={60} onChange={(v) => updateTimerSettings({ longBreakDuration: v })} />
          <DurationRow color={accent('hyperfocus')} label="Hiperfoco" hyper value={settings.timer.hyperfocusDuration ?? 52} min={30} max={120} onChange={(v) => updateTimerSettings({ hyperfocusDuration: v })} />
        </div>
      </div>

      {/* AUTOMATIZACIÓN */}
      <div className="flex flex-col gap-2">
        <p className={sectionLabel}>Automatización</p>
        <div className={`${card} p-5 flex flex-col gap-4`}>
          <Toggle label="Auto-iniciar descansos" description="Comienza el descanso al terminar un pomodoro" checked={settings.timer.autoStartBreaks} onChange={(v) => updateTimerSettings({ autoStartBreaks: v })} />
          <div className={divider} />
          <Toggle label="Auto-iniciar pomodoros" description="Comienza el siguiente pomodoro tras un descanso" checked={settings.timer.autoStartPomodoros} onChange={(v) => updateTimerSettings({ autoStartPomodoros: v })} />
          <div className={divider} />
          <Toggle label="Sonido al finalizar" description="Reproduce una alerta cuando termina la sesión" checked={settings.sound.alertSound !== 'none'} onChange={(v) => updateSoundSettings({ alertSound: v ? 'bell' : 'none' })} />
          <div className={divider} />
          <Toggle label="Notificaciones" description="Muestra notificaciones del navegador" checked={settings.notifications.browserNotifications} onChange={(v) => updateNotificationSettings({ browserNotifications: v })} />
        </div>
      </div>

      {/* SONIDO */}
      <div className="flex flex-col gap-2">
        <p className={sectionLabel}>Sonido</p>
        <div className={`${card} p-5 flex flex-col gap-4`}>
          <Select label="Sonido de alerta" value={settings.sound.alertSound} options={SOUND_OPTIONS} onChange={(v) => updateSoundSettings({ alertSound: v as 'bell' | 'digital' | 'none' })} />
          <Slider label="Volumen" value={settings.sound.volume} min={0} max={100} unit="%" onChange={(v) => updateSoundSettings({ volume: v })} />
          <div className={divider} />
          <Toggle label="Tic-tac" description="Reproduce un tic durante las sesiones de enfoque" checked={settings.sound.tickingEnabled} onChange={(v) => updateSoundSettings({ tickingEnabled: v })} />
          {settings.sound.tickingEnabled && (
            <Slider label="Volumen del tic" value={settings.sound.tickingVolume} min={0} max={100} unit="%" onChange={(v) => updateSoundSettings({ tickingVolume: v })} />
          )}
          <div className={divider} />
          <div className="flex flex-col gap-3">
            <span className="text-sm font-medium text-neutral-800 dark:text-[#f3f4f7]">Música ambiental</span>
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
                      : 'border-neutral-200 dark:border-[#1f2836] hover:border-neutral-300 dark:hover:border-[#2a3645]',
                  )}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs font-medium text-neutral-600 dark:text-[#9aa3b2] text-center leading-tight">{opt.label}</span>
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
                        : <><Play size={9} className="fill-current" /> Play</>}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          {settings.sound.ambientSound !== 'none' && (
            <Slider label="Volumen ambiental" value={settings.sound.ambientVolume} min={0} max={100} unit="%" onChange={(v) => updateSoundSettings({ ambientVolume: v })} />
          )}
        </div>
      </div>

      {/* CUENTA */}
      <div className="flex flex-col gap-2">
        <p className={sectionLabel}>Cuenta</p>
        <div className={`${card} p-5 flex items-center justify-between gap-4`}>
          <div className="flex items-center gap-3 min-w-0">
            <Avatar src={userProfile?.photoURL} name={userProfile?.displayName} size="lg" />
            <div className="min-w-0">
              <p className="font-medium text-neutral-900 dark:text-[#f3f4f7] truncate">{userProfile?.displayName || 'Usuario'}</p>
              <p className="text-sm text-neutral-400 dark:text-[#5d6675] truncate">{userProfile?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setShowSignOut(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors shrink-0"
          >
            <LogOut size={15} /> Cerrar sesión
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showSignOut}
        onClose={() => setShowSignOut(false)}
        onConfirm={async () => { await signOut(); setShowSignOut(false) }}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar sesión?"
        confirmLabel="Cerrar sesión"
      />
    </div>
  )
}
