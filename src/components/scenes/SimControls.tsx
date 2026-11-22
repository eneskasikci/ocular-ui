import * as m from 'motion/react-m'
import { ToggleGroup } from 'radix-ui'
import { PHOTOS } from '../../data/photos'
import type { HudLayout } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { SPRING_DETENT } from '../../lib/motion'

export function HudLayoutSwitch({
  layout,
  wide = false,
  onChange,
}: {
  layout: HudLayout
  wide?: boolean
  onChange: (next: HudLayout) => void
}) {
  const { t } = useI18n()
  const hudLayouts: readonly { id: HudLayout; label: string }[] = [
    { id: 'free', label: t.sim.free },
    { id: 'pro', label: t.sim.pro },
  ]

  return (
    <div
      className={cn(
        'hud-switch inline-flex items-center gap-2 rounded-full bg-[#0f1014]/94 border border-hair shadow-[0_10px_28px_rgba(0,0,0,.32)] reduced-transparency:bg-graphite',
        wide ? 'hud-switch--wide w-[min(100%,308px)] justify-between p-1 pl-3.5' : 'p-[3px] pl-3',
      )}
    >
      <span className="font-mono font-bold text-[0.7rem] leading-none tracking-[0.1em] text-ink-subtle uppercase whitespace-nowrap">
        {t.sim.hud}
      </span>
      <ToggleGroup.Root
        type="single"
        value={layout}
        onValueChange={(v) => {
          if (v) onChange(v as HudLayout)
        }}
        aria-label={t.a11y.phoneHudLayout}
        className="inline-flex items-center gap-0.5"
      >
        {hudLayouts.map((opt) => {
          const selected = layout === opt.id
          return (
            <ToggleGroup.Item
              key={opt.id}
              value={opt.id}
              className={cn(
                'hud-switch__btn relative px-3 border-0 rounded-full bg-transparent font-mono font-bold text-[0.74rem] leading-none tracking-[0.06em] text-ink-muted cursor-pointer z-1 whitespace-nowrap transition-colors duration-180 ease-ocular hover:text-silver data-[state=on]:text-amber',
                wide ? 'h-[38px] min-w-[68px]' : 'h-[34px] min-w-[52px]',
              )}
            >
              {selected && (
                <m.span
                  layoutId="hud-layout-pill"
                  layoutDependency={opt.id}
                  className="absolute inset-0 rounded-full bg-amber/18 border border-amber/62 -z-1"
                  transition={SPRING_DETENT}
                  aria-hidden="true"
                />
              )}
              <span>{opt.label}</span>
            </ToggleGroup.Item>
          )
        })}
      </ToggleGroup.Root>
    </div>
  )
}

export function PhotoStepper({
  photoIndex,
  photoName,
  wide = false,
  onStep,
}: {
  photoIndex: number
  photoName: string
  wide?: boolean
  onStep: (dir: -1 | 1) => void
}) {
  const { t } = useI18n()
  const btnCls =
    'w-[34px] h-[34px] rounded-full border border-hair bg-graphite/78 text-silver font-body font-semibold text-base leading-none inline-flex items-center justify-center cursor-pointer shrink-0 hover:border-amber hover:text-amber'
  return (
    <div
      className={cn(
        'photo-stepper inline-flex items-center gap-1.5 p-[3px] rounded-full bg-[#0f1014]/94 border border-hair shadow-[0_10px_28px_rgba(0,0,0,.32)] reduced-transparency:bg-graphite',
        wide && 'photo-stepper--wide w-[min(100%,308px)] justify-between',
      )}
      role="group"
      aria-label={wide ? t.a11y.switchSamplePhoto : t.a11y.switchActivePhoto}
    >
      <button type="button" className={btnCls} onClick={() => onStep(-1)} aria-label={t.a11y.prevPhoto}>
        ‹
      </button>
      <span
        className={cn(
          'px-1.5 font-mono font-bold text-[0.72rem] leading-[1.1] tracking-[0.04em] text-ink-muted whitespace-nowrap overflow-hidden text-ellipsis',
          !wide && 'max-w-[170px]',
        )}
      >
        <b className="text-amber">
          {String(photoIndex + 1).padStart(2, '0')}/{String(PHOTOS.length).padStart(2, '0')}
        </b>
        <span> {photoName}</span>
      </span>
      <button type="button" className={btnCls} onClick={() => onStep(1)} aria-label={t.a11y.nextPhoto}>
        ›
      </button>
    </div>
  )
}
