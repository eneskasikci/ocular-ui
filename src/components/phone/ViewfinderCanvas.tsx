import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Slider } from 'radix-ui'
import {
  buildOpticalFilter,
  GRAIN_LEVELS,
  LENS_SCALE,
  RAW_FILTER,
  type AspectId,
} from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { EASE_OUT, SPRING_LENS } from '../../lib/motion'

interface Props {
  camera: CameraController
  compact?: boolean
  showGuides?: boolean
}

/**
 * Compute GPU-only matte scales.
 * Phone portrait sensor is 3:4 (0.75); compact mobile monitor is 4:3 (1.333).
 */
function getMatteScales(aspect: AspectId, compact: boolean): { y: number; x: number } {
  if (!compact) {
    switch (aspect) {
      case '4:3':
        return { y: 0, x: 0 }
      case '1:1':
        return { y: 0.25, x: 0 }
      case '3:2':
        return { y: 0.5, x: 0 }
      case '16:9':
        return { y: 0.578, x: 0 }
      case 'xpan':
        return { y: 0.723, x: 0 }
    }
  }
  switch (aspect) {
    case '4:3':
      return { y: 0, x: 0 }
    case '3:2':
      return { y: 0.111, x: 0 }
    case '1:1':
      return { y: 0, x: 0.25 }
    case '16:9':
      return { y: 0.25, x: 0 }
    case 'xpan':
      return { y: 0.508, x: 0 }
  }
}

const IMG_BASE =
  'vf__img absolute inset-0 w-full h-full object-cover block select-none [-webkit-user-drag:none] transition-[filter] duration-240 ease-ocular motion-reduce:transition-none'

