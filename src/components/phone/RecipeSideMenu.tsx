import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import {
  ALL_STOCK_RECIPES,
  CURATED_PHONE_RECIPES,
  type PhoneRecipe,
  type PhoneRecipeId,
} from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'

interface Props {
  camera: CameraController
  isFree: boolean
  open: boolean
  onClose: () => void
  onSwitchToPro: () => void
}

/** 1:1 port of `RecipeSideMenuView`, `RecipeSideMenuSections`, and `TypographicWheelItem`. */
export function RecipeSideMenu({ camera, isFree, open, onClose, onSwitchToPro }: Props) {
  const { phoneRecipe, pinnedDialIds, dr, wbMode, wbKelvin, selectPhoneRecipe, toggleDialPin } = camera
  const [tab, setTab] = useState<'stocks' | 'customs'>(
    phoneRecipe.kind === 'stock' ? 'stocks' : 'customs',
  )

  const items: readonly PhoneRecipe[] = tab === 'stocks' ? ALL_STOCK_RECIPES : CURATED_PHONE_RECIPES
  const maxCustomSlots = isFree ? 1 : 7

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="absolute inset-0 z-34 flex overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: EASE_OUT }}
          role="dialog"
          aria-label="Typographic Film Recipe Menu"
        >
          {/* Full-screen smooth horizontal gradient scrim melting into recessed right viewfinder */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(11,12,14,.96) 0%, rgba(17,18,21,.88) 62%, rgba(11,12,14,.14) 100%)',
            }}
            aria-hidden="true"
          />

          {/* Left Typographic Wheel Column (~78%) */}
          <m.div
            className="relative z-10 w-[78%] h-full pt-[36px] pb-4 pl-3.5 pr-2 flex flex-col text-silver"
            initial={{ x: -24 }}
            animate={{ x: 0 }}
            exit={{ x: -20 }}
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            {/* Top filter tabs (`Stocks 12` | `Customs 0/1`) + close */}
            <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-silver/14">
              <div className="flex items-end gap-3" role="tablist" aria-label="Recipe categories">
                {(['stocks', 'customs'] as const).map((filterId) => {
                  const selected = tab === filterId
                  const count = filterId === 'stocks' ? `${ALL_STOCK_RECIPES.length}` : `0/${maxCustomSlots}`
                  return (
                    <button
                      key={filterId}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setTab(filterId)}
                      className="relative pb-1 bg-transparent border-0 flex items-baseline gap-1 cursor-pointer"
                    >
                      <span
                        className={cn(
                          'font-display font-semibold text-[11px] leading-none',
                          selected ? 'text-silver' : 'text-silver/60',
                        )}
                      >
                        {filterId === 'stocks' ? 'Stocks' : 'Customs'}
                      </span>
                      <span
                        className={cn(
                          'font-mono font-bold text-[8px] leading-none',
                          selected ? 'text-amber' : 'text-silver/55',
                        )}
                      >
                        {count}
                      </span>
                      {selected && (
                        <span className="absolute inset-x-0 bottom-0 h-[1.5px] bg-amber" aria-hidden="true" />
                      )}
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close Recipe Menu"
                className="w-6 h-6 rounded-full bg-silver/10 border-0 text-silver text-[12px] leading-none flex items-center justify-center p-0 cursor-pointer hover:bg-silver/20"
              >
                ×
              </button>
            </div>

            {/* Scrollable Typographic Wheel */}
            <div className="flex-1 overflow-y-auto py-2.5 flex flex-col gap-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {items.map((item) => {
                const isActive = phoneRecipe.id === item.id
                const isLocked = isFree && item.tier === 'pro'
                const isPinned = pinnedDialIds.includes(item.id)
                const wbText = wbMode === 'auto' ? 'AUTO' : `${wbKelvin}K`
                const tierTag =
                  item.kind === 'curated'
                    ? 'RECIPE • FREE'
                    : item.kind === 'camera'
                      ? 'CAMERA • FREE'
                      : item.tier === 'pro'
                        ? 'PRO'
                        : 'FREE'

                return (
                  <div key={item.id} className="flex items-start gap-2 py-1 px-1">
                    {isActive && (
                      <span
                        className="w-6 h-6 rounded-[7px] shrink-0 border border-silver/35 flex items-center justify-center font-mono font-extrabold text-[7.5px] text-silver shadow"
                        style={{
                          background: `linear-gradient(135deg, ${item.swatchGradient[0]}, ${item.swatchGradient[1]})`,
                        }}
                        aria-hidden="true"
                      >
                        {item.slotCode}
                      </span>
                    )}

                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (isLocked) {
                              onSwitchToPro()
                            }
                            selectPhoneRecipe(item.id as PhoneRecipeId)
                          }}
                          className="min-w-0 flex items-center gap-1 bg-transparent border-0 p-0 text-left cursor-pointer"
                        >
                          <span
                            className={cn(
                              'font-display leading-[1.1] truncate',
                              isActive ? 'font-bold text-[14px] text-silver' : 'font-semibold text-[12px]',
                              isLocked ? 'text-silver/50' : !isActive && 'text-silver/58 hover:text-silver/85',
                            )}
                          >
                            {item.name}
                          </span>
                          {isLocked && (
                            <svg width="8" height="8" viewBox="0 0 16 16" fill="#e8832a" className="shrink-0" aria-hidden="true">
                              <path d="M5 7V5a3 3 0 0 1 6 0v2h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h1zm2 0h2V5a1 1 0 0 0-2 0v2z" />
                            </svg>
                          )}
                        </button>

                        {isActive && !isLocked && (
                          <button
                            type="button"
                            onClick={() => toggleDialPin(item.id)}
                            className={cn(
                              'px-1.5 py-0.5 rounded-[5px] border font-mono font-extrabold text-[7px] leading-none uppercase shrink-0 cursor-pointer',
                              isPinned
                                ? 'bg-emerald/15 border-emerald/45 text-emerald'
                                : 'bg-graphite/65 border-silver/18 text-silver/75',
                            )}
                          >
                            {isPinned ? '✓ DIAL' : 'PIN'}
                          </button>
                        )}
                      </div>

                      {isActive && (
                        <div className="flex flex-col gap-0.5 pt-0.5">
                          <span className="font-mono font-extrabold text-[7.5px] leading-none tracking-[0.04em] text-amber uppercase">
                            {wbText} • {dr} • {tierTag}
                          </span>
                          <p className="m-0 font-body text-[8.5px] leading-[1.25] text-silver/76 line-clamp-2">
                            {item.subtitle}
                          </p>
                          {isLocked && (
                            <button
                              type="button"
                              onClick={onSwitchToPro}
                              className="self-start mt-1 px-2 py-1 rounded-[6px] bg-amber/14 border border-amber/45 font-mono font-extrabold text-[7.5px] text-amber uppercase cursor-pointer"
                            >
                              UNLOCK PRO
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer bar (`DIAL 6/10` | `RAW DNG`) */}
            <div className="pt-2 border-t border-silver/12 flex items-center justify-between font-mono font-bold text-[7.5px] leading-none uppercase">
              <span className={pinnedDialIds.length >= 10 ? 'text-amber' : 'text-silver/75'}>
                DIAL {pinnedDialIds.length}/10
              </span>
              <span className="text-emerald">RAW DNG</span>
            </div>
          </m.div>

          {/* Right tap-to-dismiss zone over recessed viewfinder */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Return to Viewfinder"
            className="relative z-10 flex-1 h-full bg-transparent border-0 p-0 cursor-pointer"
          />
        </m.div>
      )}
    </AnimatePresence>
  )
}
