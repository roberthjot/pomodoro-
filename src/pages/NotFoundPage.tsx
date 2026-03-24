import { Link } from 'react-router-dom'
import { ROUTES } from '@config/router'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="text-center">
        <p className="text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-4">404</p>
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Page not found</h2>
        <p className="text-sm text-neutral-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link
          to={ROUTES.TIMER}
          className="px-4 py-2 bg-accent text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
        >
          Go back home
        </Link>
      </div>
    </div>
  )
}
