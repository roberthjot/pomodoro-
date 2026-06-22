import { useState } from 'react'
import { Modal } from '@components/ui/Modal'
import { Button } from '@components/ui/Button'
import { useSettingsStore } from '@stores/settingsStore'
import type { Task, CreateTaskInput, Project } from '@/types'
import { ACCENT_COLORS } from '@config/constants'

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onSubmit: (input: CreateTaskInput) => Promise<void>
  initialData?: Task
  projects: Project[]
}

function toDateString(date: Date | null | undefined): string {
  if (!date) return ''
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function TaskForm({ isOpen, onClose, onSubmit, initialData, projects }: Props) {
  const pomodoroDuration = useSettingsStore((s) => s.timer.pomodoroDuration)
  const [title, setTitle] = useState(initialData?.title ?? '')
  const [notes, setNotes] = useState(initialData?.notes ?? '')
  const [estimated, setEstimated] = useState(initialData?.estimatedPomodoros ?? 1)
  const [tags, setTags] = useState<string[]>(initialData?.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [tagColors, setTagColors] = useState<Record<string, string>>(initialData?.tagColors ?? {})
  const [projectId, setProjectId] = useState<string | null>(initialData?.projectId ?? null)
  const [dueDate, setDueDate] = useState(toDateString(initialData?.dueDate))
  const [loading, setLoading] = useState(false)

  const addTag = () => {
    const t = tagInput.trim()
    if (t && !tags.includes(t) && tags.length < 5) {
      const color = ACCENT_COLORS[tags.length % ACCENT_COLORS.length].value
      setTags([...tags, t])
      setTagColors({ ...tagColors, [t]: color })
      setTagInput('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
    const c = { ...tagColors }
    delete c[tag]
    setTagColors(c)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSubmit({
        title: title.trim(),
        notes,
        estimatedPomodoros: estimated,
        tags,
        tagColors,
        projectId,
        dueDate: dueDate ? new Date(dueDate + 'T00:00:00') : null,
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-neutral-200 dark:border-[#1f2836] bg-white dark:bg-[#0f1420] px-3 py-2.5 text-sm text-neutral-900 dark:text-[#f3f4f7] placeholder:text-neutral-400 dark:placeholder:text-[#5d6675] focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/40 transition-all'
  const labelClass = 'text-sm font-medium text-neutral-700 dark:text-[#9aa3b2]'

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Editar tarea' : 'Nueva tarea'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Título</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required autoFocus placeholder="¿En qué vas a trabajar?" className={inputClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Notas <span className="text-neutral-400 dark:text-[#5d6675] font-normal">(opcional)</span></label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agrega detalles…"
            rows={2}
            className={`${inputClass} resize-none`}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className={labelClass}>Pomodoros estimados</label>
            <span className="text-sm font-mono text-accent">
              {estimated} · ~{formatDuration(estimated * pomodoroDuration)}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={20}
            step={1}
            value={estimated}
            onChange={(e) => setEstimated(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none cursor-pointer bg-neutral-200 dark:bg-[#1c2533] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
          />
        </div>

        {/* Project selector — clean list style */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Proyecto</label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => setProjectId(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                !projectId
                  ? 'bg-accent/10 text-accent'
                  : 'text-neutral-500 dark:text-[#9aa3b2] bg-neutral-100 dark:bg-[#0f1420] hover:bg-neutral-200 dark:hover:bg-[#1c2533]'
              }`}
            >
              Ninguno
            </button>
            {projects.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProjectId(p.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  projectId === p.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-neutral-600 dark:text-[#9aa3b2] bg-neutral-100 dark:bg-[#0f1420] hover:bg-neutral-200 dark:hover:bg-[#1c2533]'
                }`}
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* Due date */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Fecha límite <span className="text-neutral-400 dark:text-[#5d6675] font-normal">(opcional)</span></label>
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={`${inputClass} [color-scheme:dark]`} />
        </div>

        {/* Tags */}
        <div className="flex flex-col gap-2">
          <label className={labelClass}>Etiquetas <span className="text-neutral-400 dark:text-[#5d6675] font-normal">(opcional)</span></label>
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Agregar etiqueta…"
              className={inputClass}
            />
            <Button type="button" variant="secondary" size="sm" onClick={addTag}>Añadir</Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: (tagColors[tag] ?? '#ef4444') + '22', color: tagColors[tag] ?? '#ef4444' }}
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:opacity-70">×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit" loading={loading}>{initialData ? 'Guardar' : 'Crear tarea'}</Button>
        </div>
      </form>
    </Modal>
  )
}