export function ViewfinderCanvas({ camera, compact = false, showGuides = true }: Props) {
  const {
    photo,
    recipe,
    lens,
    ev,
    dr,
    aspect,
    grain,
    halation,
    rawCompare,
    rawSplit,
    setRawSplit,
    shutterFlash,
    focusKey,
  } = camera

  const opticalFilter = buildOpticalFilter(recipe, ev, dr)
  const grainOpacity = GRAIN_LEVELS.find((g) => g.id === grain)?.opacity ?? 0
  const showHalation = halation && recipe.id !== 'ac'
  const matte = getMatteScales(aspect, compact)
  const scale = LENS_SCALE[lens]
  const lensTransition = SPRING_LENS

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden bg-obsidian [contain:layout_paint]',
        compact
          ? 'aspect-[4/3] rounded-2xl border border-hair-strong shadow-[0_16px_40px_rgba(0,0,0,.45)]'
          : 'aspect-[3/4] border-y border-silver/34',
      )}
    >
      {/* Developed live film stack */}
      <m.div
        className="absolute inset-0"
        style={{ transformOrigin: photo.objectPosition }}
        animate={{ scale }}
        transition={lensTransition}
        aria-hidden="true"
      >
        <AnimatePresence mode="sync" initial={false}>
          <m.img
            key={photo.id}
            src={photo.src}
            alt=""
            className={IMG_BASE}
            style={{ filter: opticalFilter, objectPosition: photo.objectPosition }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE_OUT }}
            decoding="async"
            draggable={false}
          />
        </AnimatePresence>

        {showHalation && (
          <img
            src={photo.src}
            alt=""
            className={cn(
              IMG_BASE,
              '[filter:brightness(.44)_contrast(3.4)_sepia(1)_hue-rotate(-36deg)_saturate(5.2)_blur(6px)] mix-blend-screen opacity-34 pointer-events-none',
            )}
            style={{ objectPosition: photo.objectPosition }}
            decoding="async"
            draggable={false}
          />
        )}
      </m.div>

      {/* Optical shadow & highlight toning */}
      {recipe.shadowTint && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-280 ease-ocular motion-reduce:transition-none"
          style={{
            background: recipe.shadowTint.background,
            mixBlendMode: recipe.shadowTint.blendMode,
            opacity: recipe.shadowTint.opacity,
          }}
          aria-hidden="true"
        />
      )}
      {recipe.highlightTint && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-280 ease-ocular motion-reduce:transition-none"
          style={{
            background: recipe.highlightTint.background,
            mixBlendMode: recipe.highlightTint.blendMode,
            opacity: recipe.highlightTint.opacity,
          }}
          aria-hidden="true"
        />
      )}

      {/* Organic film grain */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay transition-opacity duration-220 ease-ocular motion-reduce:transition-none bg-grain-vf"
        style={{ opacity: grainOpacity }}
        aria-hidden="true"
      />

      {/* RAW Darkroom before/after split layer */}
      {rawCompare && (
        <>
          <div
            className="absolute inset-0 pointer-events-none z-4"
            style={{ clipPath: `inset(0 ${100 - rawSplit}% 0 0)` }}
            aria-hidden="true"
          >
            <m.div
              className="absolute inset-0"
              style={{ transformOrigin: photo.objectPosition }}
              animate={{ scale }}
              transition={lensTransition}
            >
              <img
                src={photo.src}
                alt=""
                className={IMG_BASE}
                style={{ filter: RAW_FILTER, objectPosition: photo.objectPosition }}
                draggable={false}
              />
            </m.div>
          </div>

          <div
            className="vf__split-line absolute inset-y-0 w-[1.5px] -ml-[0.75px] bg-amber shadow-[0_0_10px_rgba(11,12,14,.7)] pointer-events-none z-7"
            style={{ left: `${rawSplit}%` }}
            aria-hidden="true"
          >
            <span className="absolute left-1/2 top-[46%] w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-deep border-2 border-amber shadow-[0_2px_10px_rgba(0,0,0,.6)]">
              <span className="absolute top-1/2 left-[5px] w-1 h-1 border-t-[1.5px] border-r-[1.5px] border-silver -translate-y-1/2 -rotate-135" />
              <span className="absolute top-1/2 right-[5px] w-1 h-1 border-t-[1.5px] border-r-[1.5px] border-silver -translate-y-1/2 rotate-45" />
            </span>
          </div>

          <div className="absolute top-2 inset-x-2 flex justify-between pointer-events-none z-10" aria-hidden="true">
            <span className="px-[7px] py-[3px] rounded-full bg-deep/86 border border-silver/24 font-mono font-bold text-[8.5px] leading-none tracking-[0.08em] text-silver">
              RAW DNG
            </span>
            <span className="px-[7px] py-[3px] rounded-full bg-deep/86 border border-amber/58 font-mono font-bold text-[8.5px] leading-none tracking-[0.08em] text-amber">
              {recipe.code}
            </span>
          </div>

          <Slider.Root
            min={8}
            max={92}
            step={1}
            value={[rawSplit]}
            onValueChange={([v]) => setRawSplit(v)}
            className="absolute inset-0 z-8 flex items-center w-full h-full cursor-ew-resize touch-none select-none"
          >
            <Slider.Track className="relative w-full h-full bg-transparent">
              <Slider.Range className="hidden" />
            </Slider.Track>
            <Slider.Thumb
              aria-label={`Compare flat RAW with ${recipe.name} film recipe`}
              className="block w-8 h-full bg-transparent opacity-0 focus-visible:opacity-100"
            />
          </Slider.Root>
        </>
      )}

      {/* Rangefinder Bright-Line Corners, Green Horizon Level & Amber AF Reticle */}
      {showGuides && (
        <div className="vf__corners absolute inset-3.5 pointer-events-none z-5" aria-hidden="true">
          <span className="absolute top-0 left-0 w-3 h-3 border-t-[1.2px] border-l-[1.2px] border-silver/42" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-[1.2px] border-r-[1.2px] border-silver/42" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-[1.2px] border-l-[1.2px] border-silver/42" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-[1.2px] border-r-[1.2px] border-silver/42" />
        </div>
      )}

      {!rawCompare && (
        <>
          {showGuides && (
            <div
              className="vf__horizon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[118px] h-2.5 flex items-center justify-between pointer-events-none z-5"
              aria-hidden="true"
            >
              <span className="flex items-center gap-[3px]">
                <i className="block w-[30px] h-[1.5px] bg-[#34c759] opacity-85" />
                <i className="block w-[2.5px] h-[2.5px] rounded-full bg-[#34c759]" />
              </span>
              <i className="block w-[4.5px] h-[4.5px] rounded-full bg-[#34c759] shadow-[0_0_0_2.5px_rgba(52,199,89,.35)]" />
              <span className="flex items-center gap-[3px]">
                <i className="block w-[2.5px] h-[2.5px] rounded-full bg-[#34c759]" />
                <i className="block w-[30px] h-[1.5px] bg-[#34c759] opacity-85" />
              </span>
            </div>
          )}

          <m.div
            key={focusKey}
            className="vf__af absolute left-1/2 top-1/2 w-[42px] h-[42px] -mt-[21px] -ml-[21px] pointer-events-none z-6"
            aria-hidden="true"
            initial={{ scale: 1.15, opacity: 0.35 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            <span className="absolute top-0 left-0 w-[7px] h-[7px] border-t-[1.4px] border-l-[1.4px] border-[#ffd60a]/55" />
            <span className="absolute top-0 right-0 w-[7px] h-[7px] border-t-[1.4px] border-r-[1.4px] border-[#ffd60a]/55" />
            <span className="absolute bottom-0 left-0 w-[7px] h-[7px] border-b-[1.4px] border-l-[1.4px] border-[#ffd60a]/55" />
            <span className="absolute bottom-0 right-0 w-[7px] h-[7px] border-b-[1.4px] border-r-[1.4px] border-[#ffd60a]/55" />
            <span className="absolute left-1/2 top-1/2 w-[3px] h-[3px] -mt-[1.5px] -ml-[1.5px] rounded-full bg-[#ffd60a]/60" />
          </m.div>
        </>
      )}

      {/* GPU-transformed cinema aspect ratio mattes */}
      <m.div
        className="absolute inset-x-0 top-0 h-1/2 origin-top bg-[#050608] pointer-events-none z-9 will-change-transform"
        animate={{ scaleY: matte.y }}
        transition={lensTransition}
        aria-hidden="true"
      />
      <m.div
        className="absolute inset-x-0 bottom-0 h-1/2 origin-bottom bg-[#050608] pointer-events-none z-9 will-change-transform"
        animate={{ scaleY: matte.y }}
        transition={lensTransition}
        aria-hidden="true"
      />
      <m.div
        className="absolute inset-y-0 left-0 w-1/2 origin-left bg-[#050608] pointer-events-none z-9 will-change-transform"
        animate={{ scaleX: matte.x }}
        transition={lensTransition}
        aria-hidden="true"
      />
      <m.div
        className="absolute inset-y-0 right-0 w-1/2 origin-right bg-[#050608] pointer-events-none z-9 will-change-transform"
        animate={{ scaleX: matte.x }}
        transition={lensTransition}
        aria-hidden="true"
      />

      {aspect === 'xpan' && (
        <span
          className={cn(
            'absolute z-10 pointer-events-none',
            compact
              ? 'top-2 right-2.5 px-[7px] py-[3px] rounded-full bg-deep/85 border border-amber/50 text-amber font-mono font-bold text-[8.5px] leading-none'
              : 'left-1/2 top-[calc(50%-62px)] -translate-x-1/2 font-body font-bold text-[10px] leading-none text-silver [text-shadow:0_1px_4px_rgba(0,0,0,.75)]',
          )}
          aria-hidden="true"
        >
          65:24 · {lens}mm
        </span>
      )}

      {/* Mechanical shutter curtain blink */}
      <m.div
        className="absolute inset-0 bg-[#050608] pointer-events-none z-11"
        initial={false}
        animate={{ opacity: shutterFlash ? 0.92 : 0 }}
        transition={{ duration: 0.08 }}
        aria-hidden="true"
      />

      <span className="sr-only">
        {photo.alt} Active film look: {recipe.name} ({recipe.code}), {lens}mm lens, {dr},{' '}
        {aspect === 'xpan' ? '65:24 panoramic' : aspect} ratio.
      </span>
    </div>
  )
}
