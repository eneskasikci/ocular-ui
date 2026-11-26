import type { BackdropId } from '../config'
import { OCULAR_GRADIENT_BASE, OCULAR_GRADIENT_BLOBS } from '../generated/ocularSpec'

export interface Blob {
  x: string
  y: string
  w: string
  r?: string
  sx?: number
  sy?: number
  fill: string
  ember?: boolean
}

/** Base linear gradients and blob stops synced 1:1 from `Ocular/Views/Onboarding/OnboardingGradientPainter.swift`. */
export const BASE: Record<BackdropId, string> = OCULAR_GRADIENT_BASE

export const BLOBS: Record<BackdropId, readonly Blob[]> = OCULAR_GRADIENT_BLOBS
