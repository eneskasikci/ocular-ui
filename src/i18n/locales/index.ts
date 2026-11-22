import type { Locale, Messages } from '../types'
import { de } from './de'
import { en } from './en'
import { es } from './es'
import { fr } from './fr'
import { it } from './it'
import { ja } from './ja'
import { ko } from './ko'
import { ptBR } from './pt-BR'
import { tr } from './tr'
import { zhHans } from './zh-Hans'

export const LOCALES: Record<Locale, Messages> = {
  en,
  tr,
  de,
  fr,
  es,
  it,
  ja,
  ko,
  'zh-Hans': zhHans,
  'pt-BR': ptBR,
}
