import { createContext, useContext } from 'react'
import { format, SUPPORTED_LOCALES, type Locale, type Messages } from './types'

export const STORAGE_KEY = 'ocular-lang'

export function matchLocale(raw: string): Locale | null {
  const normalized = raw.trim().toLowerCase().replace(/_/g, '-')
  if (!normalized) return null

  const exact = SUPPORTED_LOCALES.find((code) => code.toLowerCase() === normalized)
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

export function resolveInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en'

  const param = new URLSearchParams(window.location.search).get('lang')
  if (param) {
    const matched = matchLocale(param)
    if (matched) return matched
  }

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const matched = matchLocale(stored)
      if (matched) return matched
    }
  } catch {
    // Ignore storage access restrictions
  }

  const navLangs = navigator.languages?.length ? navigator.languages : [navigator.language]
  for (const lang of navLangs) {
    if (!lang) continue
    const matched = matchLocale(lang)
    if (matched) return matched
  }

  return 'en'
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
