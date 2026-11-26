import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import type { CameraController, HudLayout } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { EASE_OUT } from '../../lib/motion'

interface Props {
  camera: CameraController
  open: boolean
  onClose: () => void
}

/** Compact in-phone Settings popover opened by `slider.horizontal.3` in TopRangefinderHUD. */
export function SettingsQuickSheet({ camera, open, onClose }: Props) {
  const { t } = useI18n()
  const { hudLayout, framingGuide, setHudLayout, cycleFramingGuide } = camera

  const pickLayout = (next: HudLayout) => {
    setHudLayout(next)
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className="absolute inset-0 z-36 flex flex-col justify-start pt-16 px-3 bg-obsidian/65 backdrop-blur-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16, ease: EASE_OUT }}
          onClick={onClose}
        >
          <m.div
            className="p-3 rounded-[18px] bg-obsidian/94 border border-silver/24 shadow-[0_16px_36px_rgba(0,0,0,.64)] flex flex-col gap-2.5 text-silver"
            initial={{ y: -8, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: EASE_OUT }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Camera Settings"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono font-bold text-[8.5px] tracking-[0.1em] uppercase text-silver/68">
                CAMERA SETTINGS
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="w-6 h-6 rounded-full bg-graphite border border-silver/20 text-silver text-[13px] leading-none flex items-center justify-center p-0 cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="font-mono font-bold text-[7.5px] tracking-[0.08em] uppercase text-silver/58">
                HUD LAYOUT
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {(['free', 'pro'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => pickLayout(mode)}
                    className={cn(
                      'h-8 rounded-[10px] border font-mono font-bold text-[9px] uppercase cursor-pointer',
                      hudLayout === mode
                        ? 'bg-amber/20 border-amber text-amber'
                        : 'bg-graphite/80 border-silver/16 text-silver/85',
                    )}
                  >
                    {mode === 'free' ? t.sim.free : t.sim.pro}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-[10px] bg-graphite/75 border border-silver/14">
              <span className="font-body font-semibold text-[10px] text-silver">Framing Guide</span>
              <button
                type="button"
                onClick={cycleFramingGuide}
                className="px-2 py-1 rounded-full bg-obsidian border border-amber/55 font-mono font-bold text-[8px] text-amber uppercase cursor-pointer"
              >
                {framingGuide === 'clean' ? t.phone.clear : framingGuide === 'ruleOfThirds' ? t.phone.grid : t.phone.range}
              </button>
            </div>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
