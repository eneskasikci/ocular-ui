import {
  OCULAR_CURATED_RECIPES,
  OCULAR_FILM_STOCKS,
  OCULAR_HUD_SPEC,
} from '../generated/ocularSpec'

export type FilmId = 'std' | 'cc' | 'ac' | 'cn' | 'nn' | 'vv' | 'sep'
export type AllStockId = (typeof OCULAR_FILM_STOCKS)[number]['id']
export type CuratedPresetId = 'cam' | 'r1' | 'r2' | 'r3'
export type PhoneRecipeId = AllStockId | CuratedPresetId
export type DrMode = 'AUTO' | 'DR100' | 'DR200' | 'DR400'
export type AspectId = '4:3' | '3:2' | '1:1' | '16:9' | 'xpan'
export type GrainLevel = 'off' | 'weak' | 'strong'
export type QGrainLevel = 'off' | 'weakSmall' | 'weakLarge' | 'strongSmall' | 'strongLarge'
export type ColorChromeLevel = 'OFF' | 'WEAK' | 'STRG'
export type HalationLevel = 'off' | 'weak' | 'strong'
export type MonochromeFilter = 'STD' | 'Ye' | 'R' | 'G'
export type FlashMode = 'OFF' | 'AUTO' | 'ON'
export type FramingGuideMode = 'clean' | 'ruleOfThirds' | 'rangefinder'
export type LensMm = 13 | 24 | 28 | 35 | 50 | 77

export interface FilmGrade {
  brightness: number
  contrast: number
  saturate: number
  sepia: number
  grayscale: number
  hueRotate: number
}

export interface FilmTint {
  background: string
  blendMode: 'soft-light' | 'screen' | 'overlay' | 'multiply' | 'color'
  opacity: number
}

export interface FilmRecipe {
  id: FilmId
  code: string
  name: string
  tier: 'free' | 'pro'
  summary: string
  wb: string
  wbShort: string
  tone: string
  defaultDr: DrMode
  defaultGrain: GrainLevel
  defaultHalation: boolean
  swatch: readonly [string, string, string]
  grade: FilmGrade
  highlightTint?: FilmTint
  shadowTint?: FilmTint
}

export interface PhoneRecipe {
  id: PhoneRecipeId
  slotCode: string
  name: string
  stockId: AllStockId
  tier: 'free' | 'pro'
  kind: 'stock' | 'camera' | 'curated'
  canModify: boolean
  subtitle: string
  dynamicRange: DrMode
  grain: QGrainLevel
  colorChrome: ColorChromeLevel
  wbMode: string
  wbKelvin: number
  wbRed: number
  wbBlue: number
  highlightTone: number
  shadowTone: number
  color: number
  sharpness: number
  noiseReduction: number
  clarity: number
  halation: HalationLevel
  monoFilter: MonochromeFilter
  swatchGradient: readonly [string, string]
  grade: FilmGrade
  highlightTint?: FilmTint
  shadowTint?: FilmTint
}

const STOCK_VISUALS: Record<
  AllStockId,
  {
    swatchGradient: readonly [string, string]
    swatch?: readonly [string, string, string]
    grade: FilmGrade
    highlightTint?: FilmTint
    shadowTint?: FilmTint
  }
