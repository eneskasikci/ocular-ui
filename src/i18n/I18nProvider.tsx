import { useCallback, useMemo, type ReactNode } from 'react'
import { I18nContext, resolveInitialLocale, type I18nContextValue } from './context'
import { getCachedMessages } from './locales'
import { format, localePath, type Locale } from './types'

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale
  children: ReactNode
}) {
  const locale = initialLocale ?? resolveInitialLocale()
  const messages = getCachedMessages(locale) ?? getCachedMessages('en')!

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale || typeof window === 'undefined') return
      window.location.assign(`${localePath(next)}${window.location.hash}`)
    },
    [locale],
  )

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: messages, format }),
    [locale, setLocale, messages],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
