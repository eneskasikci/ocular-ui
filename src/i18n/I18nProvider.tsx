import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, resolveInitialLocale, STORAGE_KEY, type I18nContextValue } from './context'
import { LOCALES } from './locales'
import { format, type Locale } from './types'

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => resolveInitialLocale())

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore storage access restrictions
    }
  }, [])

  const t = LOCALES[locale]

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = t.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) {
      desc.setAttribute('content', t.meta.description)
    }
  }, [locale, t])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t, format }),
    [locale, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
