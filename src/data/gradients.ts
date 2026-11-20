import type { BackdropId } from '../config'

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

/** Base linear gradients and blob stops mirror the app's onboarding painter (hex values and positions). */
export const BASE: Record<BackdropId, string> = {
  silk: 'linear-gradient(135deg,#111215 0,#262930 35%,#4f121f 68%,#111215 100%)',
  prism: 'linear-gradient(180deg,#111215 0,#262930 38%,#4a101d 75%,#111215 100%)',
  crescent: 'linear-gradient(135deg,#111215 0,#262930 28%,#7a1c2e 62%,#3b1019 88%,#111215 100%)',
  horizon: 'linear-gradient(180deg,#0b0c0e 0,#262930 28%,#581423 56%,#2c1820 80%,#111215 100%)',
  meridian: 'linear-gradient(180deg,#0b0c0e 0,#262930 26%,#0f3a2e 58%,#2a1a22 84%,#111215 100%)',
}

const rad = (inner: string) => `radial-gradient(closest-side,${inner})`

export const BLOBS: Record<BackdropId, Blob[]> = {
  silk: [
    { x: '56%', y: '28%', w: '100vmax', fill: rad('#b52a44,#7a1c2e 42%,rgba(38,41,48,0)') },
    { x: '56%', y: '50%', w: '80vmax', fill: rad('rgba(243,241,236,.38),rgba(168,40,66,.8) 35%,rgba(38,41,48,.5) 75%,rgba(17,18,21,0)') },
    { x: '47%', y: '58%', w: '70vmax', fill: rad('rgba(36,168,118,.26),rgba(243,241,236,.1) 50%,rgba(36,168,118,0)') },
    { x: '44%', y: '84%', w: '100vmax', fill: rad('#99223a,#591322 55%,rgba(17,18,21,0)') },
  ],
  prism: [
    { x: '50%', y: '26%', w: '70vmax', fill: rad('rgba(243,241,236,.4),rgba(36,168,118,.6) 42%,rgba(38,41,48,0)') },
    { x: '50%', y: '49%', w: '62vmax', fill: rad('#e8832a,rgba(243,241,236,.34) 45%,rgba(122,28,46,.55) 75%,rgba(17,18,21,0)') },
    { x: '50%', y: '80%', w: '100vmax', fill: rad('#a82640,#7a1c2e 55%,rgba(17,18,21,0)') },
  ],
  crescent: [
    { x: '66%', y: '71%', w: '95vmax', fill: rad('rgba(36,168,118,.3),rgba(243,241,236,.16) 45%,rgba(17,18,21,0)') },
    { x: '48%', y: '52%', w: '80vmax', r: '-14deg', sx: 1.35, sy: 0.48, fill: rad('rgba(232,131,42,.92),rgba(232,131,42,.48) 48%,rgba(168,40,66,.18) 82%,rgba(232,131,42,0)') },
    { x: '50%', y: '44%', w: '76vmax', r: '-14deg', sx: 1.32, sy: 0.42, fill: rad('rgba(78,17,30,.96),rgba(122,28,46,.78) 45%,rgba(46,50,59,.34) 78%,rgba(38,41,48,0)') },
  ],
  horizon: [
    { x: '48%', y: '52%', w: '85vmax', r: '-19deg', sx: 1.85, sy: 0.38, fill: rad('rgba(232,131,42,.9),rgba(243,241,236,.36) 38%,rgba(181,42,68,.22) 75%,rgba(232,131,42,0)') },
    { x: '52%', y: '60%', w: '85vmax', r: '-18deg', sx: 1.9, sy: 0.34, fill: rad('rgba(181,42,68,.92),rgba(122,28,46,.55) 45%,rgba(36,168,118,.14) 82%,rgba(122,28,46,0)') },
    { x: '61%', y: '79%', w: '90vmax', fill: rad('rgba(36,168,118,.42),rgba(122,28,46,.25) 55%,rgba(17,18,21,0)') },
  ],
  meridian: [
    { x: '50%', y: '50%', w: '85vmax', r: '17deg', sx: 1.9, sy: 0.3, fill: rad('rgba(243,241,236,.5),rgba(36,168,118,.7) 30%,rgba(15,58,46,.25) 72%,rgba(36,168,118,0)') },
    { x: '54%', y: '56%', w: '85vmax', r: '15deg', sx: 1.95, sy: 0.34, fill: rad('rgba(28,127,91,.8),rgba(15,58,46,.55) 45%,rgba(232,131,42,.12) 82%,rgba(15,58,46,0)') },
    { x: '62%', y: '53%', w: '34vmax', ember: true, fill: rad('rgba(232,131,42,.8),rgba(232,131,42,.22) 50%,rgba(232,131,42,0)') },
    { x: '40%', y: '86%', w: '90vmax', fill: rad('rgba(122,28,46,.45),rgba(17,18,21,0)') },
  ],
}
