import { useState } from 'react'
import { AnimatePresence, type Transition } from 'motion/react'
import * as m from 'motion/react-m'
import { Slider, Toggle, ToggleGroup } from 'radix-ui'
import { ASPECT_RATIOS, formatEv, LENSES, type LensMm } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'
import { ShutterDeck } from './ShutterDeck'

interface Props {
  camera: CameraController
  isFree: boolean
  qOpen: boolean
  onToggleQ: () => void
  guidesOn: boolean
  onToggleGuides: (v: boolean) => void
  reduceMotion: boolean
  chromeAnimate?: { opacity: number }
  chromeTransition?: Transition
  disablePointer?: boolean
}

const FN_TILE_BASE =
  'fn-tile relative flex-1 min-w-0 h-[38px] rounded-[10px] flex flex-col items-center justify-center gap-0.5 px-0.5 cursor-pointer border'
const FN_TILE_IDLE = 'bg-obsidian/74 border-silver/18'
const FN_TILE_ACTIVE =
  "active bg-[linear-gradient(180deg,rgba(232,131,42,.18),rgba(17,18,21,.74))] border-amber/68 after:content-[''] after:absolute after:top-1 after:right-1 after:w-1 after:h-1 after:rounded-full after:bg-amber"
const SIMPLE_PILL_BASE =
  'h-[30px] px-2 rounded-full border inline-flex items-center justify-center gap-[3.5px] font-body font-semibold text-[9px] leading-none tracking-[-0.01em] whitespace-nowrap shrink-0 cursor-pointer transition-[border-color,background-color,color] duration-180 ease-ocular motion-reduce:transition-none'

function FlashToggle({ pressed, onPressedChange }: { pressed: boolean; onPressedChange: (v: boolean) => void }) {
  return (
    <Toggle.Root
      pressed={pressed}
      onPressedChange={onPressedChange}
      aria-label="Toggle flash"
      className="w-7 h-7 rounded-full flex items-center justify-center bg-obsidian/72 border border-silver/20 text-silver/82 shrink-0 p-0 cursor-pointer data-[state=on]:bg-amber/18 data-[state=on]:border-amber/72 data-[state=on]:text-amber"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 3L7 13h5l-1 8 6-10h-5l1-8z" fill="currentColor" />
        {!pressed && (
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        )}
      </svg>
    </Toggle.Root>
  )
}

function FnTile({
  label,
  value,
  active,
  onClick,
}: {
  label: string
  value: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={cn(FN_TILE_BASE, active ? FN_TILE_ACTIVE : FN_TILE_IDLE)} onClick={onClick}>
      <span className="font-mono font-bold text-[7px] leading-none text-silver/68 whitespace-nowrap">{label}</span>
      <span className={cn('font-mono font-extrabold text-[9px] leading-none whitespace-nowrap', active ? 'text-amber' : 'text-silver')}>
        {value}
      </span>
    </button>
  )
}

