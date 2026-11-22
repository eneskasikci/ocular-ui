import { useCallback, useEffect, useRef } from 'react'
import { SCENES } from '../config'

// Mirrors minimalistscreens.com's scroll-stop controller:
// smooth native window scrolling between stops with inertia tail suppression and zero queued double-steps.
const POST_SETTLE_COOLDOWN_MS = 300
const INERTIA_GAP_MS = 600
const MOUSE_DETENT_MIN = 50
const INERTIA_WINDOW_MS = 3000
const FALLBACK_SETTLE_MS = 900
const STOP_EPS_PX = 3

const DEFAULT_SCENE_IDS = SCENES.map((s) => s.id)

function measureStops(sceneIds: readonly string[]): number[] | null {
  const tops: number[] = []
  for (const id of sceneIds) {
    const el = document.getElementById(id)
    if (!el) return null
    tops.push(el.getBoundingClientRect().top + window.scrollY)
  }
  return tops
}

function getNearestStep(tops: number[]): number {
  const y = window.scrollY
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < tops.length; i++) {
    const dist = Math.abs(tops[i] - y)
    if (dist < bestDist) {
      bestDist = dist
      best = i
    }
  }
  return best
}

interface WheelInertiaSample {
  dir: -1 | 1
  lastDir: -1 | 0 | 1
  ts: number
  lastTriggerTime: number
  lastEventTime: number
  absDelta: number
  lastAbsDelta: number
}

function isWheelInertia({
  dir,
  lastDir,
  ts,
  lastTriggerTime,
  lastEventTime,
  absDelta,
  lastAbsDelta,
}: WheelInertiaSample): boolean {
  // Discrete mouse wheel notches repeat identical large deltas (>= 50px).
  const isMouseWheelClick = absDelta >= MOUSE_DETENT_MIN && absDelta === lastAbsDelta
  return (
    dir === lastDir &&
    ts - lastTriggerTime < INERTIA_WINDOW_MS &&
    ts - lastEventTime < INERTIA_GAP_MS &&
    absDelta <= lastAbsDelta &&
    !isMouseWheelClick
  )
}

interface Options {
  enabled: boolean
  step: number
  onChangeStep: (next: number) => void
  sceneIds?: readonly string[]
}

/**
 * Smooth stop-to-stop native scroll navigation for desktop wheel & keyboard.
 * Leaves the document natively scrollable (no overflow-hidden hard stop) while
 * suppressing trackpad inertia tails so one gesture advances at most one stop.
 */
