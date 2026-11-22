import type { Locale, Messages } from '../types'
import { en } from './en'

const CACHE: Partial<Record<Locale, Messages>> = { en }

const LOADERS: Record<Exclude<Locale, 'en'>, () => Promise<Messages>> = {
  tr: () => import('./tr').then((m) => m.tr),
  de: () => import('./de').then((m) => m.de),
  fr: () => import('./fr').then((m) => m.fr),
  es: () => import('./es').then((m) => m.es),
  it: () => import('./it').then((m) => m.it),
  ja: () => import('./ja').then((m) => m.ja),
  ko: () => import('./ko').then((m) => m.ko),
  'zh-Hans': () => import('./zh-Hans').then((m) => m.zhHans),
  'pt-BR': () => import('./pt-BR').then((m) => m.ptBR),
}

export function getCachedMessages(locale: Locale): Messages | undefined {
  return CACHE[locale]
}

export async function loadMessages(locale: Locale): Promise<Messages> {
  const cached = CACHE[locale]
  if (cached) return cached

  if (locale === 'en') return en
  const loaded = await LOADERS[locale]()
  CACHE[locale] = loaded
  return loaded
}
