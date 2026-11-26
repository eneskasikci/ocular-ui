import { lazy, Suspense, useState } from 'react'
import { AnimatePresence, type Transition } from 'motion/react'
import * as m from 'motion/react-m'
import { ToggleGroup } from 'radix-ui'
import {
  ASPECT_RATIOS,
  formatEv,
  formatToneSummary,
  LENSES,
  Q_GRAIN_CODE,
  type FlashMode,
  type LensMm,
} from '../../data/recipes'
import { OCULAR_HUD_SPEC } from '../../generated/ocularSpec'
import type { ActiveExposureControl, CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'
import { ShutterDeck } from './ShutterDeck'

const ExposurePopovers = lazy(() =>
  import('./ExposurePopovers').then((mod) => ({ default: mod.ExposurePopovers })),
)

interface Props {
  camera: CameraController
  isFree: boolean
  qOpen: boolean
  onToggleQ: () => void
  onOpenRecipeMenu: () => void
  onSwitchToPro: () => void
  chromeAnimate?: { opacity: number }
  chromeTransition?: Transition
  disablePointer?: boolean
}

const FN_TILE_BASE =
  'fn-tile relative flex-1 min-w-0 h-[38px] rounded-[10px] flex flex-col items-center justify-center gap-0.5 px-0.5 cursor-pointer border'
const FN_TILE_IDLE = 'bg-obsidian/74 border-silver/18'
const FN_TILE_ACTIVE =
  "active bg-[linear-gradient(180deg,rgba(232,131,42,.18),rgba(17,18,21,.74))] border-amber/68 after:content-[''] after:absolute after:top-1 after:right-1 after:w-1 after:h-1 after:rounded-full after:bg-amber"
const SIMPLE_TILE_BASE =
  'h-[32px] px-2 rounded-[10px] border inline-flex items-center justify-center gap-1 font-mono font-bold text-[8.5px] leading-none whitespace-nowrap shrink-0 cursor-pointer transition-[border-color,background-color,color] duration-180 ease-ocular motion-reduce:transition-none'

function FlashCircleButton({
  mode,
  ariaLabel,
  onCycle,
}: {
  mode: FlashMode
  ariaLabel: string
  onCycle: () => void
}) {
  const isActive = mode !== 'OFF'
  return (
    <button
      type="button"
      onClick={onCycle}
      aria-label={`${ariaLabel}: ${mode}`}
      title={`Flash: ${mode}`}
      className={cn(
        'w-7 h-7 rounded-full flex items-center justify-center border shrink-0 p-0 cursor-pointer transition-colors',
        isActive
          ? 'bg-amber/18 border-amber/72 text-amber'
          : 'bg-obsidian/72 border-silver/20 text-silver/82',
      )}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13 3L7 13h5l-1 8 6-10h-5l1-8z" fill="currentColor" />
        {mode === 'OFF' && (
          <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        )}
        {mode === 'AUTO' && (
          <text x="17" y="21" fontSize="9" fontWeight="900" fill="currentColor" fontFamily="ui-monospace, monospace">
            A
          </text>
        )}
      </svg>
    </button>
  )
}

function FnTile({
  label,
  value,
  active,
  locked,
  onClick,
}: {
  label: string
  value: string
  active: boolean
  locked: boolean
  onClick: () => void
}) {
  return (
    <button type="button" className={cn(FN_TILE_BASE, active ? FN_TILE_ACTIVE : FN_TILE_IDLE)} onClick={onClick}>
      <span className="inline-flex items-center gap-0.5 font-mono font-bold text-[6.8px] leading-none text-silver/68 whitespace-nowrap">
        <span>{label}</span>
        {locked && (
          <svg width="6" height="6" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M5 7V5a3 3 0 0 1 6 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1zm2 0h2V5a1 1 0 0 0-2 0v2z" />
          </svg>
        )}
      </span>
      <span className={cn('font-mono font-extrabold text-[8.8px] leading-none whitespace-nowrap', active ? 'text-amber' : 'text-silver')}>
        {value}
      </span>
    </button>
  )
}

/** Lower portrait control deck matching `CameraControlsBarView.swift` 1:1. */
export function PortraitDeck({
  camera,
  isFree,
  qOpen,
  onToggleQ,
  onOpenRecipeMenu,
  onSwitchToPro,
  chromeAnimate,
  chromeTransition,
  disablePointer = false,
}: Props) {
  const { t } = useI18n()
  const [focalOpen, setFocalOpen] = useState(false)
  const [activeControl, setActiveControl] = useState<ActiveExposureControl | null>(null)
  const [freeExposureOpen, setFreeExposureOpen] = useState(false)

  const {
    phoneRecipe,
    lens,
    ev,
    dr,
    aspect,
    qGrain,
    halationLevel,
    highlightTone,
    shadowTone,
    shutterSpeed,
    iso,
    wbMode,
    wbKelvin,
    wbRed,
    wbBlue,
    flashMode,
    framingGuide,
    selectLens,
    cycleHudDr,
    cycleAspect,
    cycleQGrain,
    cycleHalationLevel,
    cycleFlashMode,
    cycleFramingGuide,
    selectPhoneRecipe,
  } = camera

  const showExposureCapsule = !isFree || freeExposureOpen || activeControl !== null
  const isManualExposure = shutterSpeed !== 'AUTO' || iso !== 'AUTO' || Math.abs(ev) > 0.05
  const isWbOverridden = wbMode !== 'auto' || wbRed !== 0 || wbBlue !== 0
  const evModified = Math.abs(ev) > 0.05
  const aspectLabel = ASPECT_RATIOS.find((r) => r.id === aspect)?.label ?? '4:3'
  const isLocked = !phoneRecipe.canModify

  const toggleFreeExposure = () => {
    setFreeExposureOpen((v) => {
      if (v) setActiveControl(null)
      return !v
    })
  }

  const getShortcutTile = (shortcutId: string) => {
    switch (shortcutId) {
      case 'dynamicRange':
        return {
          value: dr,
          active: dr !== 'AUTO',
          locked: isLocked,
          onClick: () => !isLocked && cycleHudDr(),
        }
      case 'toneCurve':
        return {
          value: formatToneSummary(highlightTone, shadowTone),
          active: Math.abs(highlightTone) > 0.01 || Math.abs(shadowTone) > 0.01,
          locked: isLocked,
          onClick: () => !isLocked && onToggleQ(),
        }
      case 'grain':
        return {
          value: Q_GRAIN_CODE[qGrain],
          active: qGrain !== 'off',
          locked: isLocked,
          onClick: () => !isLocked && cycleQGrain(),
        }
      case 'halation':
        return {
          value: halationLevel.toUpperCase(),
          active: halationLevel !== 'off',
          locked: isLocked,
          onClick: () => !isLocked && cycleHalationLevel(),
        }
      case 'aspectRatio':
        return { value: aspectLabel, active: aspect !== '4:3', locked: false, onClick: cycleAspect }
      case 'framingGuide':
        return {
          value: framingGuide === 'clean' ? 'CLEAR' : framingGuide === 'ruleOfThirds' ? 'GRID' : 'RANGE',
          active: framingGuide !== 'clean',
          locked: false,
          onClick: cycleFramingGuide,
        }
      default:
        return { value: 'STD', active: false, locked: false, onClick: () => selectPhoneRecipe('std') }
    }
  }

  return (
    <>
      <m.div
        className={cn(
          'bottom-scrim absolute inset-x-0 bottom-0 h-[210px] bg-[linear-gradient(180deg,rgba(11,12,14,0)_0%,rgba(11,12,14,.38)_32%,rgba(11,12,14,.88)_70%,#050608_100%)] origin-bottom transition-transform duration-220 ease-ocular motion-reduce:transition-none pointer-events-none z-12',
          isFree && !showExposureCapsule && 'bottom-scrim--compact scale-y-[0.78]',
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
        {/* Column-aligned Vertical Stop Sliders / Inline WB Console */}
        <AnimatePresence>
          {activeControl && (
            <Suspense fallback={null}>
              <ExposurePopovers
                camera={camera}
                activeControl={activeControl}
                onClose={() => setActiveControl(null)}
              />
            </Suspense>
          )}
        </AnimatePresence>

        {/* Optical + Function rows hide when an exposure slider/WB console is open (`CameraControlsBarView.swift`) */}
        {activeControl === null && (
          <>
            <div className="flex items-center justify-between gap-[5px]">
              <div
                className={cn(
                  'inline-flex items-center gap-0.5 p-0.5 rounded-full bg-obsidian/84 border border-silver/22',
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
                      else {
                        selectLens(Number(v) as LensMm)
                        setFocalOpen(false)
                      }
                    }}
                    aria-label={t.a11y.primeFocalLengths}
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
                  'h-[30px] px-[9px] rounded-full inline-flex items-center justify-center gap-1 font-mono font-extrabold text-[9.5px] leading-none shrink-0 cursor-pointer border',
                  aspect !== '4:3'
                    ? 'bg-amber/20 border-amber/60 text-amber'
                    : 'bg-obsidian/84 border-silver/22 text-silver/92',
                )}
                onClick={cycleAspect}
                title={t.a11y.cycleAspect}
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
                  aria-label={t.a11y.cameraFnTiles}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                >
                  <FlashCircleButton mode={flashMode} ariaLabel={t.a11y.toggleFlash} onCycle={cycleFlashMode} />
                  <div className="w-px h-[22px] bg-silver/22 shrink-0" aria-hidden="true" />
                  {OCULAR_HUD_SPEC.proFunctionButtons.map((btn) => {
                    const tile = getShortcutTile(btn.id)
                    return (
                      <FnTile
                        key={btn.slot}
                        label={`${btn.slot} ${btn.label}`}
                        value={tile.value}
                        active={tile.active}
                        locked={tile.locked}
                        onClick={tile.onClick}
                      />
                    )
                  })}
                  <button
                    type="button"
                    onClick={onToggleQ}
                    aria-pressed={qOpen}
                    aria-label={t.a11y.openQMenu}
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
                  aria-label={t.a11y.cameraSimpleControls}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.16, ease: EASE_OUT }}
                >
                  <FlashCircleButton mode={flashMode} ariaLabel={t.a11y.toggleFlash} onCycle={cycleFlashMode} />
                  <div className="w-px h-[22px] bg-silver/22 shrink-0" aria-hidden="true" />
                  <button
                    type="button"
                    onClick={toggleFreeExposure}
                    aria-pressed={freeExposureOpen}
                    className={cn(
                      'simple-pill',
                      SIMPLE_TILE_BASE,
                      freeExposureOpen || isManualExposure
                        ? 'bg-amber/18 border-amber/68 text-amber'
                        : 'bg-obsidian/76 border-silver/20 text-silver hover:border-silver/38 hover:bg-graphite/82',
                    )}
                  >
                    <span className="text-amber font-bold" aria-hidden="true">±</span>
                    <span>{t.phone.exposure}</span>
                    {isManualExposure && (
                      <span className="px-1 py-[1px] rounded-[4px] bg-amber/22 text-amber font-mono font-extrabold text-[7px] leading-none">
                        M
                      </span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'simple-pill',
                      SIMPLE_TILE_BASE,
                      qOpen
                        ? 'bg-amber/18 border-amber/68 text-amber'
                        : 'bg-obsidian/76 border-silver/20 text-silver hover:border-silver/38 hover:bg-graphite/82',
                    )}
                    aria-pressed={qOpen}
                    onClick={onToggleQ}
                  >
                    <span className="text-amber font-mono font-extrabold text-[10px] leading-none" aria-hidden="true">Q</span>
                    <span>{t.phone.film}</span>
                  </button>
                  <button
                    type="button"
                    className={cn(
                      'simple-pill simple-pill--pro',
                      SIMPLE_TILE_BASE,
                      'bg-obsidian/76 border-amber/38 text-amber hover:border-amber/76 hover:bg-amber/16',
                    )}
                    onClick={onSwitchToPro}
                    title={t.a11y.switchToProHud}
                  >
                    <span>{t.phone.proPill}</span>
                  </button>
                </m.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* 4-Cell Exposure Triangle Capsule (`SS | ISO | EV | WB`) */}
        <AnimatePresence initial={false}>
          {showExposureCapsule && (
            <m.div
              className="exposure-capsule grid grid-cols-4 gap-[3px] p-1 rounded-[14px] bg-obsidian/84 border border-silver/20"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.18, ease: EASE_OUT }}
            >
              {(
                [
                  {
                    id: 'shutterSpeed' as const,
                    keyLabel: shutterSpeed === 'AUTO' ? 'SS AUTO' : 'SS',
                    valLabel: shutterSpeed === 'AUTO' ? '1/250' : shutterSpeed,
                    manual: shutterSpeed !== 'AUTO',
                  },
                  {
                    id: 'iso' as const,
                    keyLabel: iso === 'AUTO' ? 'ISO AUTO' : 'ISO',
                    valLabel: iso === 'AUTO' ? '100' : iso,
                    manual: iso !== 'AUTO',
                  },
                  {
                    id: 'ev' as const,
                    keyLabel: 'EV',
                    valLabel: formatEv(ev),
                    manual: evModified,
                  },
                  {
                    id: 'whiteBalance' as const,
                    keyLabel: 'WB',
                    valLabel: `${wbKelvin}K`,
                    manual: isWbOverridden,
                  },
                ] as const
              ).map((cell) => {
                const selected = activeControl === cell.id
                return (
                  <button
                    key={cell.id}
                    type="button"
                    aria-expanded={selected}
                    onClick={() => setActiveControl((cur) => (cur === cell.id ? null : cell.id))}
                    className={cn(
                      'flex flex-col items-center justify-center gap-0.5 px-0.5 py-1 rounded-[10px] border cursor-pointer',
                      selected
                        ? 'bg-amber/22 border-amber'
                        : cell.manual
                          ? 'bg-amber/14 border-transparent'
                          : 'bg-transparent border-transparent hover:bg-silver/6',
                    )}
                  >
                    <span
                      className={cn(
                        'font-mono font-bold text-[7px] leading-none tracking-[0.04em] whitespace-nowrap',
                        selected ? 'text-amber' : 'text-silver/58',
                      )}
                    >
                      {cell.keyLabel}
                    </span>
                    <span
                      className={cn(
                        'font-mono font-extrabold text-[9px] leading-none tabular-nums whitespace-nowrap',
                        selected || cell.manual ? 'text-amber' : 'text-silver',
                      )}
                    >
                      {cell.valLabel}
                    </span>
                  </button>
                )
              })}
            </m.div>
          )}
        </AnimatePresence>

        <ShutterDeck camera={camera} onOpenRecipeMenu={onOpenRecipeMenu} />
      </m.div>
    </>
  )
}
