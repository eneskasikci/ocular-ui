export type FilmId = 'std' | 'cc' | 'ac' | 'cn' | 'nn' | 'vv' | 'sep'
export type DrMode = 'DR100' | 'DR200' | 'DR400'
export type AspectId = '4:3' | '3:2' | '1:1' | '16:9' | 'xpan'
export type GrainLevel = 'off' | 'weak' | 'strong'
export type LensMm = 13 | 24 | 28 | 35 | 50 | 77

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
  grade: {
    brightness: number
    contrast: number
    saturate: number
    sepia: number
    grayscale: number
    hueRotate: number
  }
  highlightTint?: {
    background: string
    blendMode: 'soft-light' | 'screen' | 'overlay'
    opacity: number
  }
  shadowTint?: {
    background: string
    blendMode: 'multiply' | 'soft-light' | 'color'
    opacity: number
  }
}

export const RECIPES: readonly FilmRecipe[] = [
  {
    id: 'std',
    code: 'STD',
    name: 'Standard',
    tier: 'free',
    summary: 'Balanced true-to-life color',
    wb: '5600K',
    wbShort: '5600K',
    tone: '0 / 0',
    defaultDr: 'DR100',
    defaultGrain: 'off',
    defaultHalation: false,
    swatch: ['#3c5a78', '#b84336', '#d8cbb8'],
    grade: { brightness: 1.0, contrast: 1.0, saturate: 1.0, sepia: 0, grayscale: 0, hueRotate: 0 },
  },
  {
    id: 'cc',
    code: 'CC',
    name: 'Calm Chrome',
    tier: 'free',
    summary: 'Muted documentary chrome',
    wb: '5800K −1/+2',
    wbShort: '5800K',
    tone: 'H-1 S+1',
    defaultDr: 'DR100',
    defaultGrain: 'weak',
    defaultHalation: false,
    swatch: ['#435160', '#7c6f64', '#b9ad99'],
    grade: { brightness: 1.02, contrast: 1.14, saturate: 0.84, sepia: 0, grayscale: 0, hueRotate: -2 },
    highlightTint: {
      background: 'linear-gradient(180deg, rgba(232,238,246,0.24), rgba(242,235,222,0.10) 55%, transparent)',
      blendMode: 'soft-light',
      opacity: 0.30,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(28,54,78,0.44), rgba(44,68,90,0.14) 55%, transparent)',
      blendMode: 'soft-light',
      opacity: 0.34,
    },
  },
  {
    id: 'ac',
    code: 'AC',
    name: 'Ash Charcoal',
    tier: 'free',
    summary: 'Fine silver monochrome',
    wb: 'MONO 0/0',
    wbShort: 'MONO',
    tone: 'H+1 S+2',
    defaultDr: 'DR200',
    defaultGrain: 'weak',
    defaultHalation: false,
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
      opacity: 0.20,
    },
  },
  {
    id: 'cn',
    code: 'CN',
    name: 'Color Negative',
    tier: 'pro',
    summary: 'Teal shadows, nostalgic punch',
    wb: '6000K +2/−3',
    wbShort: '6000K',
    tone: 'H-1 S+2',
    defaultDr: 'DR200',
    defaultGrain: 'strong',
    defaultHalation: true,
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
  {
    id: 'nn',
    code: 'NN',
    name: 'Nouveau Negative',
    tier: 'pro',
    summary: 'Amber highs, cinema shadows',
    wb: '6200K +3/−4',
    wbShort: '6200K',
    tone: 'H-2 S+1',
    defaultDr: 'DR200',
    defaultGrain: 'weak',
    defaultHalation: true,
    swatch: ['#4d1a27', '#a65e38', '#e8a65a'],
    grade: { brightness: 1.01, contrast: 1.10, saturate: 0.92, sepia: 0.14, grayscale: 0, hueRotate: -6 },
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
  {
    id: 'vv',
    code: 'VV',
    name: 'Vivid Valley',
    tier: 'pro',
    summary: 'Deep landscape saturation',
    wb: '5400K +1/−1',
    wbShort: '5400K',
    tone: 'H+1 S+1',
    defaultDr: 'DR100',
    defaultGrain: 'off',
    defaultHalation: false,
    swatch: ['#1a4f7a', '#24a876', '#e07a32'],
    grade: { brightness: 1.0, contrast: 1.10, saturate: 1.35, sepia: 0, grayscale: 0, hueRotate: 2 },
    highlightTint: {
      background: 'linear-gradient(180deg, rgba(255,222,158,0.28), transparent 55%)',
      blendMode: 'soft-light',
      opacity: 0.20,
    },
    shadowTint: {
      background: 'linear-gradient(0deg, rgba(16,38,62,0.5), transparent 70%)',
      blendMode: 'multiply',
      opacity: 0.18,
    },
  },
  {
    id: 'sep',
    code: 'SEP',
    name: 'Sepia Warm',
    tier: 'pro',
    summary: 'Archival silver-gelatin print',
    wb: 'ARCHIVAL',
    wbShort: 'WARM',
    tone: 'H-1 S+1',
    defaultDr: 'DR200',
    defaultGrain: 'strong',
    defaultHalation: false,
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
      opacity: 0.20,
    },
  },
] as const

export const RECIPE_MAP: Record<FilmId, FilmRecipe> = {
  std: RECIPES[0],
  cc: RECIPES[1],
  ac: RECIPES[2],
  cn: RECIPES[3],
  nn: RECIPES[4],
  vv: RECIPES[5],
  sep: RECIPES[6],
}

export const LENSES: readonly LensMm[] = [13, 24, 28, 35, 50, 77]

export const LENS_SCALE: Record<LensMm, number> = {
  13: 1.0,
  24: 1.12,
  28: 1.24,
  35: 1.42,
  50: 1.7,
  77: 2.08,
}

export const DR_MODES: readonly DrMode[] = ['DR100', 'DR200', 'DR400']

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

export const RAW_FILTER = 'brightness(0.95) contrast(0.82) saturate(0.72)'

/** Combines film recipe grading, EV bias, and DR highlight compression into a GPU filter string. */
export function buildOpticalFilter(recipe: FilmRecipe, ev: number, dr: DrMode): string {
  const drContrast = dr === 'DR400' ? 0.93 : dr === 'DR200' ? 0.97 : 1.0
  const drBrightness = dr === 'DR400' ? 1.03 : dr === 'DR200' ? 1.015 : 1.0
  const evMult = Math.min(1.55, Math.max(0.55, Math.pow(2, ev * 0.35)))
  const brightness = recipe.grade.brightness * drBrightness * evMult
  const contrast = recipe.grade.contrast * drContrast

  return [
    `brightness(${brightness.toFixed(3)})`,
    `contrast(${contrast.toFixed(3)})`,
    `grayscale(${recipe.grade.grayscale})`,
    `sepia(${recipe.grade.sepia})`,
    `saturate(${recipe.grade.saturate})`,
    `hue-rotate(${recipe.grade.hueRotate}deg)`,
  ].join(' ')
}

export function formatEv(ev: number): string {
  const rounded = Math.round(ev * 3) / 3
  if (Math.abs(rounded) < 0.05) return '+0.0'
  return `${rounded < 0 ? '−' : '+'}${Math.abs(rounded).toFixed(1)}`
}
