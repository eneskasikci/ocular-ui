import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PHOTO_MAP, PHOTOS, type PhotoAsset, type PhotoId } from '../data/photos'
import {
  ASPECT_RATIOS,
  DR_MODES,
  GRAIN_LEVELS,
  RECIPE_MAP,
  RECIPES,
  type AspectId,
  type DrMode,
  type FilmId,
  type FilmRecipe,
  type GrainLevel,
  type LensMm,
} from '../data/recipes'

export type HudLayout = 'free' | 'pro'

export interface CameraController {
  photo: PhotoAsset
  photoIndex: number
  recipe: FilmRecipe
  filmId: FilmId
  lens: LensMm
  ev: number
  dr: DrMode
  aspect: AspectId
  grain: GrainLevel
  halation: boolean
  rawCompare: boolean
  rawSplit: number
  shotCount: number
  shutterFlash: boolean
  exifToast: string | null
  focusKey: number
  hudLayout: HudLayout
  selectPhoto: (id: PhotoId) => void
  stepPhoto: (dir: -1 | 1) => void
  selectFilm: (id: FilmId) => void
  cycleRecipe: () => void
  selectLens: (mm: LensMm) => void
  setEv: (ev: number) => void
  setDr: (dr: DrMode) => void
  cycleDr: () => void
  setAspect: (aspect: AspectId) => void
  cycleAspect: () => void
  setGrain: (grain: GrainLevel) => void
  cycleGrain: () => void
  toggleHalation: () => void
  toggleRawCompare: () => void
  setRawSplit: (val: number) => void
  selectFilmForRaw: (id: FilmId) => void
  setHudLayout: (next: HudLayout) => void
  triggerShutter: () => void
}

/** Shared camera state and actions driving the interactive phone, panels, and hero. */
export function useCameraState(isRawActive: boolean): CameraController {
  const [photoId, setPhotoId] = useState<PhotoId>('boulevard')
  const [filmId, setFilmId] = useState<FilmId>('std')
  const [lens, setLens] = useState<LensMm>(24)
  const [ev, setEv] = useState<number>(0)
  const [dr, setDr] = useState<DrMode>('DR100')
  const [aspect, setAspect] = useState<AspectId>('4:3')
  const [grain, setGrain] = useState<GrainLevel>('off')
  const [halation, setHalation] = useState<boolean>(false)
  const [rawCompareOverride, setRawCompareOverride] = useState<boolean | null>(null)
  const [rawSplit, setRawSplit] = useState<number>(46)
  const [shotCount, setShotCount] = useState<number>(1)
  const [shutterFlash, setShutterFlash] = useState<boolean>(false)
  const [exifToast, setExifToast] = useState<string | null>(null)
  const [focusKey, setFocusKey] = useState<number>(0)
  const [hudLayout, setHudLayoutState] = useState<HudLayout>('free')

  const flashTimer = useRef<number | null>(null)
  const toastTimer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (flashTimer.current) window.clearTimeout(flashTimer.current)
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    }
  }, [])

  const photoIndex = Math.max(0, PHOTOS.findIndex((p) => p.id === photoId))
  const photo = PHOTO_MAP[photoId]
  const recipe = RECIPE_MAP[filmId]
  const rawCompare = rawCompareOverride ?? isRawActive

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

  const selectFilm = useCallback((id: FilmId) => {
    const next = RECIPE_MAP[id]
    setFilmId(id)
    setDr(next.defaultDr)
    setGrain(next.defaultGrain)
    setHalation(next.defaultHalation)
  }, [])

  const cycleRecipe = useCallback(() => {
    const idx = RECIPES.findIndex((r) => r.id === filmId)
    selectFilm(RECIPES[(idx + 1) % RECIPES.length].id)
  }, [filmId, selectFilm])

  const selectLens = useCallback((mm: LensMm) => {
    setLens(mm)
    setFocusKey((k) => k + 1)
  }, [])

  const cycleDr = useCallback(() => {
    const idx = DR_MODES.indexOf(dr)
    setDr(DR_MODES[(idx + 1) % DR_MODES.length])
  }, [dr])

  const cycleAspect = useCallback(() => {
    const idx = ASPECT_RATIOS.findIndex((r) => r.id === aspect)
    setAspect(ASPECT_RATIOS[(idx + 1) % ASPECT_RATIOS.length].id)
  }, [aspect])

  const cycleGrain = useCallback(() => {
    const idx = GRAIN_LEVELS.findIndex((g) => g.id === grain)
    setGrain(GRAIN_LEVELS[(idx + 1) % GRAIN_LEVELS.length].id)
  }, [grain])

  const toggleHalation = useCallback(() => setHalation((v) => !v), [])

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

  const triggerShutter = useCallback(() => {
    setShutterFlash(true)
    setShotCount((n) => n + 1)
    const ratioLabel = aspect === 'xpan' ? '65:24' : aspect
    setExifToast(`${recipe.code} · ${lens}MM · ${dr} · ${ratioLabel}`)
    if (flashTimer.current) window.clearTimeout(flashTimer.current)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    flashTimer.current = window.setTimeout(() => setShutterFlash(false), 110)
    toastTimer.current = window.setTimeout(() => setExifToast(null), 1900)
  }, [aspect, dr, lens, recipe.code])

  // Stable identity lets memoized panels skip renders that only change the deck step.
  return useMemo(
    () => ({
      photo,
      photoIndex,
      recipe,
      filmId,
      lens,
      ev,
      dr,
      aspect,
      grain,
      halation,
      rawCompare,
      rawSplit,
      shotCount,
      shutterFlash,
      exifToast,
      focusKey,
      hudLayout,
      selectPhoto,
      stepPhoto,
      selectFilm,
      cycleRecipe,
      selectLens,
      setEv,
      setDr,
      cycleDr,
      setAspect,
      cycleAspect,
      setGrain,
      cycleGrain,
      toggleHalation,
      toggleRawCompare,
      setRawSplit: handleRawSplit,
      selectFilmForRaw,
      setHudLayout,
      triggerShutter,
    }),
    [photo, photoIndex, recipe, filmId, lens, ev, dr, aspect, grain, halation, rawCompare, rawSplit, shotCount, shutterFlash, exifToast, focusKey, hudLayout, selectPhoto, stepPhoto, selectFilm, cycleRecipe, selectLens, setEv, setDr, cycleDr, setAspect, cycleAspect, setGrain, cycleGrain, toggleHalation, toggleRawCompare, handleRawSplit, selectFilmForRaw, setHudLayout, triggerShutter],
  )
}