> = {
  std: {
    swatchGradient: ['#2e3b4e', '#24a876'],
    swatch: ['#3c5a78', '#b84336', '#d8cbb8'],
    grade: { brightness: 1.0, contrast: 1.0, saturate: 1.0, sepia: 0, grayscale: 0, hueRotate: 0 },
  },
  cc: {
    swatchGradient: ['#2b3942', '#7a1c2e'],
    swatch: ['#435160', '#7c6f64', '#b9ad99'],
    grade: { brightness: 1.02, contrast: 1.14, saturate: 0.84, sepia: 0, grayscale: 0, hueRotate: -2 },
    highlightTint: {
      background: 'linear-gradient(180deg, rgba(232,238,246,0.24), rgba(242,235,222,0.10) 55%, transparent)',
      blendMode: 'soft-light',
      opacity: 0.3,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(28,54,78,0.44), rgba(44,68,90,0.14) 55%, transparent)',
      blendMode: 'soft-light',
      opacity: 0.34,
    },
  },
  ac: {
    swatchGradient: ['#16181c', '#9ca3af'],
    swatch: ['#1e2024', '#6d7076', '#e6e4de'],
    grade: { brightness: 1.02, contrast: 1.24, saturate: 1.0, sepia: 0, grayscale: 1, hueRotate: 0 },
    highlightTint: {
      background: 'radial-gradient(circle at 50% 30%, rgba(243,241,236,0.35), transparent 75%)',
      blendMode: 'soft-light',
      opacity: 0.3,
    },
    shadowTint: {
      background: 'linear-gradient(180deg, transparent, rgba(11,12,14,0.55))',
      blendMode: 'multiply',
      opacity: 0.2,
    },
  },
  cn: {
    swatchGradient: ['#214a3e', '#7a1c2e'],
    swatch: ['#1f5052', '#cf6d3a', '#f0cf9b'],
    grade: { brightness: 1.01, contrast: 1.16, saturate: 0.98, sepia: 0.06, grayscale: 0, hueRotate: -4 },
    highlightTint: {
      background: 'linear-gradient(160deg, rgba(255,204,132,0.5), rgba(232,131,42,0.16))',
      blendMode: 'soft-light',
      opacity: 0.34,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(16,58,62,0.7), rgba(20,48,54,0.22))',
      blendMode: 'soft-light',
      opacity: 0.38,
    },
  },
  nn: {
    swatchGradient: ['#8b4e24', '#b52a44'],
    swatch: ['#4d1a27', '#a65e38', '#e8a65a'],
    grade: { brightness: 1.01, contrast: 1.1, saturate: 0.92, sepia: 0.14, grayscale: 0, hueRotate: -6 },
    highlightTint: {
      background: 'radial-gradient(90% 70% at 50% 25%, rgba(232,131,42,0.55), rgba(243,190,120,0.2))',
      blendMode: 'soft-light',
      opacity: 0.38,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(48,16,26,0.68), rgba(24,20,24,0.2))',
      blendMode: 'multiply',
      opacity: 0.22,
    },
  },
  ra: {
    swatchGradient: ['#1e3a34', '#24a876'],
    grade: { brightness: 1.01, contrast: 1.06, saturate: 0.96, sepia: 0, grayscale: 0, hueRotate: 0 },
    highlightTint: {
      background: 'linear-gradient(180deg, rgba(243,241,236,0.18), transparent 60%)',
      blendMode: 'soft-light',
      opacity: 0.22,
    },
  },
  et: {
    swatchGradient: ['#262930', '#3e544c'],
    grade: { brightness: 1.03, contrast: 0.9, saturate: 0.72, sepia: 0.04, grayscale: 0, hueRotate: -2 },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(30,44,44,0.36), transparent 65%)',
      blendMode: 'soft-light',
      opacity: 0.28,
    },
  },
  vv: {
    swatchGradient: ['#7a1c2e', '#24a876'],
    swatch: ['#1a4f7a', '#24a876', '#e07a32'],
    grade: { brightness: 1.0, contrast: 1.1, saturate: 1.35, sepia: 0, grayscale: 0, hueRotate: 2 },
    highlightTint: {
      background: 'linear-gradient(180deg, rgba(255,222,158,0.28), transparent 55%)',
      blendMode: 'soft-light',
      opacity: 0.2,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(16,38,62,0.5), transparent 70%)',
      blendMode: 'multiply',
      opacity: 0.18,
    },
  },
  as: {
    swatchGradient: ['#5c3a45', '#e8832a'],
    grade: { brightness: 1.03, contrast: 0.96, saturate: 1.06, sepia: 0.04, grayscale: 0, hueRotate: 2 },
    highlightTint: {
      background: 'radial-gradient(circle at 50% 35%, rgba(255,228,208,0.32), transparent 72%)',
      blendMode: 'soft-light',
      opacity: 0.26,
    },
  },
  pnh: {
    swatchGradient: ['#3a3238', '#7a1c2e'],
    grade: { brightness: 1.0, contrast: 1.15, saturate: 0.92, sepia: 0.02, grayscale: 0, hueRotate: 0 },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(24,20,28,0.42), transparent 65%)',
      blendMode: 'multiply',
      opacity: 0.2,
    },
  },
  pns: {
    swatchGradient: ['#2f333b', '#6b7280'],
    grade: { brightness: 1.02, contrast: 0.95, saturate: 0.88, sepia: 0, grayscale: 0, hueRotate: 0 },
  },
  sep: {
    swatchGradient: ['#4a3525', '#e8832a'],
    swatch: ['#3c281b', '#8d6c4d', '#e4d2b4'],
    grade: { brightness: 1.0, contrast: 1.12, saturate: 1.05, sepia: 0.82, grayscale: 1, hueRotate: -3 },
    highlightTint: {
      background: 'radial-gradient(circle at 50% 35%, rgba(244,218,172,0.45), transparent 75%)',
      blendMode: 'soft-light',
      opacity: 0.32,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(46,26,14,0.65), transparent)',
      blendMode: 'multiply',
      opacity: 0.2,
    },
  },
}

