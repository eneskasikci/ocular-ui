import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Dialog, Slider, ToggleGroup } from 'radix-ui'
import {
  ALL_STOCK_RECIPES,
  Q_GRAIN_CODE,
  type PhoneRecipeId,
} from '../../data/recipes'
import { OCULAR_HUD_SPEC } from '../../generated/ocularSpec'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'

interface Props {
  camera: CameraController
  isFree: boolean
  open: boolean
  onClose: () => void
  onSwitchToPro: () => void
}

type QParamId = (typeof OCULAR_HUD_SPEC.quickMenuRows)[number][number]['id']

const DIAL_CONFIG: Record<
  'highlightTone' | 'shadowTone' | 'color' | 'sharpness' | 'noiseReduction' | 'clarity',
  { title: string; min: number; max: number; step: number; cameraKey: 'highlightTone' | 'shadowTone' | 'colorSat' | 'sharpness' | 'noiseReduction' | 'clarity' }
> = {
  highlightTone: { title: 'Highlight Tone', min: -2, max: 4, step: 0.5, cameraKey: 'highlightTone' },
  shadowTone: { title: 'Shadow Tone', min: -2, max: 4, step: 0.5, cameraKey: 'shadowTone' },
  color: { title: 'Color Saturation', min: -4, max: 4, step: 1, cameraKey: 'colorSat' },
  sharpness: { title: 'Sharpness', min: -4, max: 4, step: 1, cameraKey: 'sharpness' },
  noiseReduction: { title: 'Noise Reduction', min: -4, max: 4, step: 1, cameraKey: 'noiseReduction' },
  clarity: { title: 'Clarity', min: -5, max: 5, step: 1, cameraKey: 'clarity' },
}

const OPTIC_BTN_CLS =
  'inphone-q__opt h-9 rounded-[10px] bg-graphite/90 border border-silver/16 flex flex-col items-center justify-center gap-0.5 cursor-pointer'

