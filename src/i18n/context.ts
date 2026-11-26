import { createContext, useContext } from 'react'
import { format, LOCALE_META, localeFromPathname, localePath, SUPPORTED_LOCALES, type Locale, type Messages } from './types'

export const BANNER_DISMISSED_KEY = 'ocular-lang-banner-dismissed'

export function matchLocale(raw: string): Locale | null {
  const normalized = raw.trim().toLowerCase().replace(/_/g, '-')
  if (!normalized) return null

  const exact = SUPPORTED_LOCALES.find(
    (code) => code.toLowerCase() === normalized || LOCALE_META[code].slug === normalized,
  )
  if (exact) return exact

  if (normalized === 'zh' || normalized.startsWith('zh-hans') || normalized === 'zh-cn' || normalized === 'zh-sg') {
    return 'zh-Hans'
  }
  if (normalized === 'pt' || normalized.startsWith('pt-')) {
    return 'pt-BR'
  }

  const base = normalized.split('-')[0]
  return SUPPORTED_LOCALES.find((code) => code.toLowerCase() === base) ?? null
}

export function detectBrowserLocale(): Locale | null {
  if (typeof navigator === 'undefined') return null
  const navLangs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const lang of navLangs) {
    if (!lang) continue
    const matched = matchLocale(lang)
    if (matched) return matched
  }
  return null
}

export function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'
  return localeFromPathname(window.location.pathname) ?? 'en'
}

export function redirectLegacyLangParam(): boolean {
  if (typeof window === 'undefined') return false

  const params = new URLSearchParams(window.location.search)
  const param = params.get('lang')
  if (!param) return false

  const matched = matchLocale(param)
  if (!matched) return false

  params.delete('lang')
  const search = params.toString()
  const target = `${localePath(matched)}${search ? `?${search}` : ''}${window.location.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (target === current) return false

  window.location.replace(target)
  return true
}

export interface I18nContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: Messages
  format: typeof format
}

export const I18nContext = createContext<I18nContextValue | null>(null)

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
