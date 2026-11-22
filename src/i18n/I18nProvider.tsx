import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { I18nContext, resolveInitialLocale, STORAGE_KEY, type I18nContextValue } from './context'
import { getCachedMessages, loadMessages } from './locales'
import { format, type Locale, type Messages } from './types'

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale
  children: ReactNode
}) {
  const [locale, setLocaleState] = useState<Locale>(() => initialLocale ?? resolveInitialLocale())
  const [messages, setMessages] = useState<Messages>(
    () => getCachedMessages(locale) ?? getCachedMessages('en')!,
  )
  const requestIdRef = useRef(0)

  const setLocale = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Ignore storage access restrictions
    }

    const requestId = ++requestIdRef.current
    const cached = getCachedMessages(next)
    if (cached) {
      setLocaleState(next)
      setMessages(cached)
      return
    }

    void loadMessages(next).then((loaded) => {
      if (requestIdRef.current !== requestId) return
      setLocaleState(next)
      setMessages(loaded)
    })
  }, [])

  useEffect(() => {
    if (getCachedMessages(locale)) return
    let cancelled = false
    void loadMessages(locale).then((loaded) => {
      if (!cancelled) setMessages(loaded)
    })
    return () => {
      cancelled = true
    }
  }, [locale])

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = messages.meta.title
    const desc = document.querySelector('meta[name="description"]')
    if (desc) {
      desc.setAttribute('content', messages.meta.description)
    }
  }, [locale, messages])

  const value = useMemo<I18nContextValue>(
    () => ({ locale, setLocale, t: messages, format }),
    [locale, setLocale, messages],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