export function useDesktopDeckNav({
  enabled,
  step,
  onChangeStep,
  sceneIds = DEFAULT_SCENE_IDS,
}: Options) {
  const stepRef = useRef(step)
  useEffect(() => {
    stepRef.current = step
  }, [step])

  const onChangeStepRef = useRef(onChangeStep)
  useEffect(() => {
    onChangeStepRef.current = onChangeStep
  }, [onChangeStep])

  const stopsRef = useRef<number[] | null>(null)
  const animatingRef = useRef(false)
  const suppressScrollSyncRef = useRef(false)
  const targetYRef = useRef(0)
  const lockUntilRef = useRef(0)
  const fallbackTimerRef = useRef<number | undefined>(undefined)

  const getStops = useCallback((): number[] | null => {
    if (stopsRef.current) return stopsRef.current
    const measured = measureStops(sceneIds)
    stopsRef.current = measured
    return measured
  }, [sceneIds])

  const settle = useCallback(() => {
    if (!animatingRef.current) return
    animatingRef.current = false
    suppressScrollSyncRef.current = false
    window.clearTimeout(fallbackTimerRef.current)
    fallbackTimerRef.current = undefined
    lockUntilRef.current = performance.now() + POST_SETTLE_COOLDOWN_MS
  }, [])

  const scrollToY = useCallback(
    (top: number, behavior: ScrollBehavior = 'smooth'): boolean => {
      if (Math.abs(top - window.scrollY) <= STOP_EPS_PX) {
        animatingRef.current = false
        suppressScrollSyncRef.current = false
        window.clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = undefined
        return false
      }
      if (behavior === 'instant') {
        animatingRef.current = false
        suppressScrollSyncRef.current = false
        window.clearTimeout(fallbackTimerRef.current)
        fallbackTimerRef.current = undefined
        window.scrollTo({ top, behavior: 'instant' })
        return true
      }
      animatingRef.current = true
      targetYRef.current = top
      window.scrollTo({ top, behavior: 'smooth' })
      window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = window.setTimeout(settle, FALLBACK_SETTLE_MS)
      return true
    },
    [settle],
  )

  const goToStep = useCallback(
    (target: number, behavior: ScrollBehavior = 'smooth') => {
      const clamped = Math.max(0, Math.min(sceneIds.length - 1, target))
      const stops = getStops()
      const top = stops ? stops[clamped] : clamped * window.innerHeight
      suppressScrollSyncRef.current =
        behavior === 'smooth' && Math.abs(clamped - stepRef.current) > 1
      scrollToY(top, behavior)
      if (clamped !== stepRef.current) {
        stepRef.current = clamped
        onChangeStepRef.current(clamped)
      }
    },
    [getStops, sceneIds.length, scrollToY],
  )

  useEffect(() => {
    if (!enabled) {
      stopsRef.current = null
      return
    }

    stopsRef.current = measureStops(sceneIds)

    let resizeRaf = 0
    const onResize = () => {
      if (resizeRaf) return
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0
        stopsRef.current = measureStops(sceneIds)
      })
    }

    let lastEventTime = 0
    let lastAbsDelta = 0
    let lastDir: -1 | 0 | 1 = 0
    let lastTriggerTime = -Infinity

    const findAdjacentStop = (dir: -1 | 1): number | null => {
      const tops = getStops()
      if (!tops) return null
      const y = window.scrollY
      const lastTop = tops[tops.length - 1]
      if (dir > 0) {
        if (y >= lastTop - STOP_EPS_PX) return null
        return tops.find((t) => t > y + STOP_EPS_PX) ?? null
      }
      if (y > lastTop + STOP_EPS_PX || y <= tops[0] + STOP_EPS_PX) return null
      for (let i = tops.length - 1; i >= 0; i--) {
        if (tops[i] < y - STOP_EPS_PX) return tops[i]
      }
      return null
    }

    const stepBy = (dir: -1 | 1): boolean => {
      const nextTop = findAdjacentStop(dir)
      if (nextTop === null) return false
      return scrollToY(nextTop, 'smooth')
    }

    const onScroll = () => {
      if (animatingRef.current && Math.abs(window.scrollY - targetYRef.current) <= 1) {
        settle()
      }
      if (suppressScrollSyncRef.current) return
      const tops = getStops()
      if (!tops) return
      const nearest = getNearestStep(tops)
      if (nearest !== stepRef.current) {
        stepRef.current = nearest
        onChangeStepRef.current(nearest)
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      const dir: -1 | 0 | 1 = e.deltaY > 0 ? 1 : e.deltaY < 0 ? -1 : 0
      if (!dir) return

      const now = performance.now()
      const ts = e.timeStamp || now
      const absDelta = Math.abs(e.deltaY)

      const isInertia = isWheelInertia({
        dir,
        lastDir,
        ts,
        lastTriggerTime,
        lastEventTime,
        absDelta,
        lastAbsDelta,
      })

      lastEventTime = ts
      lastAbsDelta = absDelta
      lastDir = dir

      if (animatingRef.current || now < lockUntilRef.current) {
        e.preventDefault()
      } else if (isInertia) {
        const tops = getStops()
        if (tops && window.scrollY <= tops[tops.length - 1] + STOP_EPS_PX) {
          e.preventDefault()
        }
      } else if (stepBy(dir)) {
        e.preventDefault()
        lastTriggerTime = ts
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.isContentEditable ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.getAttribute('role') === 'slider' ||
          Boolean(target.closest('[role="slider"]')))
      ) {
        return
      }
      if (e.key === ' ' && target && (target.tagName === 'BUTTON' || target.tagName === 'A')) {
        return
      }

      if (e.key === 'Home') {
        e.preventDefault()
        goToStep(0)
        return
      }
      if (e.key === 'End') {
        e.preventDefault()
        goToStep(sceneIds.length - 1)
        return
      }

      const dir: -1 | 0 | 1 =
        e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)
          ? 1
          : e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)
            ? -1
            : 0

      if (dir && (animatingRef.current || stepBy(dir))) {
        e.preventDefault()
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('scrollend', settle)
    return () => {
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf)
      window.clearTimeout(fallbackTimerRef.current)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('scrollend', settle)
    }
  }, [enabled, getStops, goToStep, sceneIds, scrollToY, settle])

  return goToStep
}
