export const ROUTES = {
  HOME: '/',
  TIMER: '/',
  TASKS: '/tasks',
  STATS: '/stats',
  SETTINGS: '/settings',
  LOGIN: '/login',
} as const

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES]
