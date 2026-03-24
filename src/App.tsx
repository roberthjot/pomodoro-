import { Routes, Route } from 'react-router-dom'
import { AuthGuard } from '@components/auth/AuthGuard'
import { AppShell } from '@components/layout/AppShell'
import { TimerPage } from '@pages/TimerPage'
import { TasksPage } from '@pages/TasksPage'
import { StatsPage } from '@pages/StatsPage'
import { SettingsPage } from '@pages/SettingsPage'
import { LoginPage } from '@pages/LoginPage'
import { NotFoundPage } from '@pages/NotFoundPage'
import { ErrorBoundary } from '@components/ui/ErrorBoundary'
import { ROUTES } from '@config/router'
import { useAuth } from '@hooks/useAuth'

// Initializes the Firebase auth listener at app root
function AuthInit() {
  useAuth()
  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthInit />
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <AppShell />
            </AuthGuard>
          }
        >
          <Route index element={<TimerPage />} />
          <Route path={ROUTES.TASKS} element={<TasksPage />} />
          <Route path={ROUTES.STATS} element={<StatsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  )
}
