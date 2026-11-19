import * as m from 'motion/react-m'
import { Toggle } from 'radix-ui'
import { RECIPES } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { SPRING_DETENT } from '../../lib/motion'

interface Props {
  camera: CameraController
  isFree: boolean
  guidesOn: boolean
  onToggleGuides: (v: boolean) => void
  reduceMotion: boolean
}

const GUIDE_BTN_CLS =
  'guide-btn w-[34px] h-[34px] rounded-[10px] bg-obsidian/68 border border-silver/20 flex flex-col items-center justify-center gap-0.5 p-0 text-silver/84 cursor-pointer data-[state=on]:bg-amber/18 data-[state=on]:border-amber/68 data-[state=on]:text-amber'

/** Symmetric shutter deck: Roll + RANGE/RAW left, burgundy shutter center, knurled FILM dial right. */
export function ShutterDeck({ camera, isFree, guidesOn, onToggleGuides, reduceMotion }: Props) {
  const { photo, recipe, shotCount, rawCompare, stepPhoto, toggleRawCompare, triggerShutter, cycleRecipe } =
    camera

  const filmIndex = Math.max(0, RECIPES.findIndex((r) => r.id === recipe.id))
  const dialAngle = -(filmIndex * (360 / RECIPES.length))

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center pt-0.5 px-0.5">
      <div className="flex items-center gap-[5px]">
        <button
          type="button"
          className="relative w-[38px] h-[38px] p-0 rounded-[11px] overflow-hidden border-[1.5px] border-silver/36 bg-graphite cursor-pointer"
          onClick={() => stepPhoto(1)}
          aria-label={`Switch location photo (currently ${photo.name})`}
          title="Switch sample photo"
        >
          <img
            src={photo.src}
            alt=""
            className="w-full h-full object-cover block"
            style={{ objectPosition: photo.objectPosition }}
          />
          <span className="absolute right-0.5 bottom-0.5 px-1 py-px rounded bg-deep/84 font-mono font-extrabold text-[7px] leading-none text-silver">
            {String(shotCount).padStart(2, '0')}
          </span>
        </button>

        <Toggle.Root
          pressed={isFree ? guidesOn : rawCompare}
          onPressedChange={isFree ? onToggleGuides : toggleRawCompare}
          title={isFree ? 'Toggle rangefinder framing guides' : 'Toggle RAW Darkroom split'}
          className={GUIDE_BTN_CLS}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="7.5" fill="none" stroke="currentColor" strokeWidth="2" />
            <line x1="12" y1="2" x2="12" y2="6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="12" y1="17.5" x2="12" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="2" y1="12" x2="6.5" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="17.5" y1="12" x2="22" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-mono font-bold text-[7px] leading-none">{isFree ? 'RANGE' : 'RAW'}</span>
        </Toggle.Root>
      </div>

      <m.button
        type="button"
        className="shutter-outer w-[52px] h-[52px] p-0 rounded-full bg-obsidian/42 border-[2.5px] border-silver flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,.52)] cursor-pointer"
        onClick={triggerShutter}
        whileTap={reduceMotion ? undefined : { scale: 0.9 }}
        transition={SPRING_DETENT}
        aria-label="Capture frame and write recipe EXIF"
      >
        <span className="shutter-inner w-10 h-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,#a82842_0%,#7a1c2e_68%,#4a101d_100%)] border-[1.5px] border-silver/44" />
      </m.button>

      <div className="flex justify-end">
        <button
          type="button"
          className="film-dial-btn w-16 h-16 p-0 border-0 bg-transparent rounded-full cursor-pointer"
          onClick={cycleRecipe}
          aria-label={`Film dial: ${recipe.name} (${recipe.code}). Tap for next stock.`}
          title="Rotate film dial"
        >
          <svg viewBox="0 0 86 86" className="w-full h-full block" aria-hidden="true">
            <circle cx="43" cy="43" r="42" fill="rgba(17,18,21,0.96)" stroke="rgba(243,241,236,0.22)" strokeWidth="1" />
            <circle cx="43" cy="43" r="40" fill="none" stroke="rgba(243,241,236,0.24)" strokeWidth="3.5" strokeDasharray="2 3.23" />
            <circle cx="43" cy="43" r="38" fill="#13151A" stroke="rgba(243,241,236,0.16)" strokeWidth="1" />

            <m.g
              style={{ transformOrigin: '43px 43px' }}
              animate={{ rotate: dialAngle }}
              transition={reduceMotion ? { duration: 0 } : SPRING_DETENT}
            >
              {RECIPES.map((r, i) => {
                const angleDeg = i * (360 / RECIPES.length)
                const rad = (angleDeg * Math.PI) / 180
                const x = 43 + 27.5 * Math.sin(rad)
                const y = 43 - 27.5 * Math.cos(rad)
                const active = r.id === recipe.id
                return (
                  <text
                    key={r.id}
                    x={x}
                    y={y + 2.8}
                    textAnchor="middle"
                    transform={`rotate(${angleDeg} ${x} ${y})`}
                    fill={active ? '#E8832A' : 'rgba(243,241,236,0.58)'}
                    fontFamily="ui-monospace, monospace"
                    fontSize={active ? '8.5' : '7.4'}
                    fontWeight="800"
                  >
                    {r.code}
                  </text>
                )
              })}
            </m.g>

            {/* Fixed 12 o'clock Amber index pip */}
            <rect x="40.5" y="1" width="5" height="7.5" rx="2.5" fill="#E8832A" />
            <circle cx="43" cy="43" r="18.2" fill="#1E2027" stroke="rgba(243,241,236,0.28)" strokeWidth="1" />
            <text
              x="43"
              y="45.6"
              textAnchor="middle"
              fill="#F3F1EC"
              fontFamily="ui-monospace, monospace"
              fontSize="7.8"
              fontWeight="800"
              letterSpacing="0.6"
            >
              FILM
            </text>
          </svg>
        </button>
      </div>
    </div>
  )
}
