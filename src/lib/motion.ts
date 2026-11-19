/** Shared precision-instrument motion primitives for Ocular. */

export const EASE_OCULAR = [0.2, 0, 0, 1] as const
export const EASE_OUT = [0.16, 1, 0.3, 1] as const

/** Long, silky deceleration for full-viewport stage parting and reveals. */
export const EASE_BUTTER = [0.22, 1, 0.36, 1] as const

/** Snappy mechanical detent for film switches, lens clicks, and shutter release. */
export const SPRING_DETENT = {
  type: 'spring' as const,
  stiffness: 420,
  damping: 34,
  mass: 0.75,
}

/** Smooth optical travel for prime lens crops and cinema aspect mattes. */
export const SPRING_LENS = {
  type: 'spring' as const,
  stiffness: 260,
  damping: 30,
  mass: 0.9,
}
