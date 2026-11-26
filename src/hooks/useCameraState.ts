import { useCallback, useMemo, useRef, useState } from 'react'
import { PHOTO_MAP, PHOTOS, type PhotoAsset, type PhotoId } from '../data/photos'
import {
  ALL_PHONE_RECIPES,
  ASPECT_RATIOS,
  DR_MODES,
  GRAIN_LEVELS,
  HUD_DR_MODES,
  PHONE_RECIPE_MAP,
  RECIPE_MAP,
  type AspectId,
  type ColorChromeLevel,
  type DrMode,
  type FilmId,
  type FilmRecipe,
  type FlashMode,
  type FramingGuideMode,
  type GrainLevel,
  type HalationLevel,
  type LensMm,
  type MonochromeFilter,
  type PhoneRecipe,
  type PhoneRecipeId,
  type QGrainLevel,
} from '../data/recipes'
import { OCULAR_CURATED_RECIPES, OCULAR_HUD_SPEC } from '../generated/ocularSpec'

export type HudLayout = 'free' | 'pro'
export type ActiveExposureControl = 'shutterSpeed' | 'iso' | 'ev' | 'whiteBalance'

const Q_GRAIN_ORDER: readonly QGrainLevel[] = ['off', 'weakSmall', 'weakLarge', 'strongSmall', 'strongLarge']
const HALATION_ORDER: readonly HalationLevel[] = ['off', 'weak', 'strong']
const MONO_ORDER: readonly MonochromeFilter[] = OCULAR_HUD_SPEC.monoFilters.map((m) => m.id) as MonochromeFilter[]
const CC_ORDER: readonly ColorChromeLevel[] = ['OFF', 'WEAK', 'STRG']
const FLASH_ORDER: readonly FlashMode[] = OCULAR_HUD_SPEC.flashModes as unknown as FlashMode[]
const GUIDE_ORDER: readonly FramingGuideMode[] = ['clean', 'ruleOfThirds', 'rangefinder']

const DEFAULT_FREE_PINS: PhoneRecipeId[] = OCULAR_CURATED_RECIPES.defaultPinnedDialCodes.map(
  (c) => c.toLowerCase() as PhoneRecipeId,
)
const DEFAULT_PRO_PINS: PhoneRecipeId[] = [
  'std',
  'cc',
  'ac',
  'cn',
  'nn',
  'vv',
  'sep',
  'r1',
  'r2',
  'r3',
]

function toSimpleGrain(q: QGrainLevel): GrainLevel {
  if (q === 'off') return 'off'
  if (q === 'weakSmall' || q === 'weakLarge') return 'weak'
  return 'strong'
}

function toQGrain(g: GrainLevel): QGrainLevel {
  if (g === 'off') return 'off'
  if (g === 'weak') return 'weakSmall'
  return 'strongLarge'
}

function isFeaturedFilmId(id: string): id is FilmId {
  return id in RECIPE_MAP
}

