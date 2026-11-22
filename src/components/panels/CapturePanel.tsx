import { memo } from 'react'
import { Toggle } from 'radix-ui'
import {
  ASPECT_RATIOS,
  DR_MODES,
  formatEv,
  GRAIN_LEVELS,
  LENSES,
  type LensMm,
} from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import {
  HEADING_CLS,
  LABEL_CLS,
  LEDE_CLS,
  PANEL_CLS,
  RangeSlider,
  RESET_BTN_CLS,
  SegmentedControl,
} from './controls'

const DR_OPTIONS = DR_MODES.map((m) => ({ value: m, label: m }))
const RATIO_OPTIONS = ASPECT_RATIOS.map((r) => ({ value: r.id, label: r.label, pro: r.pro }))
const LENS_OPTIONS = LENSES.map((mm) => ({ value: String(mm), label: `${mm}mm` }))

interface Props {
  headingId: string
  camera: CameraController
}

export const CapturePanel = memo(function CapturePanel({ headingId, camera }: Props) {
  const { t } = useI18n()
  const grainOptions = GRAIN_LEVELS.map((g) => ({ value: g.id, label: t.capture.grainLevels[g.id] }))
  const {
    ev,
    dr,
    aspect,
    grain,
    halation,
    lens,
    setEv,
    setDr,
    setAspect,
    setGrain,
    toggleHalation,
    selectLens,
  } = camera

  return (
    <div className="flex flex-col gap-3.5">
      <div className="pool-scrim">
        <h2 id={headingId} className={HEADING_CLS}>
          {t.capture.heading}
        </h2>
        <p className={LEDE_CLS}>{t.capture.lede}</p>
      </div>

      <div className={cn(PANEL_CLS, 'flex flex-col gap-[11px]')}>
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-3">
            <span id={`ev-label-${headingId}`} className={LABEL_CLS}>
              {t.capture.exposureBias}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[0.82rem] leading-none tabular-nums text-amber">
                {formatEv(ev)} EV
              </span>
              {Math.abs(ev) > 0.05 && (
                <button type="button" className={RESET_BTN_CLS} onClick={() => setEv(0)}>
                  0 EV
                </button>
              )}
            </div>
          </div>
          <RangeSlider
            min={-3}
            max={3}
            step={1 / 3}
            value={ev}
            ariaLabel={t.a11y.exposureBiasEv}
            ariaLabelledBy={`ev-label-${headingId}`}
            onValueChange={(v) => setEv(Math.round(v * 3) / 3)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={LABEL_CLS}>{t.capture.dynamicRange}</span>
          <SegmentedControl
            ariaLabel={t.a11y.dynamicRangeModes}
            value={dr}
            options={DR_OPTIONS}
            layoutId="dr-pill"
            onChange={setDr}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={LABEL_CLS}>{t.capture.framingRatio}</span>
          <SegmentedControl
            ariaLabel={t.a11y.aspectRatios}
            value={aspect}
            options={RATIO_OPTIONS}
            layoutId="ratio-pill"
            className="flex-wrap xs:flex-nowrap"
            onChange={setAspect}
          />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-[1.25fr_0.75fr] xs:items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>{t.capture.filmGrain}</span>
            <SegmentedControl
              ariaLabel={t.a11y.filmGrainStrength}
              value={grain}
              options={grainOptions}
              layoutId="grain-pill"
              onChange={setGrain}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className={LABEL_CLS}>{t.capture.analogOptics}</span>
            <Toggle.Root
              pressed={halation}
              onPressedChange={toggleHalation}
              className="w-full min-h-[44px] px-3.5 rounded-[14px] bg-graphite/78 border border-hair flex items-center justify-between gap-2 font-mono font-bold text-[0.78rem] leading-none tracking-[0.08em] text-silver cursor-pointer transition-[border-color,background-color] duration-180 ease-ocular data-[state=on]:border-amber data-[state=on]:bg-amber/16 data-[state=on]:text-amber"
            >
              <span>{t.capture.halation}</span>
              <em className="not-italic text-[0.68rem] text-amber tracking-[0.06em]">PRO</em>
            </Toggle.Root>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className={LABEL_CLS}>{t.capture.primes}</span>
          <SegmentedControl
            ariaLabel={t.a11y.primeFocalLengths}
            value={String(lens)}
            options={LENS_OPTIONS}
            layoutId="lens-pill"
            onChange={(v) => selectLens(Number(v) as LensMm)}
          />
        </div>
      </div>
    </div>
  )
})
