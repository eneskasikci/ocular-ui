import { useCallback, useEffect, useRef } from 'react'
import { SCENES } from '../config'

// Single-spring deck controller: instant scroll-anchor jumps let DesktopDeck's
// useSpring(scrollYProgress) own all motion, eliminating smooth-scroll fighting and tab bounce.
const STEP_COOLDOWN_MS = 520
const REVERSE_COOLDOWN_MS = 220
const GESTURE_IDLE_MS = 160
const STEP_THRESHOLD_PX = 18
const REVERSE_THRESHOLD_PX = 24
const RETRIGGER_SURGE_MIN_PX = 36
const RETRIGGER_SURGE_RATIO = 2.5
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

function normalizeWheelDelta(e: WheelEvent): number {
  if (e.deltaMode === 1) return e.deltaY * 32
  if (e.deltaMode === 2) return e.deltaY * window.innerHeight
  return e.deltaY
}

interface Options {
  enabled: boolean
  step: number
  onChangeStep: (next: number) => void
  sceneIds?: readonly string[]
}

/**
 * Stop-to-stop navigation for desktop wheel & keyboard.
 * Updates step state and snaps the scroll anchor immediately so Motion's
 * useSpring handles interpolation without native smooth-scroll oscillation.
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
  const lockUntilRef = useRef(0)

  const getStops = useCallback((): number[] | null => {
    if (stopsRef.current) return stopsRef.current
    const measured = measureStops(sceneIds)
    stopsRef.current = measured
    return measured
  }, [sceneIds])

  const goToStep = useCallback(
    (target: number) => {
      const clamped = Math.max(0, Math.min(sceneIds.length - 1, target))
      const stops = getStops()
      const top = stops ? stops[clamped] : clamped * window.innerHeight
      if (clamped !== stepRef.current) {
        stepRef.current = clamped
        onChangeStepRef.current(clamped)
      }
      if (Math.abs(top - window.scrollY) > STOP_EPS_PX) {
        window.scrollTo({ top, behavior: 'instant' })
      }
    },
    [getStops, sceneIds.length],
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
        const measured = measureStops(sceneIds)
        stopsRef.current = measured
        if (measured) {
          const targetTop = measured[stepRef.current]
          if (Math.abs(window.scrollY - targetTop) > STOP_EPS_PX) {
            window.scrollTo({ top: targetTop, behavior: 'instant' })
          }
        }
      })
    }

    let lastEventTime = 0
    let lastStepTime = -Infinity
    let gestureLocked = false
    let lockedDir: -1 | 0 | 1 = 0
    let trailingMin = Infinity
    let accumDelta = 0
    let accumDir: -1 | 0 | 1 = 0

    const triggerWheelStep = (targetStep: number, triggerDir: -1 | 1, now: number) => {
      goToStep(targetStep)
      gestureLocked = true
      lockedDir = triggerDir
      lastStepTime = now
      lockUntilRef.current = now + STEP_COOLDOWN_MS
      trailingMin = Infinity
      accumDelta = 0
      accumDir = 0
    }

    const onScroll = () => {
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
      const delta = normalizeWheelDelta(e)
      const dir: -1 | 0 | 1 = delta > 0 ? 1 : delta < 0 ? -1 : 0
      if (!dir) return

      const now = performance.now()
      const absDelta = Math.abs(delta)
      const gap = now - lastEventTime
      lastEventTime = now

      const nextStep = stepRef.current + dir
      if (nextStep < 0 || nextStep >= sceneIds.length) {
        accumDelta = 0
        accumDir = 0
        return
      }

      e.preventDefault()

      if (gestureLocked) {
        if (gap >= GESTURE_IDLE_MS && now >= lockUntilRef.current) {
          gestureLocked = false
          lockedDir = 0
          trailingMin = Infinity
          accumDelta = 0
          accumDir = 0
        } else if (dir === lockedDir) {
          if (now >= lastStepTime + 180) {
            trailingMin = Math.min(trailingMin, absDelta)
          }
          const isSurge =
            now >= lockUntilRef.current &&
            absDelta >= RETRIGGER_SURGE_MIN_PX &&
            trailingMin < Infinity &&
            absDelta >= trailingMin * RETRIGGER_SURGE_RATIO
          if (!isSurge) return
          triggerWheelStep(nextStep, dir, now)
          return
        } else {
          if (now < lastStepTime + REVERSE_COOLDOWN_MS) return
          if (accumDir !== dir) {
            accumDir = dir
            accumDelta = 0
          }
          accumDelta += absDelta
          if (accumDelta < REVERSE_THRESHOLD_PX) return
          triggerWheelStep(nextStep, dir, now)
          return
        }
      }

      if (gap >= GESTURE_IDLE_MS || accumDir !== dir) {
        accumDir = dir
        accumDelta = 0
      }
      accumDelta += absDelta
      if (accumDelta < STEP_THRESHOLD_PX) return
      triggerWheelStep(nextStep, dir, now)
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
      const nextStep = stepRef.current + dir
      if (nextStep < 0 || nextStep >= sceneIds.length) return

      e.preventDefault()
      const now = performance.now()
      if (!e.repeat || now >= lockUntilRef.current) {
        goToStep(nextStep)
        lockUntilRef.current = now + 220
      }
    }

    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      if (resizeRaf) window.cancelAnimationFrame(resizeRaf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [enabled, getStops, goToStep, sceneIds])

  return goToStep
}