/** Lower portrait control deck: inline EV ruler, focal/aspect row, Pro F1-F4 or Free pills, Exposure Capsule, ShutterDeck. */
export function PortraitDeck({
  camera,
  isFree,
  qOpen,
  onToggleQ,
  guidesOn,
  onToggleGuides,
  reduceMotion,
  chromeAnimate,
  chromeTransition,
  disablePointer = false,
}: Props) {
  const [focalOpen, setFocalOpen] = useState(false)
  const [evDialOpen, setEvDialOpen] = useState(false)
  const [freeExposureOpen, setFreeExposureOpen] = useState(false)
  const [flashOn, setFlashOn] = useState(false)

  const {
    recipe,
    lens,
    ev,
    dr,
    aspect,
    grain,
    halation,
    selectLens,
    setEv,
    cycleDr,
    cycleRecipe,
    cycleAspect,
    cycleGrain,
    toggleHalation,
    setHudLayout,
  } = camera

  const showExposureCapsule = !isFree || freeExposureOpen
  const showEvDial = evDialOpen && showExposureCapsule
  const toggleFreeExposure = () => {
    setEvDialOpen(false)
    setFreeExposureOpen((v) => !v)
  }

  const aspectLabel = ASPECT_RATIOS.find((r) => r.id === aspect)?.label ?? '4:3'
  const grainLabel = grain === 'off' ? 'OFF' : grain === 'weak' ? 'WEAK' : 'HIGH'
  const evModified = Math.abs(ev) > 0.05
  const rulerOffsetPx = -(ev * 22)

  return (
    <>
      <m.div
        className={cn(
          'bottom-scrim absolute inset-x-0 bottom-0 h-[210px] bg-[linear-gradient(180deg,rgba(11,12,14,0)_0%,rgba(11,12,14,.38)_32%,rgba(11,12,14,.88)_70%,#050608_100%)] origin-bottom transition-transform duration-220 ease-ocular motion-reduce:transition-none pointer-events-none z-12',
          isFree && !freeExposureOpen && 'bottom-scrim--compact scale-y-[0.78]',
        )}
        aria-hidden="true"
        initial={false}
        animate={chromeAnimate}
        transition={chromeTransition}
      />

      <m.div
        className="portrait-deck absolute inset-x-0 bottom-3.5 px-[9px] flex flex-col gap-[5px] z-18"
        initial={false}
        animate={chromeAnimate}
        transition={chromeTransition}
        style={disablePointer ? { pointerEvents: 'none' } : undefined}
      >
        <AnimatePresence>
          {showEvDial && (
            <m.div
              className="px-2 py-1.5 rounded-xl bg-obsidian/84 backdrop-blur-[18px] border border-amber/48 flex flex-col gap-[5px]"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: EASE_OUT }}
            >
              <div className="flex items-center justify-between font-mono font-bold text-[8.5px] leading-none text-silver/78">
                <span>EXPOSURE COMP</span>
                <div className="flex items-center gap-1.5">
                  {evModified && (
                    <button
                      type="button"
                      className="px-1.5 py-0.5 rounded-full bg-black/55 border border-silver/22 text-amber font-mono font-extrabold text-[7.5px] leading-none cursor-pointer"
                      onClick={() => setEv(0)}
                    >
                      ↺ RESET
                    </button>
                  )}
                  <b className="text-amber text-[10px]">{formatEv(ev)} EV</b>
                </div>
              </div>
              <div className="relative h-6 rounded-[7px] bg-[#0c0c0e]/90 border border-silver/14 overflow-hidden">
                <div
                  className="ev-ruler absolute top-0 -left-[80%] h-full w-[260%] transition-transform duration-120 ease-ocular motion-reduce:transition-none"
                  style={{ transform: `translate3d(${rulerOffsetPx}px, 0, 0)` }}
                  aria-hidden="true"
                />
                <div className="absolute left-1/2 top-[3px] bottom-[3px] w-0.5 -ml-px rounded-[1px] bg-amber" aria-hidden="true" />
                <Slider.Root
                  min={-3}
                  max={3}
                  step={1 / 3}
                  value={[ev]}
                  onValueChange={([v]) => setEv(Math.round(v * 3) / 3)}
                  className="absolute inset-0 flex items-center w-full h-full cursor-ew-resize touch-none select-none"
                >
                  <Slider.Track className="relative w-full h-full bg-transparent">
                    <Slider.Range className="hidden" />
                  </Slider.Track>
                  <Slider.Thumb
                    aria-label="In-camera exposure compensation EV"
                    className="block w-5 h-full bg-transparent opacity-0 focus-visible:opacity-100"
                  />
                </Slider.Root>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        {/* Optical Row: Expandable Focal Pill + Aspect Ratio Pill */}
        <div className="flex items-center justify-between gap-[5px]">
          <div
            className={cn(
              'inline-flex items-center gap-0.5 p-0.5 rounded-full bg-obsidian/64 border border-silver/22 backdrop-blur-md',
              focalOpen && 'flex-1',
            )}
          >
            {!focalOpen ? (
              <button
                type="button"
                className="inline-flex items-center gap-1 h-[26px] px-2.5 rounded-full bg-amber/20 border border-amber/60 font-mono font-extrabold text-[9.5px] leading-none text-amber cursor-pointer"
                onClick={() => setFocalOpen(true)}
                aria-expanded={false}
              >
                <span>{lens}mm</span>
                <span className="text-[10px] opacity-78">›</span>
              </button>
            ) : (
              <ToggleGroup.Root
                type="single"
                value={String(lens)}
                onValueChange={(v) => {
                  if (!v) setFocalOpen(false)
                  else selectLens(Number(v) as LensMm)
                }}
                aria-label="Prime focal lengths"
                className="flex flex-1 items-center gap-0.5"
              >
                {LENSES.map((mm) => (
                  <ToggleGroup.Item
                    key={mm}
                    value={String(mm)}
                    className="flex-1 h-[26px] p-0 border border-transparent rounded-full bg-transparent font-mono font-bold text-[9px] leading-none text-silver/84 cursor-pointer data-[state=on]:font-extrabold data-[state=on]:text-amber data-[state=on]:bg-amber/24 data-[state=on]:border-amber/65"
                  >
                    {mm}
                  </ToggleGroup.Item>
                ))}
              </ToggleGroup.Root>
            )}
          </div>

          <button
            type="button"
            className={cn(
              'h-[30px] px-[9px] rounded-full inline-flex items-center justify-center gap-1 font-mono font-extrabold text-[9.5px] leading-none backdrop-blur-md shrink-0 cursor-pointer border',
              aspect !== '4:3'
                ? 'bg-amber/20 border-amber/60 text-amber'
                : 'bg-obsidian/64 border-silver/22 text-silver/92',
            )}
            onClick={cycleAspect}
            title="Cycle framing aspect ratio"
          >
            <svg width="12" height="10" viewBox="0 0 24 20" aria-hidden="true">
              <rect x="1.5" y="2" width="21" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="2.1" />
              <path d="M5.5 9V6h3M18.5 11v3h-3" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{aspectLabel}</span>
          </button>
        </div>

        {/* Pro Function Row vs Free Simple Control Row */}
        <AnimatePresence mode="wait" initial={false}>
          {!isFree ? (
            <m.div
              key="pro-row"
              className="flex items-center gap-1"
              role="group"
              aria-label="Camera function tiles"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: EASE_OUT }}
            >
              <FlashToggle pressed={flashOn} onPressedChange={setFlashOn} />
              <div className="w-px h-[22px] bg-silver/22 shrink-0" aria-hidden="true" />
              <FnTile label="F1 DR" value={dr} active={dr !== 'DR100'} onClick={cycleDr} />
              <FnTile label="F2 TONE" value={recipe.tone} active={recipe.tone !== '0 / 0'} onClick={cycleRecipe} />
              <FnTile label="F3 GRN" value={grainLabel} active={grain !== 'off'} onClick={cycleGrain} />
              <Toggle.Root
                pressed={halation}
                onPressedChange={toggleHalation}
                className={cn(FN_TILE_BASE, halation ? FN_TILE_ACTIVE : FN_TILE_IDLE)}
              >
                <span className="font-mono font-bold text-[7px] leading-none text-silver/68 whitespace-nowrap">F4 HAL</span>
                <span className={cn('font-mono font-extrabold text-[9px] leading-none whitespace-nowrap', halation ? 'text-amber' : 'text-silver')}>
                  {halation ? 'ON' : 'OFF'}
                </span>
              </Toggle.Root>
              <button
                type="button"
                onClick={onToggleQ}
                aria-pressed={qOpen}
                aria-label="Open Quick Menu"
                className={cn(
                  'q-tile w-[34px] h-[38px] rounded-[10px] flex items-center justify-center font-mono font-extrabold text-[13px] leading-none text-amber shrink-0 p-0 cursor-pointer border',
                  qOpen ? 'bg-amber/24 border-amber' : 'bg-obsidian/74 border-silver/22',
                )}
              >
                Q
              </button>
            </m.div>
          ) : (
            <m.div
              key="free-row"
              className="simple-row flex items-center justify-center gap-1"
              role="group"
              aria-label="Camera simple controls"
              initial={reduceMotion ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: reduceMotion ? 0 : 0.16, ease: EASE_OUT }}
            >
              <FlashToggle pressed={flashOn} onPressedChange={setFlashOn} />
              <div className="w-px h-[22px] bg-silver/22 shrink-0" aria-hidden="true" />
              <Toggle.Root
                pressed={freeExposureOpen}
                onPressedChange={toggleFreeExposure}
                className={cn(
                  'simple-pill',
                  SIMPLE_PILL_BASE,
                  freeExposureOpen || evModified
                    ? 'bg-amber/18 border-amber/68 text-amber'
                    : 'bg-obsidian/76 border-silver/20 text-silver hover:border-silver/38 hover:bg-graphite/82',
                )}
              >
                <span className="text-amber font-bold" aria-hidden="true">±</span>
                <span>Exposure</span>
                {evModified && (
                  <span className="simple-pill__m px-1 py-[1.5px] rounded-full bg-amber/22 text-amber font-mono font-extrabold text-[7px] leading-none">
                    M
                  </span>
                )}
              </Toggle.Root>
              <button
                type="button"
                className={cn(
                  'simple-pill',
                  SIMPLE_PILL_BASE,
                  qOpen
                    ? 'bg-amber/18 border-amber/68 text-amber'
                    : 'bg-obsidian/76 border-silver/20 text-silver hover:border-silver/38 hover:bg-graphite/82',
                )}
                aria-pressed={qOpen}
                onClick={onToggleQ}
              >
                <span className="text-amber font-mono font-extrabold text-[10px] leading-none" aria-hidden="true">Q</span>
                <span>Film</span>
              </button>
              <button
                type="button"
                className={cn(
                  'simple-pill simple-pill--pro',
                  SIMPLE_PILL_BASE,
                  'bg-obsidian/76 border-amber/38 text-silver hover:border-amber/76 hover:bg-amber/16',
                )}
                onClick={() => setHudLayout('pro')}
                title="Switch simulator to Pro HUD layout"
              >
                <span className="text-amber font-bold">✦ Pro</span>
              </button>
            </m.div>
          )}
        </AnimatePresence>

        {/* 4-Cell Exposure Triangle Capsule */}
        <AnimatePresence initial={false}>
          {showExposureCapsule && (
            <m.div
              className="exposure-capsule grid grid-cols-4 gap-[3px] p-1 rounded-[13px] bg-obsidian/64 border border-silver/20 backdrop-blur-md"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: reduceMotion ? 0 : 0.18, ease: EASE_OUT }}
            >
              <div className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-[9px] border border-transparent">
                <span className="font-mono font-bold text-[7px] leading-none tracking-[0.04em] text-silver/58 whitespace-nowrap">SS AUTO</span>
                <span className="font-mono font-extrabold text-[9px] leading-none tabular-nums text-silver whitespace-nowrap">1/250</span>
              </div>
              <div className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-[9px] border border-transparent">
                <span className="font-mono font-bold text-[7px] leading-none tracking-[0.04em] text-silver/58 whitespace-nowrap">ISO AUTO</span>
                <span className="font-mono font-extrabold text-[9px] leading-none tabular-nums text-silver whitespace-nowrap">100</span>
              </div>
              <button
                type="button"
                className={cn(
                  'flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-[9px] border cursor-pointer',
                  evDialOpen
                    ? 'bg-amber/22 border-amber'
                    : evModified
                      ? 'bg-amber/14 border-transparent'
                      : 'bg-transparent border-transparent',
                )}
                onClick={() => setEvDialOpen((v) => !v)}
                aria-expanded={evDialOpen}
              >
                <span className={cn('font-mono font-bold text-[7px] leading-none tracking-[0.04em] whitespace-nowrap', evDialOpen ? 'text-amber' : 'text-silver/58')}>
                  EV
                </span>
                <span className={cn('font-mono font-extrabold text-[9px] leading-none tabular-nums whitespace-nowrap', evDialOpen || evModified ? 'text-amber' : 'text-silver')}>
                  {formatEv(ev)}
                </span>
              </button>
              <div className="flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-[9px] border border-transparent">
                <span className="font-mono font-bold text-[7px] leading-none tracking-[0.04em] text-silver/58 whitespace-nowrap">WB</span>
                <span className="font-mono font-extrabold text-[9px] leading-none tabular-nums text-silver whitespace-nowrap">{recipe.wbShort}</span>
              </div>
            </m.div>
          )}
        </AnimatePresence>

        <ShutterDeck
          camera={camera}
          isFree={isFree}
          guidesOn={guidesOn}
          onToggleGuides={onToggleGuides}
          reduceMotion={reduceMotion}
        />
      </m.div>
    </>
  )
}
