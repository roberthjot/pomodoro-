import { Moon, Sun, Monitor } from 'lucide-react'
import { Avatar } from '@components/ui/Avatar'
import { useAuthStore } from '@stores/authStore'
import { useTheme } from '@hooks/useTheme'

export function Header() {
  const { userProfile } = useAuthStore()
  const { theme, setTheme } = useTheme()

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor

  return (
    <header className="flex items-center justify-end gap-3 px-6 py-3 border-b border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900">
      <button
        onClick={() => setTheme(nextTheme)}
        className="p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        title={`Theme: ${theme}`}
      >
        <ThemeIcon size={18} />
      </button>
      <Avatar
        src={userProfile?.photoURL}
        name={userProfile?.displayName}
        size="sm"
      />
    </header>
  )
}
