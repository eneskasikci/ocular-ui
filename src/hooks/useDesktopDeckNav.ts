import { useCallback, useState, useSyncExternalStore } from 'react'
import { SCENES } from '../config'

// Single-spring deck controller: instant scroll-anchor jumps let DesktopDeck's
// useSpring(scrollYProgress) own all motion, eliminating smooth-scroll fighting and tab bounce.
const STEP_COOLDOWN_MS = 280
const IDLE_UNLOCK_MS = 100
const MIN_STEP_GAP_MS = 180
const REVERSE_COOLDOWN_MS = 120
const DECAY_TRACK_DELAY_MS = 140
const STEP_THRESHOLD_PX = 8
const REVERSE_THRESHOLD_PX = 12
const SURGE_ACCUM_THRESHOLD_PX = 12
const DISCRETE_WHEEL_MIN_PX = 48
const DISCRETE_WHEEL_GAP_MS = 50
const STOP_EPS_PX = 3

const DEFAULT_SCENE_IDS = SCENES.map((s) => s.id)

export function getStepFromHash(sceneIds: readonly string[] = DEFAULT_SCENE_IDS): number {
  if (typeof window === 'undefined') return 0
  const id = window.location.hash.replace('#', '')
  const idx = sceneIds.indexOf(id)
  return idx >= 0 ? idx : 0
}

function syncStepHash(step: number, sceneIds: readonly string[]): void {
  if (typeof window === 'undefined') return
  const id = sceneIds[step]
  const hash = step === 0 || !id ? '' : `#${id}`
  if (window.location.hash !== hash) {
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
  }
}

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

function normalizeWheelDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 32
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight
  return e.deltaY
}

export interface DeckNavStore {
  getSnapshot: () => number
  goToStep: (target: number) => void
  subscribe: (enabled: boolean, onStoreChange: () => void) => () => void
}

