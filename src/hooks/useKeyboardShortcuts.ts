import { useEffect } from 'react'
import { SHORTCUTS } from '@config/constants'

interface ShortcutHandlers {
  onPlayPause: () => void
  onReset: () => void
  onSkip: () => void
  onSwitchMode: (mode: 1 | 2 | 3) => void
}

export function useKeyboardShortcuts({ onPlayPause, onReset, onSkip, onSwitchMode }: ShortcutHandlers) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire when typing in inputs
      const tag = (e.target as HTMLElement).tagName.toLowerCase()
      if (tag === 'input' || tag === 'textarea' || (e.target as HTMLElement).isContentEditable) return

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          onPlayPause()
          break
        case 'KeyR':
          onReset()
          break
        case 'KeyS':
          onSkip()
          break
        case 'Digit1':
          onSwitchMode(1)
          break
        case 'Digit2':
          onSwitchMode(2)
          break
        case 'Digit3':
          onSwitchMode(3)
          break
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onPlayPause, onReset, onSkip, onSwitchMode])

  return { shortcuts: SHORTCUTS }
}
