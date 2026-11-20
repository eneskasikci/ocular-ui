import * as m from 'motion/react-m'
import { Slider, ToggleGroup } from 'radix-ui'
import { cn } from '../../lib/cn'
import { SPRING_DETENT } from '../../lib/motion'

export const HEADING_CLS =
  'font-display font-bold text-[clamp(1.65rem,3.4vw,2.65rem)] leading-[1.03] tracking-[-0.025em] max-w-[18ch] [overflow-wrap:break-word]'
export const LEDE_CLS =
  'text-[clamp(.96rem,1.4vw,1.06rem)] leading-[1.5] text-ink-muted max-w-[40ch] mt-1.5 mb-0 tracking-[-0.01em]'
export const PANEL_CLS =
  'p-[18px] xs:px-[22px] xs:py-5 rounded-[24px] bg-[linear-gradient(180deg,rgba(22,24,30,.94),rgba(11,12,14,.97))] border border-hair shadow-[0_24px_60px_rgba(0,0,0,.48),inset_0_1px_0_rgba(243,241,236,.08)] max-w-[560px] reduced-transparency:bg-graphite reduced-transparency:bg-none'
export const LABEL_CLS = 'font-mono font-bold text-[0.75rem] leading-[1.2] tracking-[0.1em] uppercase text-ink-subtle'
export const RESET_BTN_CLS =
  'min-h-8 px-2.5 rounded-full bg-graphite/90 border border-hair-strong font-mono font-bold text-[0.72rem] leading-none tracking-[0.08em] text-silver cursor-pointer data-[state=on]:border-amber data-[state=on]:text-amber'

interface RangeSliderProps {
  min: number
  max: number
  step: number
  value: number
  ariaLabel: string
  ariaLabelledBy?: string
  onValueChange: (val: number) => void
}

/** Accessible amber slider backed by Radix UI Slider. */
export function RangeSlider({
  min,
  max,
  step,
  value,
  ariaLabel,
  ariaLabelledBy,
  onValueChange,
}: RangeSliderProps) {
  return (
    <Slider.Root
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([v]) => onValueChange(v)}
      aria-labelledby={ariaLabelledBy}
      className="relative flex w-full touch-none select-none items-center h-8 cursor-pointer"
    >
      <Slider.Track className="relative h-1.5 w-full grow rounded-full bg-silver/18 border border-silver/12">
        <Slider.Range className="absolute h-full rounded-full bg-amber/35" />
      </Slider.Track>
      <Slider.Thumb
        aria-label={ariaLabel}
        className="block w-[22px] h-[22px] rounded-full bg-amber border-2 border-obsidian shadow-[0_2px_8px_rgba(0,0,0,.5)] cursor-grab active:cursor-grabbing"
      />
    </Slider.Root>
  )
}

export interface SegOption<T extends string> {
  value: T
  label: string
  pro?: boolean
}

interface SegmentedControlProps<T extends string> {
  ariaLabel: string
  value: T
  options: readonly SegOption<T>[]
  layoutId: string
  className?: string
  onChange: (value: T) => void
}

/** Single-select segmented pill group backed by Radix ToggleGroup + Motion shared pill. */
export function SegmentedControl<T extends string>({
  ariaLabel,
  value,
  options,
  layoutId,
  className,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as T)
      }}
      aria-label={ariaLabel}
      className={cn('flex gap-1 p-1 rounded-[14px] bg-graphite/68 border border-hair', className)}
    >
      {options.map((opt) => {
        const selected = value === opt.value
        return (
          <ToggleGroup.Item
            key={opt.value}
            value={opt.value}
            className="relative flex-1 min-h-[42px] px-2 border-0 rounded-[10px] bg-transparent inline-flex items-center justify-center gap-1 font-mono font-bold text-[0.75rem] leading-none tabular-nums tracking-[0.04em] text-ink-muted whitespace-nowrap cursor-pointer z-1 hover:text-silver data-[state=on]:text-amber"
          >
            {selected && (
              <m.span
                layoutId={layoutId}
                layoutDependency={opt.value}
                className="absolute inset-0 rounded-[10px] bg-amber/16 border border-amber/58 -z-1"
                transition={SPRING_DETENT}
              />
            )}
            <span>{opt.label}</span>
            {opt.pro && <em className="not-italic text-[0.68rem] text-amber tracking-[0.06em]">PRO</em>}
          </ToggleGroup.Item>
        )
      })}
    </ToggleGroup.Root>
  )
}
