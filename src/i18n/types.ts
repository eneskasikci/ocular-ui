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

export const LOCALE_META: Record<Locale, { label: string; short: string }> = {
  en: { label: 'English', short: 'EN' },
  tr: { label: 'Türkçe', short: 'TR' },
  de: { label: 'Deutsch', short: 'DE' },
  fr: { label: 'Français', short: 'FR' },
  es: { label: 'Español', short: 'ES' },
  it: { label: 'Italiano', short: 'IT' },
  ja: { label: '日本語', short: 'JA' },
  ko: { label: '한국어', short: 'KO' },
  'zh-Hans': { label: '简体中文', short: '中文' },
  'pt-BR': { label: 'Português (Brasil)', short: 'PT' },
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
    tagline: string
    subline: string
    inCamera: string
    scrollIntoCamera: string
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
    panoramic: string
  }
}

export function format(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    key in vars ? String(vars[key]) : `{${key}}`,
  )
}
