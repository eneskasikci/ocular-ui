/**
 * TODO: replace with the real App Store URL once the app id is known.
 * This is the single source of truth for every download button on the site.
 */
export const APP_STORE_URL = 'https://apps.apple.com/app/ocular/id0000000000'

export const SUPPORT_EMAIL = 'ocular.camera@icloud.com'
export const EULA_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'

export type BackdropId = 'silk' | 'prism' | 'crescent' | 'horizon' | 'meridian'

export interface SceneMeta {
  id: string
  label: string
  backdrop: BackdropId
}

/** The seven scenes, in order. Drives the backdrop and the header counter. */
export const SCENES: readonly SceneMeta[] = [
  { id: 'top', label: 'Ocular', backdrop: 'silk' },
  { id: 'camera', label: 'Camera', backdrop: 'silk' },
  { id: 'recipes', label: 'Recipes', backdrop: 'crescent' },
  { id: 'capture', label: 'Capture', backdrop: 'prism' },
  { id: 'raw', label: 'Darkroom', backdrop: 'horizon' },
  { id: 'tiers', label: 'Free & Pro', backdrop: 'silk' },
  { id: 'privacy', label: 'Get it', backdrop: 'meridian' },
]