export interface CameraController {
  photo: PhotoAsset
  photoIndex: number
  recipe: FilmRecipe
  filmId: FilmId
  phoneRecipe: PhoneRecipe
  phoneRecipeId: PhoneRecipeId
  lens: LensMm
  ev: number
  dr: DrMode
  aspect: AspectId
  grain: GrainLevel
  qGrain: QGrainLevel
  colorChrome: ColorChromeLevel
  halation: boolean
  halationLevel: HalationLevel
  monoFilter: MonochromeFilter
  shutterSpeed: string
  iso: string
  wbMode: string
  wbKelvin: number
  wbRed: number
  wbBlue: number
  highlightTone: number
  shadowTone: number
  colorSat: number
  sharpness: number
  noiseReduction: number
  clarity: number
  flashMode: FlashMode
  framingGuide: FramingGuideMode
  pinnedDialIds: readonly PhoneRecipeId[]
  rawCompare: boolean
  rawSplit: number
  shotCount: number
  shutterFlash: boolean
  exifToast: string | null
  dynamicIslandStatus: { badge: string; title: string } | null
  focusKey: number
  focusPoint: { x: number; y: number; locked: boolean }
  hudLayout: HudLayout
  selectPhoto: (id: PhotoId) => void
  stepPhoto: (dir: -1 | 1) => void
  selectFilm: (id: FilmId) => void
  selectPhoneRecipe: (id: PhoneRecipeId) => void
  cycleRecipe: () => void
  selectLens: (mm: LensMm) => void
  setEv: (ev: number) => void
  setDr: (dr: DrMode) => void
  cycleDr: () => void
  cycleHudDr: () => void
  setAspect: (aspect: AspectId) => void
  cycleAspect: () => void
  setGrain: (grain: GrainLevel) => void
  cycleGrain: () => void
  cycleQGrain: () => void
  cycleColorChrome: () => void
  toggleHalation: () => void
  cycleHalationLevel: () => void
  cycleMonoFilter: () => void
  setShutterSpeed: (val: string) => void
  setIso: (val: string) => void
  setWbMode: (modeId: string) => void
  setWbKelvin: (kelvin: number) => void
  setWbShift: (red: number, blue: number) => void
  resetWhiteBalance: () => void
  setRecipeParam: (key: 'highlightTone' | 'shadowTone' | 'colorSat' | 'sharpness' | 'noiseReduction' | 'clarity', val: number) => void
  resetRecipeParam: (key: string) => void
  resetAllRecipeAdjustments: () => void
  cycleFlashMode: () => void
  cycleFramingGuide: () => void
  toggleDialPin: (id: PhoneRecipeId) => void
  toggleRawCompare: () => void
  setRawSplit: (val: number) => void
  selectFilmForRaw: (id: FilmId) => void
  setHudLayout: (next: HudLayout) => void
  setFocusPoint: (pt: { x: number; y: number; locked: boolean }) => void
  triggerShutter: () => void
}

