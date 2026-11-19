import { createContext, useContext } from 'react'

export type Route = 'home' | 'privacy' | 'support'

export function parseRoute(pathname: string): Route {
  if (/^\/privacy\/?$/.test(pathname)) return 'privacy'
  if (/^\/support\/?$/.test(pathname)) return 'support'
  return 'home'
}

export interface RouterState {
  route: Route
  navigate: (to: string) => void
}

export const RouterContext = createContext<RouterState | null>(null)

export function useRouter(): RouterState {
  const ctx = useContext(RouterContext)
  if (!ctx) throw new Error('useRouter must be used inside <RouterProvider>')
  return ctx
}
