import { memo } from 'react'
import { Toggle, ToggleGroup } from 'radix-ui'
import { RECIPES, type FilmId } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { HEADING_CLS, LABEL_CLS, LEDE_CLS, PANEL_CLS, RangeSlider, RESET_BTN_CLS } from './controls'

const SPEC_CHIP_BASE =
  'inline-flex items-center min-h-[34px] px-3 rounded-full bg-obsidian/90 border font-mono font-bold text-[0.75rem] leading-none tracking-[0.06em] whitespace-nowrap reduced-transparency:bg-graphite'

interface Props {
  headingId: string
  camera: CameraController
}

export const RawPanel = memo(function RawPanel({ headingId, camera }: Props) {
  const { filmId, recipe, rawCompare, rawSplit, toggleRawCompare, setRawSplit, selectFilmForRaw } =
    camera

  return (
    <div className="flex flex-col gap-3.5">
      <div className="pool-scrim">
        <h2 id={headingId} className={HEADING_CLS}>
          Re-develop any RAW.
        </h2>
        <p className={LEDE_CLS}>14-bit Bayer RAW and Apple ProRAW. Recipe saved in EXIF.</p>
      </div>

      <div className={cn(PANEL_CLS, 'flex flex-col gap-[13px]')}>
        <div className="flex items-center justify-between gap-3">
          <span id={`raw-wipe-label-${headingId}`} className={LABEL_CLS}>
            RAW ←→ {recipe.code} Darkroom Wipe
          </span>
          <Toggle.Root pressed={rawCompare} onPressedChange={toggleRawCompare} className={RESET_BTN_CLS}>
            {rawCompare ? 'SPLIT ON' : 'SPLIT OFF'}
          </Toggle.Root>
        </div>

        <RangeSlider
          min={8}
          max={92}
          step={1}
          value={rawSplit}
          ariaLabel="Darkroom comparison position between flat RAW and film stock"
          ariaLabelledBy={`raw-wipe-label-${headingId}`}
          onValueChange={setRawSplit}
        />

        <ToggleGroup.Root
          type="single"
          value={filmId}
          onValueChange={(v) => {
            if (v) selectFilmForRaw(v as FilmId)
          }}
          aria-label="Re-develop RAW with stock"
          className="flex flex-wrap gap-2 mt-1 mb-0.5"
        >
          {RECIPES.map((r) => (
            <ToggleGroup.Item
              key={r.id}
              value={r.id}
              className="relative inline-flex items-center gap-[5px] min-h-[42px] px-[13px] rounded-full bg-obsidian/84 border border-hair font-mono font-bold text-[0.78rem] leading-none tracking-[0.06em] text-silver cursor-pointer z-1 transition-colors duration-180 ease-ocular hover:border-hair-strong data-[state=on]:border-amber data-[state=on]:bg-amber/18 data-[state=on]:text-amber"
            >
              <span>{r.code}</span>
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>

        <ul className="flex flex-wrap gap-2 list-none m-0 p-0" aria-label="RAW specifications">
          <li className={cn(SPEC_CHIP_BASE, 'text-amber border-amber/60')}>14-BIT BAYER</li>
          <li className={cn(SPEC_CHIP_BASE, 'text-ink border-hair')}>PRORAW</li>
          <li className={cn(SPEC_CHIP_BASE, 'text-ink border-hair')}>EXIF RECIPE</li>
          <li className={cn(SPEC_CHIP_BASE, 'text-ink border-hair')}>NON-DESTRUCTIVE</li>
        </ul>
      </div>
    </div>
  )
})