export function createDeckNavStore(sceneIds: readonly string[] = DEFAULT_SCENE_IDS): DeckNavStore {
  let step = getStepFromHash(sceneIds)
  let stops: number[] | null = null
  let lockUntil = 0
  const listeners = new Set<() => void>()

  const notify = () => {
    for (const listener of listeners) {
      listener()
    }
  }

  const setStep = (next: number) => {
    if (next === step) return
    step = next
    notify()
  }

  const getStops = (): number[] | null => {
    if (stops) return stops
    const measured = measureStops(sceneIds)
    stops = measured
    return measured
  }

  const goToStep = (target: number) => {
    const clamped = Math.max(0, Math.min(sceneIds.length - 1, target))
    const currentStops = getStops()
    const top = currentStops ? currentStops[clamped] : clamped * window.innerHeight
    syncStepHash(clamped, sceneIds)
    setStep(clamped)
    if (Math.abs(top - window.scrollY) > STOP_EPS_PX) {
      window.scrollTo({ top, behavior: 'instant' })
    }
  }

  const subscribe = (enabled: boolean, onStoreChange: () => void): (() => void) => {
    listeners.add(onStoreChange)

    const onHashChange = () => {
      const next = getStepFromHash(sceneIds)
      if (enabled) {
        goToStep(next)
      } else {
        setStep(next)
      }
    }
    window.addEventListener('hashchange', onHashChange)

    if (!enabled) {
      stops = null
      return () => {
        listeners.delete(onStoreChange)
        window.removeEventListener('hashchange', onHashChange)
      }
    }

    stops = measureStops(sceneIds)
    syncStepHash(step, sceneIds)

    let resizeRaf = 0
    const onResize = () => {
      if (resizeRaf) return
      resizeRaf = window.requestAnimationFrame(() => {
        resizeRaf = 0
        const measured = measureStops(sceneIds)
        stops = measured
        if (measured) {
          const targetTop = measured[step]
          if (Math.abs(window.scrollY - targetTop) > STOP_EPS_PX) {
            window.scrollTo({ top: targetTop, behavior: 'instant' })
          }
        }
      })
    }

    let lastEventTime = 0
    let lastAbsDelta = 0
    let lastStepTime = -Infinity
    let lastStepDir: -1 | 0 | 1 = 0
    let gestureLocked = false
    let lockedDir: -1 | 0 | 1 = 0
    let peakDelta = 0
    let trailingMin = Infinity
    let surgeAccum = 0
    let accumDelta = 0
    let accumDir: -1 | 0 | 1 = 0

    const resetGestureLock = () => {
      gestureLocked = false
      lockedDir = 0
      peakDelta = 0
      trailingMin = Infinity
      surgeAccum = 0
      accumDelta = 0
      accumDir = 0
    }

    const triggerWheelStep = (
      targetStep: number,
      triggerDir: -1 | 1,
      now: number,
      initialDelta: number,
    ) => {
      if (
        typeof document !== 'undefined' &&
        document.activeElement instanceof HTMLElement &&
        document.activeElement.classList.contains('feature-tab')
      ) {
        document.activeElement.blur()
      }
      goToStep(targetStep)
      gestureLocked = true
      lockedDir = triggerDir
      lastStepTime = now
      lastStepDir = triggerDir
      lockUntil = now + STEP_COOLDOWN_MS
      peakDelta = initialDelta
      trailingMin = Infinity
      surgeAccum = 0
      accumDelta = 0
      accumDir = 0
    }

    const onScroll = () => {
      const currentStops = getStops()
      if (!currentStops) return
      const nearest = getNearestStep(currentStops)
      if (nearest !== step) {
        syncStepHash(nearest, sceneIds)
        setStep(nearest)
      }
    }

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return
      const delta = normalizeWheelDelta(e)
      const dir: -1 | 0 | 1 = delta > 0 ? 1 : delta < 0 ? -1 : 0
      if (!dir) return

      const now = performance.now()
      const absDelta = Math.abs(delta)
      const gap = now - lastEventTime
      const prevAbsDelta = lastAbsDelta
      lastEventTime = now
      lastAbsDelta = absDelta

      const nextStep = step + dir
      if (nextStep < 0 || nextStep >= sceneIds.length) {
        accumDelta = 0
        accumDir = 0
        return
      }

      e.preventDefault()

      if (gestureLocked && gap >= IDLE_UNLOCK_MS) {
        resetGestureLock()
      }

      if (gestureLocked) {
        if (dir === lockedDir) {
          accumDelta = 0
          accumDir = 0

          const isDiscreteNotch =
            e.deltaMode !== 0 ||
            (absDelta >= DISCRETE_WHEEL_MIN_PX &&
              gap >= DISCRETE_WHEEL_GAP_MS &&
              absDelta === prevAbsDelta)
          if (isDiscreteNotch && now >= lockUntil) {
            triggerWheelStep(nextStep, dir, now, absDelta)
            return
          }

          if (
            now < lockUntil &&
            absDelta > peakDelta &&
            (trailingMin === Infinity || trailingMin >= peakDelta * 0.5)
          ) {
            peakDelta = absDelta
            trailingMin = Infinity
          } else if (now >= lastStepTime + DECAY_TRACK_DELAY_MS) {
            trailingMin = Math.min(trailingMin, absDelta)
          }

          if (now >= lockUntil && trailingMin < Infinity) {
            const surgeFloor = trailingMin * 2 + 4
            if (absDelta >= surgeFloor) {
              surgeAccum += absDelta
              if (surgeAccum >= SURGE_ACCUM_THRESHOLD_PX) {
                triggerWheelStep(nextStep, dir, now, absDelta)
              }
              return
            }
            if (absDelta <= trailingMin + 2) {
              surgeAccum = 0
            }
          }
          return
        }

        if (now < lastStepTime + REVERSE_COOLDOWN_MS) return
        if (accumDir !== dir) {
          accumDir = dir
          accumDelta = 0
        }
        accumDelta += absDelta
        if (accumDelta < REVERSE_THRESHOLD_PX) return
        triggerWheelStep(nextStep, dir, now, absDelta)
        return
      }

      const minStepGap = dir === lastStepDir ? MIN_STEP_GAP_MS : REVERSE_COOLDOWN_MS
      if (now < lastStepTime + minStepGap) return
      if (gap >= IDLE_UNLOCK_MS || accumDir !== dir) {
        accumDir = dir
        accumDelta = 0
      }
      accumDelta += absDelta
      if (accumDelta < STEP_THRESHOLD_PX) return
      triggerWheelStep(nextStep, dir, now, absDelta)
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

      if (!dir) return
      const nextStep = step + dir
      if (nextStep < 0 || nextStep >= sceneIds.length) return

      e.preventDefault()
      const now = performance.now()
      if (!e.repeat || now >= lockUntil) {
        goToStep(nextStep)
        lockUntil = now + 220
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      listeners.delete(onStoreChange)
      window.removeEventListener('hashchange', onHashChange)
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
    }
  }

  return {
    getSnapshot: () => step,
    goToStep,
    subscribe,
  }
}

interface Options {
  enabled: boolean
  sceneIds?: readonly string[]
}

export interface DeckNavController {
  step: number
  goToStep: (target: number) => void
}

const getServerSnapshot = () => 0

/**
 * Stop-to-stop navigation for desktop wheel & keyboard.
 * Updates step state and snaps the scroll anchor immediately so Motion's
 * useSpring handles interpolation without native smooth-scroll oscillation.
 */
export function useDesktopDeckNav({
  enabled,
  sceneIds = DEFAULT_SCENE_IDS,
}: Options): DeckNavController {
  const [store] = useState(() => createDeckNavStore(sceneIds))
  const subscribe = useCallback(
    (onStoreChange: () => void) => store.subscribe(enabled, onStoreChange),
    [store, enabled],
  )
  const step = useSyncExternalStore(subscribe, store.getSnapshot, getServerSnapshot)
  return { step, goToStep: store.goToStep }
}
