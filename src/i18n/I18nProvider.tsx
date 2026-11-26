import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { I18nContext, resolveInitialLocale, type I18nContextValue } from './context'
import { getCachedMessages, loadMessages } from './locales'
import { format, LOCALE_META, localePath, type Locale, type Messages } from './types'

export function I18nProvider({
  initialLocale,
  children,
}: {
  initialLocale?: Locale
  children: ReactNode
}) {
  const locale = initialLocale ?? resolveInitialLocale()
  const [messages, setMessages] = useState<Messages>(
    () => getCachedMessages(locale) ?? getCachedMessages('en')!,
  )

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale || typeof window === 'undefined') return
      window.location.assign(`${localePath(next)}${window.location.hash}`)
    },
    [locale],
  )

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
    document.documentElement.lang = LOCALE_META[locale].htmlLang
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
