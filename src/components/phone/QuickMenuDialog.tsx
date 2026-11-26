import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Dialog, Toggle, ToggleGroup } from 'radix-ui'
import { RECIPES, type FilmId } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'

interface Props {
  camera: CameraController
  isFree: boolean
  open: boolean
  onClose: () => void
}

const OPTIC_BTN_CLS =
  'inphone-q__opt group h-9 rounded-[10px] bg-graphite/78 border border-silver/16 flex flex-col items-center justify-center gap-0.5 cursor-pointer'

/** Frosted in-phone Q-Menu overlay backed by a non-modal Radix Dialog. */
export function QuickMenuDialog({ camera, isFree, open, onClose }: Props) {
  const { t } = useI18n()
  const { recipe, dr, grain, halation, selectFilm, cycleDr, cycleGrain, toggleHalation, setHudLayout } =
    camera
  const grainLabel = t.capture.grainLevels[grain]

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
            className="inphone-q absolute inset-x-2.5 bottom-4 z-35 p-3 rounded-[20px] bg-obsidian/94 border border-silver/26 shadow-[0_16px_36px_rgba(0,0,0,.64)] flex flex-col gap-2.5"
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            aria-label={t.a11y.qMenuLabel}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="inphone-q__kicker block font-mono font-bold text-[8px] leading-[1.2] tracking-[0.08em] text-silver/64">
                  {isFree ? t.phone.qKickerFree : t.phone.qKickerPro}
                </span>
                <Dialog.Title className="block font-display font-bold text-[14px] leading-[1.2] text-silver mt-0.5">
                  {recipe.name}
                </Dialog.Title>
                <Dialog.Description className="sr-only">
                  {t.a11y.qMenuDescription}
                </Dialog.Description>
              </div>
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="w-7 h-7 rounded-full bg-graphite border border-silver/20 text-silver font-body font-bold text-[16px] leading-none flex items-center justify-center p-0 cursor-pointer"
                  aria-label={t.a11y.closeQMenu}
                >
                  ×
                </button>
              </Dialog.Close>
            </div>

            <ToggleGroup.Root
              type="single"
              value={recipe.id}
              onValueChange={(v) => {
                if (v) selectFilm(v as FilmId)
              }}
              aria-label={t.a11y.filmStocks}
              className="grid grid-cols-4 gap-[5px]"
            >
              {RECIPES.map((r) => (
                <ToggleGroup.Item
                  key={r.id}
                  value={r.id}
                  className="group min-h-10 px-0.5 py-1 rounded-[10px] bg-graphite border border-silver/16 flex flex-col items-center justify-center gap-0.5 cursor-pointer data-[state=on]:bg-amber/24 data-[state=on]:border-amber"
                >
                  <span className="font-mono font-extrabold text-[10.5px] leading-none text-silver group-data-[state=on]:text-amber">
                    {r.code}
                  </span>
                  {r.tier === 'pro' && (
                    <span className="font-mono font-extrabold text-[7px] leading-none text-silver bg-burgundy px-1 py-[1.5px] rounded-full">
                      PRO
                    </span>
                  )}
                </ToggleGroup.Item>
              ))}
            </ToggleGroup.Root>

            <div className={cn('grid gap-[5px]', isFree ? 'grid-cols-2' : 'grid-cols-3')}>
              <button type="button" className={OPTIC_BTN_CLS} onClick={cycleDr}>
                <span className="font-mono font-bold text-[7.5px] leading-none text-silver/68">DR</span>
                <b className="font-mono font-extrabold text-[9.5px] leading-none text-silver">{dr}</b>
              </button>
              <button type="button" className={OPTIC_BTN_CLS} onClick={cycleGrain}>
                <span className="font-mono font-bold text-[7.5px] leading-none text-silver/68">{t.phone.grain}</span>
                <b className="font-mono font-extrabold text-[9.5px] leading-none text-silver">{grainLabel}</b>
              </button>
              {!isFree && (
                <Toggle.Root
                  pressed={halation}
                  onPressedChange={toggleHalation}
                  className={cn(OPTIC_BTN_CLS, 'data-[state=on]:border-amber data-[state=on]:bg-amber/18')}
                >
                  <span className="font-mono font-bold text-[7.5px] leading-none text-silver/68">HAL</span>
                  <b className="font-mono font-extrabold text-[9.5px] leading-none text-silver group-data-[state=on]:text-amber">
                    {halation ? t.phone.on : t.phone.off}
                  </b>
                </Toggle.Root>
              )}
            </div>

            {isFree && (
              <div className="flex items-center gap-1.5 pt-2 border-t border-silver/12">
                <span className="px-1.5 py-0.5 rounded-full bg-burgundy text-silver font-mono font-extrabold text-[7.5px] leading-none tracking-[0.06em] shrink-0">
                  PRO
                </span>
                <span className="inphone-q__upsell-text flex-1 font-body font-medium text-[9.5px] leading-[1.2] text-silver/78 min-w-0">
                  {t.phone.upsellText}
                </span>
                <button
                  type="button"
                  className="inphone-q__upsell-btn h-[26px] px-[9px] rounded-full bg-graphite border border-amber/55 text-amber font-mono font-extrabold text-[8px] leading-none tracking-[0.05em] whitespace-nowrap shrink-0 cursor-pointer"
                  onClick={() => {
                    setHudLayout('pro')
                    onClose()
                  }}
                >
                  {t.phone.upsellBtn}
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