const FEATURED_META: Record<
  FilmId,
  {
    summary: string
    wb: string
    wbShort: string
    tone: string
    defaultDr: DrMode
    defaultGrain: GrainLevel
    defaultHalation: boolean
  }
> = {
  std: { summary: 'Balanced true-to-life color', wb: '5600K', wbShort: '5600K', tone: '0 / 0', defaultDr: 'DR100', defaultGrain: 'off', defaultHalation: false },
  cc: { summary: 'Muted documentary chrome', wb: '5800K −1/+2', wbShort: '5800K', tone: 'H-1 S+1', defaultDr: 'DR100', defaultGrain: 'weak', defaultHalation: false },
  ac: { summary: 'Fine silver monochrome', wb: 'MONO 0/0', wbShort: 'MONO', tone: 'H+1 S+2', defaultDr: 'DR200', defaultGrain: 'weak', defaultHalation: false },
  cn: { summary: 'Teal shadows, nostalgic punch', wb: '6000K +2/−3', wbShort: '6000K', tone: 'H-1 S+2', defaultDr: 'DR200', defaultGrain: 'strong', defaultHalation: true },
  nn: { summary: 'Amber highs, cinema shadows', wb: '6200K +3/−4', wbShort: '6200K', tone: 'H-2 S+1', defaultDr: 'DR200', defaultGrain: 'weak', defaultHalation: true },
  vv: { summary: 'Deep landscape saturation', wb: '5400K +1/−1', wbShort: '5400K', tone: 'H+1 S+1', defaultDr: 'DR100', defaultGrain: 'off', defaultHalation: false },
  sep: { summary: 'Archival silver-gelatin print', wb: 'ARCHIVAL', wbShort: 'WARM', tone: 'H-1 S+1', defaultDr: 'DR200', defaultGrain: 'strong', defaultHalation: false },
}

const FEATURED_IDS: readonly FilmId[] = ['std', 'cc', 'ac', 'cn', 'nn', 'vv', 'sep']

export const RECIPES: readonly FilmRecipe[] = FEATURED_IDS.map((id) => {
  const stock = OCULAR_FILM_STOCKS.find((s) => s.id === id)!
  const meta = FEATURED_META[id]
  const vis = STOCK_VISUALS[id]
  return {
    id,
    code: stock.code,
    name: stock.name,
    tier: stock.tier,
    summary: meta.summary,
    wb: meta.wb,
    wbShort: meta.wbShort,
    tone: meta.tone,
    defaultDr: meta.defaultDr,
    defaultGrain: meta.defaultGrain,
    defaultHalation: meta.defaultHalation,
    swatch: vis.swatch ?? ['#262930', '#7a1c2e', '#f3f1ec'],
    grade: vis.grade,
    highlightTint: vis.highlightTint,
    shadowTint: vis.shadowTint,
  }
})

