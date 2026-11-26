import * as m from 'motion/react-m'
import { PHONE_RECIPE_MAP } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { SPRING_DETENT } from '../../lib/motion'

interface Props {
  camera: CameraController
  onOpenRecipeMenu: () => void
}

const GUIDE_BTN_CLS =
  'guide-btn w-[34px] h-[34px] rounded-[10px] bg-obsidian/68 border border-silver/20 flex flex-col items-center justify-center gap-0.5 p-0 cursor-pointer transition-colors'

function FramingIcon({ mode }: { mode: CameraController['framingGuide'] }) {
  if (mode === 'ruleOfThirds') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
      </svg>
    )
  }
  if (mode === 'rangefinder') {
    return (
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="7.5" />
        <line x1="12" y1="2" x2="12" y2="6.5" />
        <line x1="12" y1="17.5" x2="12" y2="22" />
        <line x1="2" y1="12" x2="6.5" y2="12" />
        <line x1="17.5" y1="12" x2="22" y2="12" />
      </svg>
    )
  }
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
    </svg>
  )
}

/** Symmetric shutter deck: Roll (`ROLL`) + CLEAR/GRID/RANGE left, burgundy shutter center, knurled FILM dial + cap right. */
export function ShutterDeck({ camera, onOpenRecipeMenu }: Props) {
  const { t, format } = useI18n()
  const {
    photo,
    phoneRecipe,
    pinnedDialIds,
    framingGuide,
    stepPhoto,
    cycleFramingGuide,
    triggerShutter,
    cycleRecipe,
    selectPhoneRecipe,
  } = camera

  const dialRecipes = pinnedDialIds.map((id) => PHONE_RECIPE_MAP[id]).filter(Boolean)
  const filmIndex = Math.max(0, dialRecipes.findIndex((r) => r.id === phoneRecipe.id))
  const stepDegrees = dialRecipes.length > 0 ? 360 / dialRecipes.length : 360
  const dialAngle = -(filmIndex * stepDegrees)
  const guideActive = framingGuide !== 'clean'
  const guideLabel =
    framingGuide === 'clean' ? t.phone.clear : framingGuide === 'ruleOfThirds' ? t.phone.grid : t.phone.range

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center pt-0.5 px-0.5">
      <div className="flex items-center gap-[5px]">
        <button
          type="button"
          className="relative w-[38px] h-[38px] p-0 rounded-[11px] overflow-hidden border-[1.5px] border-silver/36 bg-graphite cursor-pointer"
          onClick={() => stepPhoto(1)}
          aria-label={format(t.a11y.switchLocationPhoto, { name: photo.name })}
          title={t.a11y.switchSamplePhotoTitle}
        >
          <img
            src={photo.src}
            alt=""
            className="w-full h-full object-cover block"
            style={{ objectPosition: photo.objectPosition }}
          />
          <span className="absolute right-[3px] bottom-[3px] px-1 py-px rounded-[3px] bg-obsidian/75 font-mono font-extrabold text-[6.5px] leading-none text-silver uppercase">
            {t.phone.roll}
          </span>
        </button>

        <button
          type="button"
          onClick={cycleFramingGuide}
          title={t.a11y.toggleGuides}
          aria-label={`Framing Guide: ${guideLabel}`}
          className={cn(
            GUIDE_BTN_CLS,
            guideActive ? 'bg-amber/15 border-amber/68 text-amber' : 'text-silver/82',
          )}
        >
          <FramingIcon mode={framingGuide} />
          <span className="font-mono font-bold text-[6.5px] leading-none">{guideLabel}</span>
        </button>
      </div>

      <m.button
        type="button"
        className="shutter-outer w-[52px] h-[52px] p-0 rounded-full bg-obsidian/42 border-[2.5px] border-silver flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,.52)] cursor-pointer"
        onClick={triggerShutter}
        whileTap={{ scale: 0.9 }}
        transition={SPRING_DETENT}
        aria-label={t.a11y.captureFrame}
      >
        <span className="shutter-inner w-10 h-10 rounded-full bg-[radial-gradient(circle_at_35%_30%,#a82842_0%,#7a1c2e_68%,#4a101d_100%)] border-[1.5px] border-silver/44" />
      </m.button>

      {/* Right 1fr: Knurled Film Dial with upright counter-rotated labels + center FILM cap button */}
      <div className="flex justify-end">
        <div className="relative w-16 h-16">
          <button
            type="button"
            className="film-dial-btn w-full h-full p-0 border-0 bg-transparent rounded-full cursor-pointer block"
            onClick={cycleRecipe}
            aria-label={format(t.a11y.filmDialLabel, { name: phoneRecipe.name, code: phoneRecipe.slotCode })}
            title={t.a11y.rotateFilmDial}
          >
            <svg viewBox="0 0 86 86" className="w-full h-full block" aria-hidden="true">
              <defs>
                <radialGradient id="dial-face" cx="50%" cy="50%" r="50%">
                  <stop offset="55%" stopColor="#181a20" />
                  <stop offset="100%" stopColor="#0d0e12" />
                </radialGradient>
              </defs>
              <circle cx="43" cy="43" r="42" fill="rgba(17,18,21,0.96)" stroke="rgba(243,241,236,0.20)" strokeWidth="1" />
              <circle cx="43" cy="43" r="40" fill="none" stroke="rgba(243,241,236,0.22)" strokeWidth="3.5" strokeDasharray="1.8 3.43" />
              <circle cx="43" cy="43" r="38" fill="url(#dial-face)" stroke="rgba(243,241,236,0.16)" strokeWidth="1" />

              <m.g
                style={{ transformOrigin: '43px 43px' }}
                animate={{ rotate: dialAngle }}
                transition={SPRING_DETENT}
              >
                {dialRecipes.map((r, i) => {
                  const angleDeg = i * stepDegrees
                  const rad = (angleDeg * Math.PI) / 180
                  const x = 43 + 27.5 * Math.sin(rad)
                  const y = 43 - 27.5 * Math.cos(rad)
                  const active = r.id === phoneRecipe.id
                  return (
                    <text
                      key={r.id}
                      x={x}
                      y={y + 2.6}
                      textAnchor="middle"
                      transform={`rotate(${-dialAngle} ${x} ${y})`}
                      fill={active ? '#F3F1EC' : 'rgba(243,241,236,0.56)'}
                      fontFamily="ui-monospace, monospace"
                      fontSize={dialRecipes.length > 8 ? '7.2' : '8.0'}
                      fontWeight="800"
                      onClick={(e) => {
                        e.stopPropagation()
                        selectPhoneRecipe(r.id)
                      }}
                    >
                      {r.slotCode}
                    </text>
                  )
                })}
              </m.g>

              {/* Fixed 12 o'clock Amber index pip */}
              <rect x="40.5" y="1" width="5" height="7.5" rx="2.5" fill="#E8832A" />
            </svg>
          </button>

          {/* Center FILM cap button opens Left Typographic Recipe Side Menu */}
          <button
            type="button"
            onClick={onOpenRecipeMenu}
            aria-label="Open Film Recipe Menu"
            title="Film Recipe Menu"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full border border-silver/28 text-silver font-mono font-extrabold text-[6.8px] tracking-[0.06em] flex items-center justify-center p-0 cursor-pointer shadow-[0_3px_6px_rgba(0,0,0,.6)] hover:border-amber"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #2b2e36 0%, #14161b 85%)',
            }}
          >
            FILM
          </button>
        </div>
      </div>
    </div>
  )
}
