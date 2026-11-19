import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { parseRoute, RouterContext, type Route } from './router-context'

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname))

  useEffect(() => {
    const onPop = () => {
      setRoute(parseRoute(window.location.pathname))
      window.scrollTo({ top: 0, behavior: 'instant' })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = useCallback((to: string) => {
    const url = new URL(to, window.location.origin)
    if (url.pathname !== window.location.pathname || url.search !== window.location.search) {
      window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
    setRoute(parseRoute(url.pathname))
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return <RouterContext.Provider value={{ route, navigate }}>{children}</RouterContext.Provider>
}