export const RECIPE_MAP: Record<FilmId, FilmRecipe> = {
  std: RECIPES[0],
  cc: RECIPES[1],
  ac: RECIPES[2],
  cn: RECIPES[3],
  nn: RECIPES[4],
  vv: RECIPES[5],
  sep: RECIPES[6],
}

export const ALL_STOCK_RECIPES: readonly PhoneRecipe[] = OCULAR_FILM_STOCKS.map((s) => {
  const vis = STOCK_VISUALS[s.id]
  return {
    id: s.id,
    slotCode: s.code,
    name: s.name,
    stockId: s.id,
    tier: s.tier,
    kind: 'stock',
    canModify: true,
    subtitle: s.subtitle,
    dynamicRange: 'AUTO',
    grain: 'off',
    colorChrome: 'OFF',
    wbMode: 'auto',
    wbKelvin: 5600,
    wbRed: 0,
    wbBlue: 0,
    highlightTone: 0,
    shadowTone: 0,
    color: 0,
    sharpness: 0,
    noiseReduction: 0,
    clarity: 0,
    halation: 'off',
    monoFilter: 'STD',
    swatchGradient: vis.swatchGradient,
    grade: vis.grade,
    highlightTint: vis.highlightTint,
    shadowTint: vis.shadowTint,
  }
})

const curatedSubtitle = (stockId: AllStockId) =>
  OCULAR_FILM_STOCKS.find((s) => s.id === stockId)?.subtitle ?? ''

export const CURATED_PHONE_RECIPES: readonly PhoneRecipe[] = [
  OCULAR_CURATED_RECIPES.plainCamera,
  ...OCULAR_CURATED_RECIPES.curatedPresets,
].map((p) => {
  const vis = STOCK_VISUALS[p.stockId]
  return {
    id: p.id,
    slotCode: p.slotCode,
    name: p.name,
    stockId: p.stockId,
    tier: 'free',
    kind: p.isBuiltInPreset ? 'curated' : 'camera',
    canModify: p.canModify,
    subtitle: curatedSubtitle(p.stockId),
    dynamicRange: p.dynamicRange,
    grain: p.grain,
    colorChrome: p.colorChrome,
    wbMode: p.wbMode,
    wbKelvin: p.wbKelvin,
    wbRed: p.wbRed,
    wbBlue: p.wbBlue,
    highlightTone: p.highlightTone,
    shadowTone: p.shadowTone,
    color: p.color,
    sharpness: p.sharpness,
    noiseReduction: p.noiseReduction,
    clarity: p.clarity,
    halation: p.halation,
    monoFilter: p.monoFilter,
    swatchGradient: vis.swatchGradient,
    grade: vis.grade,
    highlightTint: vis.highlightTint,
    shadowTint: vis.shadowTint,
  }
})

export const ALL_PHONE_RECIPES: readonly PhoneRecipe[] = [...ALL_STOCK_RECIPES, ...CURATED_PHONE_RECIPES]

export const PHONE_RECIPE_MAP = Object.fromEntries(
  ALL_PHONE_RECIPES.map((r) => [r.id, r]),
) as Record<PhoneRecipeId, PhoneRecipe>

export const LENSES: readonly LensMm[] = OCULAR_HUD_SPEC.lenses.map((l) => l.mm) as LensMm[]

export const LENS_SCALE: Record<LensMm, number> = {
  13: 1.0,
  24: 1.12,
  28: 1.24,
  35: 1.42,
  50: 1.7,
  77: 2.08,
}

export const DR_MODES: readonly DrMode[] = ['DR100', 'DR200', 'DR400']
export const HUD_DR_MODES: readonly DrMode[] = OCULAR_HUD_SPEC.drModes

export const ASPECT_RATIOS: readonly { id: AspectId; label: string; pro?: boolean }[] = [
  { id: '4:3', label: '4:3' },
  { id: '3:2', label: '3:2' },
  { id: '1:1', label: '1:1' },
  { id: '16:9', label: '16:9' },
  { id: 'xpan', label: '65:24', pro: true },
]

