import { SHORTCUTS } from '@config/constants'

export function ShortcutsHint() {
  return (
    <div className="flex flex-wrap justify-center gap-3">
      {SHORTCUTS.map(({ key, description }) => (
        <div key={key} className="flex items-center gap-1.5 text-xs text-neutral-400">
          <kbd className="px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 font-mono text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
            {key}
          </kbd>
          <span>{description}</span>
        </div>
      ))}
    </div>
  )
}
