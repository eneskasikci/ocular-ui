import { useCallback, useEffect, useRef } from 'react'
import { SCENES } from '../config'

const DETENT_LOCK_MS = 760
const GESTURE_GAP_MS = 180
const WHEEL_THRESHOLD = 36

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
  const lastAbsDeltaRef = useRef(0)
  const accumRef = useRef(0)
  const gestureConsumedRef = useRef(false)
  const lockUntilRef = useRef(0)

  const goToStep = useCallback(
    (target: number) => {
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
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()

      const now = performance.now()
      const gap = now - lastWheelTimeRef.current
      const absY = Math.abs(e.deltaY)

      if (gap > GESTURE_GAP_MS) {
        gestureConsumedRef.current = false
        accumRef.current = 0
      } else if (
        gestureConsumedRef.current &&
        now > lockUntilRef.current &&
        absY > lastAbsDeltaRef.current * 1.45 + 6
      ) {
        gestureConsumedRef.current = false
        accumRef.current = 0
      }

      lastWheelTimeRef.current = now
      lastAbsDeltaRef.current = absY

      if (gestureConsumedRef.current || now < lockUntilRef.current) return

      accumRef.current += e.deltaY
      if (Math.abs(accumRef.current) < WHEEL_THRESHOLD) return

      const dir = accumRef.current > 0 ? 1 : -1
      gestureConsumedRef.current = true
      accumRef.current = 0

      const next = stepRef.current + dir
      if (next >= 0 && next < SCENES.length) goToStep(next)
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
    }
  }, [enabled, goToStep])

  return goToStep
}
