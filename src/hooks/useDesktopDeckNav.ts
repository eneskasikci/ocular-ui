import { useCallback, useEffect, useRef } from 'react'
import { SCENES } from '../config'

const DETENT_LOCK_MS = 760
const GESTURE_GAP_MS = 180
const WHEEL_THRESHOLD = 36

function normalizeWheelDelta(delta: number, mode: number): number {
  if (mode === 1) return delta * 16
  if (mode === 2) return delta * window.innerHeight
  return delta
}

interface Options {
  enabled: boolean
  step: number
  onChangeStep: (next: number) => void
}

/** Strict 1-step hard detent navigation for desktop wheel gestures and keyboard controls. */
export function useDesktopDeckNav({ enabled, step, onChangeStep }: Options) {
  const stepRef = useRef(step)
  useEffect(() => {
    stepRef.current = step
  }, [step])

  const lastWheelTimeRef = useRef(0)
  const consumedDirRef = useRef<-1 | 0 | 1>(0)
  const peakAbsRef = useRef(0)
  const minAbsRef = useRef(0)
  const accumRef = useRef(0)
  const gestureConsumedRef = useRef(false)
  const lockUntilRef = useRef(0)
  const queuedRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  const goToStep = useCallback(
    (target: number) => {
      clearTimeout(queuedRef.current)
      queuedRef.current = undefined
      const clamped = Math.max(0, Math.min(SCENES.length - 1, target))
      if (clamped === stepRef.current) return
      lockUntilRef.current = performance.now() + DETENT_LOCK_MS
      stepRef.current = clamped
      onChangeStep(clamped)
    },
    [onChangeStep],
  )

  useEffect(() => {
    if (!enabled) return

    const onWheel = (e: WheelEvent) => {
      const dx = normalizeWheelDelta(e.deltaX, e.deltaMode)
      const dy = normalizeWheelDelta(e.deltaY, e.deltaMode)
      if (dy === 0 || Math.abs(dx) > Math.abs(dy)) return
      e.preventDefault()

      const now = performance.now()
      const gap = now - lastWheelTimeRef.current
      lastWheelTimeRef.current = now
      const absY = Math.abs(dy)
      const dir: -1 | 1 = dy > 0 ? 1 : -1

      if (gap > GESTURE_GAP_MS) {
        gestureConsumedRef.current = false
        consumedDirRef.current = 0
        accumRef.current = 0
      }

      if (gestureConsumedRef.current) {
        if (dir === consumedDirRef.current) {
          const hasDecayed = minAbsRef.current <= peakAbsRef.current * 0.5
          const isFreshImpulse = hasDecayed && absY >= minAbsRef.current * 2 + 8
          if (isFreshImpulse) {
            gestureConsumedRef.current = false
            consumedDirRef.current = 0
            accumRef.current = 0
          } else {
            if (absY > peakAbsRef.current) {
              peakAbsRef.current = absY
              minAbsRef.current = absY
            } else if (absY < minAbsRef.current) {
              minAbsRef.current = absY
            }
            accumRef.current = 0
            return
          }
        }
        // Opposite-direction events fall through into accumRef while keeping the prior
        // direction's inertia lock intact until the reversal crosses WHEEL_THRESHOLD.
      }

      if (accumRef.current !== 0 && Math.sign(accumRef.current) !== dir) {
        accumRef.current = 0
      }

      accumRef.current += dy
      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return

      gestureConsumedRef.current = true
      consumedDirRef.current = dir
      peakAbsRef.current = absY
      minAbsRef.current = absY
      accumRef.current = 0

      // A fresh swipe during the post-step lock is queued, not dropped (else it needs a second scroll).
      const wait = lockUntilRef.current - now
      clearTimeout(queuedRef.current)
      queuedRef.current = undefined
      if (wait > 0) {
        queuedRef.current = setTimeout(() => goToStep(stepRef.current + dir), wait)
        return
      }
      goToStep(stepRef.current + dir)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
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
        goToStep(SCENES.length - 1)
        return
      }

      const forward =
        e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)
      const backward =
        e.key === 'ArrowUp' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)

      if (!forward && !backward) return
      e.preventDefault()
      if (performance.now() < lockUntilRef.current) return
      goToStep(stepRef.current + (forward ? 1 : -1))
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
      clearTimeout(queuedRef.current)
    }
  }, [enabled, goToStep])

  return goToStep
}