/** Shared camera state and actions driving the interactive phone, panels, and hero. */
export function useCameraState(isRawActive: boolean): CameraController {
  const [photoId, setPhotoId] = useState<PhotoId>('boulevard')
  const [filmId, setFilmId] = useState<FilmId>('std')
  const [phoneRecipeId, setPhoneRecipeId] = useState<PhoneRecipeId>('std')
  const [lens, setLens] = useState<LensMm>(24)
  const [ev, setEv] = useState<number>(0)
  const [dr, setDr] = useState<DrMode>('AUTO')
  const [aspect, setAspect] = useState<AspectId>('4:3')
  const [qGrain, setQGrain] = useState<QGrainLevel>('off')
  const [colorChrome, setColorChrome] = useState<ColorChromeLevel>('OFF')
  const [halationLevel, setHalationLevel] = useState<HalationLevel>('off')
  const [monoFilter, setMonoFilter] = useState<MonochromeFilter>('STD')
  const [shutterSpeed, setShutterSpeed] = useState<string>('AUTO')
  const [iso, setIso] = useState<string>('AUTO')
  const [wbMode, setWbModeState] = useState<string>('auto')
  const [wbKelvin, setWbKelvinState] = useState<number>(5600)
  const [wbRed, setWbRed] = useState<number>(0)
  const [wbBlue, setWbBlue] = useState<number>(0)
  const [highlightTone, setHighlightTone] = useState<number>(0)
  const [shadowTone, setShadowTone] = useState<number>(0)
  const [colorSat, setColorSat] = useState<number>(0)
  const [sharpness, setSharpness] = useState<number>(0)
  const [noiseReduction, setNoiseReduction] = useState<number>(0)
  const [clarity, setClarity] = useState<number>(0)
  const [flashMode, setFlashMode] = useState<FlashMode>('OFF')
  const [framingGuide, setFramingGuide] = useState<FramingGuideMode>('rangefinder')
  const [customPins, setCustomPins] = useState<PhoneRecipeId[] | null>(null)
  const [rawCompareOverride, setRawCompareOverride] = useState<boolean | null>(null)
  const [rawSplit, setRawSplit] = useState<number>(46)
  const [shotCount, setShotCount] = useState<number>(1)
  const [shutterFlash, setShutterFlash] = useState<boolean>(false)
  const [exifToast, setExifToast] = useState<string | null>(null)
  const [dynamicIslandStatus, setDynamicIslandStatus] = useState<{ badge: string; title: string } | null>(null)
  const [focusKey, setFocusKey] = useState<number>(0)
  const [focusPoint, setFocusPointState] = useState<{ x: number; y: number; locked: boolean }>({
    x: 50,
    y: 50,
    locked: false,
  })
  const [hudLayout, setHudLayoutState] = useState<HudLayout>('free')

  const flashTimer = useRef<number | null>(null)
  const toastTimer = useRef<number | null>(null)

  const photoIndex = Math.max(0, PHOTOS.findIndex((p) => p.id === photoId))
  const photo = PHOTO_MAP[photoId]
  const recipe = RECIPE_MAP[filmId]
  const phoneRecipe = PHONE_RECIPE_MAP[phoneRecipeId] ?? PHONE_RECIPE_MAP.std
  const grain = toSimpleGrain(qGrain)
  const halation = halationLevel !== 'off'
  const rawCompare = rawCompareOverride ?? isRawActive
  const pinnedDialIds = useMemo(
    () => customPins ?? (hudLayout === 'pro' ? DEFAULT_PRO_PINS : DEFAULT_FREE_PINS),
    [customPins, hudLayout],
  )

  const applyPhoneDefaults = useCallback((next: PhoneRecipe) => {
    setDr(next.dynamicRange)
    setQGrain(next.grain)
    setColorChrome(next.colorChrome)
    setWbModeState(next.wbMode)
    setWbKelvinState(next.wbKelvin)
    setWbRed(next.wbRed)
    setWbBlue(next.wbBlue)
    setHighlightTone(next.highlightTone)
    setShadowTone(next.shadowTone)
    setColorSat(next.color)
    setSharpness(next.sharpness)
    setNoiseReduction(next.noiseReduction)
    setClarity(next.clarity)
    setHalationLevel(next.halation)
    setMonoFilter(next.monoFilter)
  }, [])

  const selectPhoto = useCallback((id: PhotoId) => {
    setPhotoId(id)
    setFocusKey((k) => k + 1)
  }, [])

  const stepPhoto = useCallback(
    (dir: -1 | 1) => {
      const nextIdx = (photoIndex + dir + PHOTOS.length) % PHOTOS.length
      selectPhoto(PHOTOS[nextIdx].id)
    },
    [photoIndex, selectPhoto],
  )

  const selectPhoneRecipe = useCallback(
    (id: PhoneRecipeId) => {
      const next = PHONE_RECIPE_MAP[id] ?? PHONE_RECIPE_MAP.std
      setPhoneRecipeId(next.id)
      const mappedFilm = isFeaturedFilmId(next.stockId) ? next.stockId : 'std'
      setFilmId(mappedFilm)
      applyPhoneDefaults(next)
    },
    [applyPhoneDefaults],
  )

  const selectFilm = useCallback(
    (id: FilmId) => {
      const next = RECIPE_MAP[id]
      setFilmId(id)
      setPhoneRecipeId(id)
      const pr = PHONE_RECIPE_MAP[id]
      if (pr) {
        applyPhoneDefaults(pr)
      }
      setDr(next.defaultDr)
      setQGrain(toQGrain(next.defaultGrain))
      setHalationLevel(next.defaultHalation ? 'weak' : 'off')
    },
    [applyPhoneDefaults],
  )

  const cycleRecipe = useCallback(() => {
    const idx = pinnedDialIds.indexOf(phoneRecipeId)
    const nextId = pinnedDialIds[(idx + 1 + pinnedDialIds.length) % pinnedDialIds.length]
    selectPhoneRecipe(nextId)
  }, [phoneRecipeId, pinnedDialIds, selectPhoneRecipe])

  const selectLens = useCallback((mm: LensMm) => {
    setLens(mm)
    setFocusKey((k) => k + 1)
  }, [])

  const cycleDr = useCallback(() => {
    const idx = DR_MODES.indexOf(dr)
    setDr(DR_MODES[(idx + 1) % DR_MODES.length])
  }, [dr])

  const cycleHudDr = useCallback(() => {
    const idx = HUD_DR_MODES.indexOf(dr)
    setDr(HUD_DR_MODES[(idx + 1) % HUD_DR_MODES.length])
  }, [dr])

  const cycleAspect = useCallback(() => {
    const idx = ASPECT_RATIOS.findIndex((r) => r.id === aspect)
    setAspect(ASPECT_RATIOS[(idx + 1) % ASPECT_RATIOS.length].id)
  }, [aspect])

  const setGrain = useCallback((g: GrainLevel) => {
    setQGrain(toQGrain(g))
  }, [])

  const cycleGrain = useCallback(() => {
    const idx = GRAIN_LEVELS.findIndex((g) => g.id === grain)
    setQGrain(toQGrain(GRAIN_LEVELS[(idx + 1) % GRAIN_LEVELS.length].id))
  }, [grain])

  const cycleQGrain = useCallback(() => {
    const idx = Q_GRAIN_ORDER.indexOf(qGrain)
    setQGrain(Q_GRAIN_ORDER[(idx + 1) % Q_GRAIN_ORDER.length])
  }, [qGrain])

  const cycleColorChrome = useCallback(() => {
    const idx = CC_ORDER.indexOf(colorChrome)
    setColorChrome(CC_ORDER[(idx + 1) % CC_ORDER.length])
  }, [colorChrome])

  const toggleHalation = useCallback(() => {
    setHalationLevel((v) => (v === 'off' ? 'weak' : 'off'))
  }, [])

  const cycleHalationLevel = useCallback(() => {
    const idx = HALATION_ORDER.indexOf(halationLevel)
    setHalationLevel(HALATION_ORDER[(idx + 1) % HALATION_ORDER.length])
  }, [halationLevel])

  const cycleMonoFilter = useCallback(() => {
    const idx = MONO_ORDER.indexOf(monoFilter)
    setMonoFilter(MONO_ORDER[(idx + 1) % MONO_ORDER.length])
  }, [monoFilter])

  const setWbMode = useCallback((modeId: string) => {
    const mode = OCULAR_HUD_SPEC.wbModes.find((m) => m.id === modeId)
    setWbModeState(modeId)
    if (mode && modeId !== 'kelvin') {
      setWbKelvinState(mode.baseKelvin)
    }
  }, [])

  const setWbKelvin = useCallback((k: number) => {
    setWbModeState('kelvin')
    setWbKelvinState(Math.round(k / 100) * 100)
  }, [])

  const setWbShift = useCallback((r: number, b: number) => {
    setWbRed(Math.max(-9, Math.min(9, r)))
    setWbBlue(Math.max(-9, Math.min(9, b)))
  }, [])

  const resetWhiteBalance = useCallback(() => {
    setWbModeState('auto')
    setWbKelvinState(5600)
    setWbRed(0)
    setWbBlue(0)
  }, [])

  const setRecipeParam = useCallback(
    (key: 'highlightTone' | 'shadowTone' | 'colorSat' | 'sharpness' | 'noiseReduction' | 'clarity', val: number) => {
      switch (key) {
        case 'highlightTone':
          setHighlightTone(val)
          break
        case 'shadowTone':
          setShadowTone(val)
          break
        case 'colorSat':
          setColorSat(val)
          break
        case 'sharpness':
          setSharpness(val)
          break
        case 'noiseReduction':
          setNoiseReduction(val)
          break
        case 'clarity':
          setClarity(val)
          break
      }
    },
    [],
  )

  const resetRecipeParam = useCallback(
    (key: string) => {
      switch (key) {
        case 'base':
          selectPhoneRecipe('std')
          break
        case 'dynamicRange':
          setDr('AUTO')
          break
        case 'colorChrome':
          setColorChrome('OFF')
          break
        case 'grain':
          setQGrain('off')
          break
        case 'whiteBalance':
          resetWhiteBalance()
          break
        case 'wbShift':
          setWbRed(0)
          setWbBlue(0)
          break
        case 'highlightTone':
          setHighlightTone(0)
          break
        case 'shadowTone':
          setShadowTone(0)
          break
        case 'color':
          setColorSat(0)
          break
        case 'sharpness':
          setSharpness(0)
          break
        case 'noiseReduction':
          setNoiseReduction(0)
          break
        case 'clarity':
          setClarity(0)
          break
      }
    },
    [resetWhiteBalance, selectPhoneRecipe],
  )

  const resetAllRecipeAdjustments = useCallback(() => {
    if (!phoneRecipe.canModify) return
    setDr('AUTO')
    setQGrain('off')
    setColorChrome('OFF')
    resetWhiteBalance()
    setHighlightTone(0)
    setShadowTone(0)
    setColorSat(0)
    setSharpness(0)
    setNoiseReduction(0)
    setClarity(0)
    setHalationLevel('off')
    setMonoFilter('STD')
    setEv(0)
    if (phoneRecipe.kind === 'stock') {
      setPhoneRecipeId('std')
      setFilmId('std')
    }
  }, [phoneRecipe.canModify, phoneRecipe.kind, resetWhiteBalance])

  const cycleFlashMode = useCallback(() => {
    const idx = FLASH_ORDER.indexOf(flashMode)
    setFlashMode(FLASH_ORDER[(idx + 1) % FLASH_ORDER.length])
  }, [flashMode])

  const cycleFramingGuide = useCallback(() => {
    const idx = GUIDE_ORDER.indexOf(framingGuide)
    setFramingGuide(GUIDE_ORDER[(idx + 1) % GUIDE_ORDER.length])
  }, [framingGuide])

  const toggleDialPin = useCallback(
    (id: PhoneRecipeId) => {
      setCustomPins((prev) => {
        const current = prev ?? (hudLayout === 'pro' ? DEFAULT_PRO_PINS : DEFAULT_FREE_PINS)
        if (current.includes(id)) {
          return current.length > 1 ? current.filter((x) => x !== id) : current
        }
        if (current.length >= 10) return current
        return [...current, id]
      })
    },
    [hudLayout],
  )

  const toggleRawCompare = useCallback(() => {
    setRawCompareOverride((prev) => !(prev ?? isRawActive))
  }, [isRawActive])

  const setHudLayout = useCallback(
    (next: HudLayout) => {
      setHudLayoutState(next)
      if (next === 'free' && !isRawActive) {
        setRawCompareOverride(null)
      }
    },
    [isRawActive],
  )

  const handleRawSplit = useCallback((val: number) => {
    setRawCompareOverride((prev) => prev ?? true)
    setRawSplit(val)
  }, [])

  const selectFilmForRaw = useCallback(
    (id: FilmId) => {
      setRawCompareOverride((prev) => prev ?? true)
      selectFilm(id)
    },
    [selectFilm],
  )

  const setFocusPoint = useCallback((pt: { x: number; y: number; locked: boolean }) => {
    setFocusPointState(pt)
    setFocusKey((k) => k + 1)
  }, [])

  const triggerShutter = useCallback(() => {
    setShutterFlash(true)
    setShotCount((n) => n + 1)
    const ratioLabel = aspect === 'xpan' ? '65:24' : aspect
    const summary = `${phoneRecipe.slotCode} · ${lens}MM · ${dr} · ${ratioLabel}`
    setExifToast(summary)
    setDynamicIslandStatus({
      badge: phoneRecipe.slotCode,
      title: hudLayout === 'pro' ? `SAVED HEIC+RAW · ${lens}MM` : `SAVED · ${lens}MM · ${ratioLabel}`,
    })
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    flashTimer.current = window.setTimeout(() => setShutterFlash(false), 110)
    toastTimer.current = window.setTimeout(() => {
      setExifToast(null)
      setDynamicIslandStatus(null)
    }, 1900)
  }, [aspect, dr, hudLayout, lens, phoneRecipe.slotCode])

  return useMemo(
    () => ({
      photo,
      photoIndex,
      recipe,
      filmId,
      phoneRecipe,
      phoneRecipeId,
      lens,
      ev,
      dr,
      aspect,
      grain,
      qGrain,
      colorChrome,
      halation,
      halationLevel,
      monoFilter,
      shutterSpeed,
      iso,
      wbMode,
      wbKelvin,
      wbRed,
      wbBlue,
      highlightTone,
      shadowTone,
      colorSat,
      sharpness,
      noiseReduction,
      clarity,
      flashMode,
      framingGuide,
      pinnedDialIds,
      rawCompare,
      rawSplit,
      shotCount,
      shutterFlash,
      exifToast,
      dynamicIslandStatus,
      focusKey,
      focusPoint,
      hudLayout,
      selectPhoto,
      stepPhoto,
      selectFilm,
      selectPhoneRecipe,
      cycleRecipe,
      selectLens,
      setEv,
      setDr,
      cycleDr,
      cycleHudDr,
      setAspect,
      cycleAspect,
      setGrain,
      cycleGrain,
      cycleQGrain,
      cycleColorChrome,
      toggleHalation,
      cycleHalationLevel,
      cycleMonoFilter,
      setShutterSpeed,
      setIso,
      setWbMode,
      setWbKelvin,
      setWbShift,
      resetWhiteBalance,
      setRecipeParam,
      resetRecipeParam,
      resetAllRecipeAdjustments,
      cycleFlashMode,
      cycleFramingGuide,
      toggleDialPin,
      toggleRawCompare,
      setRawSplit: handleRawSplit,
      selectFilmForRaw,
      setHudLayout,
      setFocusPoint,
      triggerShutter,
    }),
    [
      photo,
      photoIndex,
      recipe,
      filmId,
      phoneRecipe,
      phoneRecipeId,
      lens,
      ev,
      dr,
      aspect,
      grain,
      qGrain,
      colorChrome,
      halation,
      halationLevel,
      monoFilter,
      shutterSpeed,
      iso,
      wbMode,
      wbKelvin,
      wbRed,
      wbBlue,
      highlightTone,
      shadowTone,
      colorSat,
      sharpness,
      noiseReduction,
      clarity,
      flashMode,
      framingGuide,
      pinnedDialIds,
      rawCompare,
      rawSplit,
      shotCount,
      shutterFlash,
      exifToast,
      dynamicIslandStatus,
      focusKey,
      focusPoint,
      hudLayout,
      selectPhoto,
      stepPhoto,
      selectFilm,
      selectPhoneRecipe,
      cycleRecipe,
      selectLens,
      setEv,
      setDr,
      cycleDr,
      cycleHudDr,
      setAspect,
      cycleAspect,
      setGrain,
      cycleGrain,
      cycleQGrain,
      cycleColorChrome,
      toggleHalation,
      cycleHalationLevel,
      cycleMonoFilter,
      setShutterSpeed,
      setIso,
      setWbMode,
      setWbKelvin,
      setWbShift,
      resetWhiteBalance,
      setRecipeParam,
      resetRecipeParam,
      resetAllRecipeAdjustments,
      cycleFlashMode,
      cycleFramingGuide,
      toggleDialPin,
      toggleRawCompare,
      handleRawSplit,
      selectFilmForRaw,
      setHudLayout,
      setFocusPoint,
      triggerShutter,
    ],
  )
}

export { ALL_PHONE_RECIPES }