/** 1:1 port of `QuickMenuGridView`, `QuickMenuSections`, and `QuickMenuCells` (12-parameter grid). */
export function QuickMenuDialog({ camera, isFree, open, onClose, onSwitchToPro }: Props) {
  const { t } = useI18n()
  const [selectedParam, setSelectedParam] = useState<QParamId | null>(null)
  const {
    phoneRecipe,
    dr,
    colorChrome,
    qGrain,
    wbMode,
    wbKelvin,
    wbRed,
    wbBlue,
    highlightTone,
    shadowTone,
    colorSat,
    sharpness,
    noiseReduction,
    clarity,
    halationLevel,
    monoFilter,
    selectPhoneRecipe,
    cycleHudDr,
    cycleColorChrome,
    cycleQGrain,
    cycleHalationLevel,
    cycleMonoFilter,
    setRecipeParam,
    resetAllRecipeAdjustments,
  } = camera

  const isLocked = !phoneRecipe.canModify
  const kindLabel =
    phoneRecipe.kind === 'curated'
      ? 'CURATED PRESET'
      : phoneRecipe.kind === 'camera'
        ? 'CAMERA'
        : 'STOCK'

  const getCellDisplay = (id: QParamId): { value: string; active: boolean } => {
    switch (id) {
      case 'base':
        return { value: phoneRecipe.slotCode, active: true }
      case 'dynamicRange':
        return { value: dr, active: dr !== 'AUTO' }
      case 'colorChrome':
        return { value: colorChrome, active: colorChrome !== 'OFF' }
      case 'grain':
        return { value: Q_GRAIN_CODE[qGrain], active: qGrain !== 'off' }
      case 'whiteBalance':
        return {
          value:
            wbMode === 'kelvin'
              ? `${wbKelvin}K`
              : wbMode === 'auto'
                ? 'AUTO'
                : (OCULAR_HUD_SPEC.wbModes.find((m) => m.id === wbMode)?.label.slice(0, 4).toUpperCase() ?? 'AUTO'),
          active: true,
        }
      case 'wbShift':
        return {
          value: `${wbRed >= 0 ? `+${wbRed}` : wbRed}/${wbBlue >= 0 ? `+${wbBlue}` : wbBlue}`,
          active: wbRed !== 0 || wbBlue !== 0,
        }
      case 'highlightTone':
        return { value: `${highlightTone >= 0 ? '+' : ''}${highlightTone.toFixed(1)}`, active: Math.abs(highlightTone) > 0.01 }
      case 'shadowTone':
        return { value: `${shadowTone >= 0 ? '+' : ''}${shadowTone.toFixed(1)}`, active: Math.abs(shadowTone) > 0.01 }
      case 'color':
        return { value: `${colorSat >= 0 ? `+${colorSat}` : colorSat}`, active: colorSat !== 0 }
      case 'sharpness':
        return { value: `${sharpness >= 0 ? `+${sharpness}` : sharpness}`, active: sharpness !== 0 }
      case 'noiseReduction':
        return { value: `${noiseReduction >= 0 ? `+${noiseReduction}` : noiseReduction}`, active: noiseReduction !== 0 }
      case 'clarity':
        return { value: `${clarity >= 0 ? `+${clarity}` : clarity}`, active: clarity !== 0 }
    }
  }

  const hasResettable =
    phoneRecipe.canModify &&
    (dr !== 'AUTO' ||
      colorChrome !== 'OFF' ||
      qGrain !== 'off' ||
      wbMode !== 'auto' ||
      wbRed !== 0 ||
      wbBlue !== 0 ||
      highlightTone !== 0 ||
      shadowTone !== 0 ||
      colorSat !== 0 ||
      sharpness !== 0 ||
      noiseReduction !== 0 ||
      clarity !== 0 ||
      halationLevel !== 'off' ||
      monoFilter !== 'STD')

  const handleCellTap = (id: QParamId) => {
    if (isLocked) return
    switch (id) {
      case 'dynamicRange':
        cycleHudDr()
        break
      case 'colorChrome':
        cycleColorChrome()
        break
      case 'grain':
        cycleQGrain()
        break
      default:
        setSelectedParam((prev) => (prev === id ? null : id))
    }
  }

  const dialCfg = selectedParam && selectedParam in DIAL_CONFIG
    ? DIAL_CONFIG[selectedParam as keyof typeof DIAL_CONFIG]
    : null

  const dialValue = dialCfg ? camera[dialCfg.cameraKey] : 0

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose()
      }}
      modal={false}
    >
      <AnimatePresence>
        {open && (
          <Dialog.Content
            forceMount
            asChild
            onPointerDownOutside={(e) => e.preventDefault()}
            onFocusOutside={(e) => e.preventDefault()}
          >
            <m.div
              className="inphone-q absolute inset-x-2 bottom-3.5 z-35 p-2.5 rounded-[18px] bg-obsidian/94 backdrop-blur-md border border-silver/24 shadow-[0_16px_36px_rgba(0,0,0,.64)] flex flex-col gap-2 text-silver"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              aria-label={t.a11y.qMenuLabel}
            >
              {/* Grabber */}
              <div className="w-7 h-[3px] rounded-full bg-silver/32 mx-auto" aria-hidden="true" />

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <span className="block font-mono font-bold text-[7.5px] leading-none tracking-[0.08em] uppercase text-silver/68">
                    Q-MENU · 12 PARAMETERS
                  </span>
                  <Dialog.Title className="block font-display font-bold text-[14px] leading-[1.15] text-silver mt-0.5 truncate">
                    {phoneRecipe.name}
                  </Dialog.Title>
                  <span className="block font-mono font-bold text-[7.5px] leading-none tracking-[0.06em] uppercase text-silver/66 mt-0.5">
                    {phoneRecipe.slotCode} · {kindLabel}
                  </span>
                  <Dialog.Description className="sr-only">
                    {t.a11y.qMenuDescription}
                  </Dialog.Description>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  {hasResettable && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedParam(null)
                        resetAllRecipeAdjustments()
                      }}
                      aria-label="Reset all Q-Menu adjustments"
                      className="w-6 h-6 rounded-full bg-obsidian border border-amber/55 text-amber font-mono font-bold text-[11px] flex items-center justify-center p-0 cursor-pointer"
                    >
                      ↺
                    </button>
                  )}
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="w-6 h-6 rounded-full bg-graphite border border-silver/20 text-silver font-body font-bold text-[14px] leading-none flex items-center justify-center p-0 cursor-pointer"
                      aria-label={t.a11y.closeQMenu}
                    >
                      ×
                    </button>
                  </Dialog.Close>
                </div>
              </div>

              {/* Read-only banner for curated presets */}
              {isLocked && (
                <div className="px-2 py-1.5 rounded-[10px] bg-graphite border border-silver/16 flex items-center justify-between gap-1.5">
                  <span className="font-body text-[8.5px] leading-[1.2] text-silver/88">
                    Curated presets are read-only.
                  </span>
                  <button
                    type="button"
                    onClick={() => selectPhoneRecipe(phoneRecipe.stockId as PhoneRecipeId)}
                    className="px-2 py-1 rounded-full bg-obsidian border border-amber/70 font-mono font-extrabold text-[7.5px] text-amber uppercase shrink-0 cursor-pointer"
                  >
                    EDIT COPY
                  </button>
                </div>
              )}

              {/* 3x4 = 12-Parameter Grid */}
              <div className="flex flex-col gap-1">
                {OCULAR_HUD_SPEC.quickMenuRows.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-4 gap-1">
                    {row.map((param) => {
                      const { value, active } = getCellDisplay(param.id)
                      const isSel = selectedParam === param.id
                      return (
                        <button
                          key={param.id}
                          type="button"
                          onClick={() => handleCellTap(param.id)}
                          aria-label={`${param.name}, ${value}`}
                          className={cn(
                            'relative h-[38px] px-1 rounded-[9px] border flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors',
                            isSel
                              ? 'bg-amber/24 border-amber'
                              : active
                                ? 'bg-amber/14 border-amber/45'
                                : 'bg-graphite border-silver/16',
                          )}
                        >
                          <span className="font-mono font-bold text-[7px] leading-none text-silver/66">
                            {param.code}
                          </span>
                          <span
                            className={cn(
                              'font-mono font-extrabold text-[9px] leading-none truncate max-w-full',
                              active || isSel ? 'text-amber' : 'text-silver',
                            )}
                          >
                            {value}
                          </span>
                          {isLocked && (
                            <svg width="6.5" height="6.5" viewBox="0 0 16 16" fill="currentColor" className="absolute top-1 right-1 text-silver/50" aria-hidden="true">
                              <path d="M5 7V5a3 3 0 0 1 6 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1zm2 0h2V5a1 1 0 0 0-2 0v2z" />
                            </svg>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))}
              </div>

              {/* Inline Drawer (BASE picker or Tactile Dial Slider) */}
              {selectedParam === 'base' && !isLocked && (
                <div className="p-2 rounded-[10px] bg-obsidian/88 border border-amber/42 flex flex-col gap-1.5">
                  <span className="font-mono font-bold text-[7.5px] uppercase text-amber">
                    FILM BASE
                  </span>
                  <ToggleGroup.Root
                    type="single"
                    value={phoneRecipe.stockId}
                    onValueChange={(v) => {
                      if (!v) return
                      const stock = ALL_STOCK_RECIPES.find((s) => s.id === v)
                      if (stock && isFree && stock.tier === 'pro') {
                        onSwitchToPro()
                      }
                      selectPhoneRecipe(v as PhoneRecipeId)
                    }}
                    className="grid grid-cols-4 gap-1"
                  >
                    {ALL_STOCK_RECIPES.map((s) => {
                      const lockedStock = isFree && s.tier === 'pro'
                      return (
                        <ToggleGroup.Item
                          key={s.id}
                          value={s.id}
                          className="h-6 px-1 rounded-[7px] bg-graphite border border-silver/16 font-mono font-extrabold text-[8px] text-silver flex items-center justify-center gap-0.5 cursor-pointer data-[state=on]:bg-amber/22 data-[state=on]:border-amber data-[state=on]:text-amber"
                        >
                          <span>{s.slotCode}</span>
                          {lockedStock && <span className="text-[6.5px] text-amber">🔒</span>}
                        </ToggleGroup.Item>
                      )
                    })}
                  </ToggleGroup.Root>
                </div>
              )}

              {dialCfg && !isLocked && (
                <div className="p-2 rounded-[10px] bg-obsidian/88 border border-amber/42 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between font-mono text-[8px]">
                    <span className="font-bold uppercase text-silver/78">{dialCfg.title}</span>
                    <b className="text-amber font-extrabold">
                      {dialValue >= 0 ? `+${dialValue}` : dialValue}
                    </b>
                  </div>
                  <Slider.Root
                    min={dialCfg.min}
                    max={dialCfg.max}
                    step={dialCfg.step}
                    value={[dialValue]}
                    onValueChange={([v]) => setRecipeParam(dialCfg.cameraKey, v)}
                    className="relative flex items-center w-full h-4 cursor-pointer touch-none select-none"
                  >
                    <Slider.Track className="relative h-1 w-full rounded-full bg-silver/20">
                      <Slider.Range className="absolute h-full rounded-full bg-amber/55" />
                    </Slider.Track>
                    <Slider.Thumb
                      aria-label={dialCfg.title}
                      className="block w-3.5 h-3.5 rounded-full bg-amber border border-obsidian"
                    />
                  </Slider.Root>
                </div>
              )}

              {/* Footer: Pro Optics or Free Upsell */}
              {!isFree ? (
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => !isLocked && cycleHalationLevel()}
                    className={cn(
                      OPTIC_BTN_CLS,
                      halationLevel !== 'off' && 'bg-amber/16 border-amber/45',
                    )}
                  >
                    <span className="font-mono font-bold text-[7px] leading-none text-silver/68 uppercase">
                      HALATION
                    </span>
                    <b
                      className={cn(
                        'font-mono font-extrabold text-[9px] leading-none uppercase',
                        halationLevel !== 'off' ? 'text-amber' : 'text-silver',
                      )}
                    >
                      {halationLevel.toUpperCase()}
                    </b>
                  </button>
                  <button
                    type="button"
                    onClick={() => !isLocked && cycleMonoFilter()}
                    className={cn(
                      OPTIC_BTN_CLS,
                      monoFilter !== 'STD' && 'bg-amber/16 border-amber/45',
                    )}
                  >
                    <span className="font-mono font-bold text-[7px] leading-none text-silver/68 uppercase">
                      MONO FILTER
                    </span>
                    <b
                      className={cn(
                        'font-mono font-extrabold text-[9px] leading-none',
                        monoFilter !== 'STD' ? 'text-amber' : 'text-silver',
                      )}
                    >
                      {monoFilter}
                    </b>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 pt-1.5 border-t border-silver/12">
                  <span className="px-1.5 py-0.5 rounded-full bg-burgundy text-silver font-mono font-extrabold text-[7px] leading-none tracking-[0.06em] shrink-0">
                    PRO
                  </span>
                  <span className="flex-1 font-body font-medium text-[9px] leading-[1.2] text-silver/78 min-w-0 truncate">
                    Halation and analog optics
                  </span>
                  <button
                    type="button"
                    className="h-6 px-2.5 rounded-full bg-graphite border border-silver/24 text-silver font-body font-bold text-[8.5px] leading-none whitespace-nowrap shrink-0 cursor-pointer hover:border-amber"
                    onClick={onSwitchToPro}
                  >
                    See Pro
                  </button>
                </div>
              )}
            </m.div>
          </Dialog.Content>
        )}
      </AnimatePresence>
    </Dialog.Root>
  )
}