export const GRAIN_LEVELS: readonly { id: GrainLevel; label: string; opacity: number }[] = [
  { id: 'off', label: 'OFF', opacity: 0 },
  { id: 'weak', label: 'WEAK', opacity: 0.14 },
  { id: 'strong', label: 'HIGH', opacity: 0.28 },
]

export const Q_GRAIN_OPACITY: Record<QGrainLevel, number> = {
  off: 0,
  weakSmall: 0.12,
  weakLarge: 0.17,
  strongSmall: 0.24,
  strongLarge: 0.3,
}

export const Q_GRAIN_CODE: Record<QGrainLevel, string> = {
  off: 'OFF',
  weakSmall: 'W-S',
  weakLarge: 'W-L',
  strongSmall: 'S-S',
  strongLarge: 'S-L',
}

export const RAW_FILTER = 'brightness(0.95) contrast(0.82) saturate(0.72)'

/** Combines film recipe grading, EV bias, DR highlight compression, and optional Q-Menu/WB adjustments. */
export function buildOpticalFilter(
  recipe: { grade: FilmGrade },
  ev: number,
  dr: DrMode,
  extras?: {
    highlightTone?: number
    shadowTone?: number
    colorSat?: number
    clarity?: number
    wbKelvin?: number
    wbRed?: number
    wbBlue?: number
  },
): string | undefined {
  const drContrast = dr === 'DR400' ? 0.93 : dr === 'DR200' ? 0.97 : 1.0
  const drBrightness = dr === 'DR400' ? 1.03 : dr === 'DR200' ? 1.015 : 1.0
  const evMult = Math.min(1.55, Math.max(0.55, Math.pow(2, ev * 0.35)))

  const ht = extras?.highlightTone ?? 0
  const st = extras?.shadowTone ?? 0
  const col = extras?.colorSat ?? 0
  const clar = extras?.clarity ?? 0
  const wbK = extras?.wbKelvin ?? 5600
  const wbR = extras?.wbRed ?? 0
  const wbB = extras?.wbBlue ?? 0

  const toneContrast = 1 + ht * 0.03 + st * 0.03 + clar * 0.025
  const toneBright = 1 + ht * 0.015 - st * 0.015
  const satMult = Math.max(0.2, 1 + col * 0.08)
  const warmBias = Math.max(0, (wbK - 5600) / 4400) * 0.22 + Math.max(0, wbR) * 0.015
  const hueShift = (wbB - wbR) * 1.4

  const brightness = recipe.grade.brightness * drBrightness * evMult * toneBright
  const contrast = recipe.grade.contrast * drContrast * toneContrast
  const saturate = recipe.grade.saturate * satMult
  const sepia = Math.min(1, recipe.grade.sepia + warmBias)
  const hueRotate = recipe.grade.hueRotate + hueShift

  const parts: string[] = []
  if (Math.abs(brightness - 1) > 0.002) parts.push(`brightness(${brightness.toFixed(3)})`)
  if (Math.abs(contrast - 1) > 0.002) parts.push(`contrast(${contrast.toFixed(3)})`)
  if (recipe.grade.grayscale > 0) parts.push(`grayscale(${recipe.grade.grayscale})`)
  if (sepia > 0.002) parts.push(`sepia(${sepia.toFixed(3)})`)
  if (Math.abs(saturate - 1) > 0.002) parts.push(`saturate(${saturate.toFixed(3)})`)
  if (Math.abs(hueRotate) > 0.2) parts.push(`hue-rotate(${hueRotate.toFixed(1)}deg)`)

  return parts.length > 0 ? parts.join(' ') : undefined
}

export function formatEv(ev: number): string {
  const rounded = Math.round(ev * 3) / 3
  if (Math.abs(rounded) < 0.05) return '+0.0'
  return `${rounded < 0 ? '−' : '+'}${Math.abs(rounded).toFixed(1)}`
}

export function formatToneSummary(ht: number, st: number): string {
  if (Math.abs(ht) < 0.05 && Math.abs(st) < 0.05) return '0 / 0'
  const h = Math.round(ht)
  const s = Math.round(st)
  return `H${h >= 0 ? `+${h}` : h} S${s >= 0 ? `+${s}` : s}`
}
