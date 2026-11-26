import { SITE_URL } from '../config.ts'
import type { FilmId, GrainLevel } from '../data/recipes'

export const SUPPORTED_LOCALES = [
  'en',
  'tr',
  'de',
  'fr',
  'es',
  'it',
  'ja',
  'ko',
  'zh-Hans',
  'pt-BR',
] as const

export type Locale = (typeof SUPPORTED_LOCALES)[number]

export interface LocaleMeta {
  label: string
  short: string
  slug: string
  htmlLang: string
  hreflang: string
  ogLocale: string
  suggestCta: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    label: 'English',
    short: 'EN',
    slug: '',
    htmlLang: 'en',
    hreflang: 'en',
    ogLocale: 'en_US',
    suggestCta: 'View in English',
  },
  tr: {
    label: 'Türkçe',
    short: 'TR',
    slug: 'tr',
    htmlLang: 'tr',
    hreflang: 'tr',
    ogLocale: 'tr_TR',
    suggestCta: 'Türkçe olarak görüntüle',
  },
  de: {
    label: 'Deutsch',
    short: 'DE',
    slug: 'de',
    htmlLang: 'de',
    hreflang: 'de',
    ogLocale: 'de_DE',
    suggestCta: 'Auf Deutsch ansehen',
  },
  fr: {
    label: 'Français',
    short: 'FR',
    slug: 'fr',
    htmlLang: 'fr',
    hreflang: 'fr',
    ogLocale: 'fr_FR',
    suggestCta: 'Voir en français',
  },
  es: {
    label: 'Español',
    short: 'ES',
    slug: 'es',
    htmlLang: 'es',
    hreflang: 'es',
    ogLocale: 'es_ES',
    suggestCta: 'Ver en español',
  },
  it: {
    label: 'Italiano',
    short: 'IT',
    slug: 'it',
    htmlLang: 'it',
    hreflang: 'it',
    ogLocale: 'it_IT',
    suggestCta: 'Visualizza in italiano',
  },
  ja: {
    label: '日本語',
    short: 'JA',
    slug: 'ja',
    htmlLang: 'ja',
    hreflang: 'ja',
    ogLocale: 'ja_JP',
    suggestCta: '日本語で見る',
  },
  ko: {
    label: '한국어',
    short: 'KO',
    slug: 'ko',
    htmlLang: 'ko',
    hreflang: 'ko',
    ogLocale: 'ko_KR',
    suggestCta: '한국어로 보기',
  },
  'zh-Hans': {
    label: '简体中文',
    short: '中文',
    slug: 'zh-hans',
    htmlLang: 'zh-Hans',
    hreflang: 'zh-Hans',
    ogLocale: 'zh_CN',
    suggestCta: '查看简体中文版',
  },
  'pt-BR': {
    label: 'Português',
    short: 'PT',
    slug: 'pt',
    htmlLang: 'pt',
    hreflang: 'pt',
    ogLocale: 'pt_BR',
    suggestCta: 'Ver em português',
  },
}

export function localePath(locale: Locale): string {
  const { slug } = LOCALE_META[locale]
  return slug ? `/${slug}/` : '/'
}

export function localeUrl(locale: Locale, origin = SITE_URL): string {
  return `${origin}${localePath(locale)}`
}

export function localeFromPathname(pathname: string): Locale | null {
  const segment = pathname.replace(/^\/+|\/+$/g, '').split('/')[0]?.toLowerCase() ?? ''
  if (!segment) return null
  return SUPPORTED_LOCALES.find((code) => LOCALE_META[code].slug === segment) ?? null
}

export type SceneId = 'top' | 'camera' | 'recipes' | 'capture' | 'raw' | 'tiers' | 'privacy'

export interface Messages {
  meta: {
    title: string
    description: string
  }
  a11y: {
    skipToContent: string
    backToTop: string
    language: string
    selectLanguage: string
    cameraFeatures: string
    interactiveViewfinder: string
    phoneSimulator: string
    phoneHudLayout: string
    switchSamplePhoto: string
    switchActivePhoto: string
    prevPhoto: string
    nextPhoto: string
    playSlideshow: string
    pauseSlideshow: string
    stepPhotos: string
    choosePhoto: string
    selectPhotoForCamera: string
    toggleRawCompare: string
    toggleQMenu: string
    toggleFlash: string
    cycleAspect: string
    openQMenu: string
    closeQMenu: string
    qMenuLabel: string
    qMenuDescription: string
    filmLooks: string
    filmStocks: string
    primeFocalLengths: string
    dynamicRangeModes: string
    aspectRatios: string
    filmGrainStrength: string
    exposureBiasEv: string
    inCameraEv: string
    darkroomWipePosition: string
    redevelopWithStock: string
    rawSpecs: string
    privacyGuarantees: string
    footerNav: string
    switchLocationPhoto: string
    switchSamplePhotoTitle: string
    toggleGuides: string
    toggleRawSplit: string
    captureFrame: string
    filmDialLabel: string
    rotateFilmDial: string
    compareRawWithRecipe: string
    viewfinderSr: string
    switchToProHud: string
    cameraFnTiles: string
    cameraSimpleControls: string
  }
  scenes: Record<SceneId, string>
  cta: {
    getApp: string
    downloadAppStore: string
  }
  hero: {
    headline: string
    tagline: string
    subline: string
    inCamera: string
    scrollIntoCamera: string
    shotWithOcular: string
  }
  sim: {
    hud: string
    free: string
    pro: string
  }
  recipes: {
    heading: string
    lede: string
    freeBadge: string
    proBadge: string
    shownCount: string
    customSlots: string
    moreStocks: string
    summaries: Record<FilmId, string>
  }
  capture: {
    heading: string
    lede: string
    exposureBias: string
    dynamicRange: string
    framingRatio: string
    filmGrain: string
    analogOptics: string
    halation: string
    primes: string
    grainLevels: Record<GrainLevel, string>
  }
  raw: {
    heading: string
    lede: string
    wipeLabel: string
    splitOn: string
    splitOff: string
    chips: {
      bayerDng: string
      proRaw: string
      exifRecipe: string
      nonDestructive: string
    }
  }
  tiers: {
    heading: string
    lede: string
    freeBadge: string
    proBadge: string
    freeRows: readonly [string, string][]
    proRows: readonly [string, string][]
    trialBadge: string
    trialCopy: string
    readFaq: string
  }
  privacy: {
    heading: string
    lede: string
    chips: readonly [string, string, string, string]
    subline: string
    readPolicy: string
  }
  footer: {
    tagline: string
    trademark: string
    privacyPolicy: string
    support: string
    terms: string
  }
  phone: {
    split: string
    raw: string
    exposureComp: string
    reset: string
    exposure: string
    film: string
    proPill: string
    qKickerFree: string
    qKickerPro: string
    grain: string
    on: string
    off: string
    upsellText: string
    upsellBtn: string
    range: string
    clear: string
    grid: string
    roll: string
    heicRaw: string
    panoramic: string
  }
}

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}
