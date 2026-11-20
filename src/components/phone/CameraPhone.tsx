import { memo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as m from 'motion/react-m'
import { Dialog, Toggle } from 'radix-ui'
import { buildOpticalFilter } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { EASE_BUTTER, EASE_OUT } from '../../lib/motion'
import { MeniscusMark } from '../MeniscusMark'
import { PortraitDeck } from './PortraitDeck'
import { QuickMenuDialog } from './QuickMenuDialog'
import { ViewfinderCanvas } from './ViewfinderCanvas'

interface Props {
  camera: CameraController
  isGiantMode?: boolean
}

function HardwareButtons() {
  const base = 'absolute w-[3px] rounded-[2px] bg-[linear-gradient(180deg,#484c58,#262930)] pointer-events-none'
  return (
    <>
      <span className={cn(base, '-left-[3px] top-[92px] h-5')} aria-hidden="true" />
      <span className={cn(base, '-left-[3px] top-[126px] h-9')} aria-hidden="true" />
      <span className={cn(base, '-left-[3px] top-[172px] h-9')} aria-hidden="true" />
      <span className={cn(base, '-right-[3px] top-[138px] h-14')} aria-hidden="true" />
      <span
        className="absolute -right-[2.5px] bottom-[172px] w-[3px] h-11 rounded-[2px] bg-[linear-gradient(180deg,#2e323c,#1a1c22)] pointer-events-none"
        aria-hidden="true"
      />
    </>
  )
}

export const CameraPhone = memo(function CameraPhone({ camera, isGiantMode }: Props) {
  const [guidesOn, setGuidesOn] = useState(true)
  const [qOpen, setQOpen] = useState(false)

  const { photo, recipe, ev, dr, rawCompare, exifToast, hudLayout, toggleRawCompare } = camera
  const isFree = hudLayout === 'free'
  const showTopRawBadge = !isFree || rawCompare
  const opticalFilter = buildOpticalFilter(recipe, ev, dr)

  const giantAware = isGiantMode !== undefined
  const chromeAnimate = giantAware ? { opacity: isGiantMode ? 0 : 1 } : undefined
  const chromeTransition = giantAware
    ? { duration: 0.5, ease: EASE_BUTTER }
    : undefined

  return (
    <div
      className="phone-shell relative w-[min(100%,308px)] aspect-[78/163.4] mx-auto rounded-[46px] p-[7px] bg-[linear-gradient(155deg,#353842_0%,#1d1f25_36%,#111215_72%,#262930_100%)] border border-silver/20 shadow-[0_34px_90px_rgba(0,0,0,.66),0_8px_24px_rgba(0,0,0,.46),inset_0_1px_0_rgba(243,241,236,.18)]"
      role="region"
      aria-label="Interactive Ocular camera on iPhone 18 Pro Max"
    >
      <HardwareButtons />

      <Dialog.Root open={qOpen} onOpenChange={setQOpen} modal={false}>
        <div className="phone-screen relative w-full h-full rounded-[39px] overflow-hidden bg-[#050608] text-silver font-body border border-black/70 select-none">
          {/* Status Bar & Dead-Centered Dynamic Island */}
          <div className="relative z-30 h-[34px] pt-2 px-[18px] flex items-center justify-between pointer-events-none" aria-hidden="true">
            <m.span
              className="font-ios font-semibold text-[10.5px] leading-none text-silver tracking-[-0.01em]"
              initial={false}
              animate={chromeAnimate}
              transition={chromeTransition}
            >
              9:41
            </m.span>
            <div className="phone-island absolute left-1/2 top-[13.5px] -translate-x-1/2 w-[24%] h-[15px] rounded-full bg-[#050507] border border-silver/9 flex items-center justify-end pr-[5px]">
              <span className="w-[5px] h-[5px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3c5678,#0c1018_72%)]" />
            </div>
            <m.svg
              className="w-[52px] h-2.5 text-silver"
              viewBox="0 0 76 14"
              initial={false}
              animate={chromeAnimate}
              transition={chromeTransition}
            >
              <rect x="2" y="9" width="3" height="4" rx="1" fill="currentColor" />
              <rect x="6.5" y="7" width="3" height="6" rx="1" fill="currentColor" />
              <rect x="11" y="4.5" width="3" height="8.5" rx="1" fill="currentColor" />
              <rect x="15.5" y="2" width="3" height="11" rx="1" fill="currentColor" />
              <path
                d="M25 5.2a8 8 0 0 1 11 0M27.2 7.8a5 5 0 0 1 6.6 0M29.6 10.4a1.8 1.8 0 0 1 1.8 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <rect x="43" y="2.5" width="24" height="10.5" rx="3" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.2" />
              <rect x="45" y="4.5" width="18" height="6.5" rx="1.6" fill="currentColor" />
              <path d="M68.5 5.6v4.2" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.8" strokeLinecap="round" />
            </m.svg>
          </div>

          {/* Full-bleed edge-to-edge selected photograph during the giant window-border step */}
          {giantAware && (
            <m.div
              className="absolute inset-0 z-24 pointer-events-none bg-[#050608] overflow-hidden"
              initial={false}
              animate={{ opacity: isGiantMode ? 1 : 0 }}
              transition={{ duration: 0.44, ease: EASE_BUTTER }}
              aria-hidden="true"
            >
              <div className="relative w-full h-[188px]">
                <img
                  src={photo.src}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover block transition-[filter] duration-240 ease-ocular"
                  style={{ filter: opticalFilter, objectPosition: photo.objectPosition }}
                  decoding="async"
                  draggable={false}
                />
                {recipe.shadowTint && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: recipe.shadowTint.background,
                      mixBlendMode: recipe.shadowTint.blendMode,
                      opacity: recipe.shadowTint.opacity,
                    }}
                  />
                )}
                {recipe.highlightTint && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: recipe.highlightTint.background,
                      mixBlendMode: recipe.highlightTint.blendMode,
                      opacity: recipe.highlightTint.opacity,
                    }}
                  />
                )}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(11,12,14,.46)_0%,rgba(11,12,14,0)_24%,rgba(11,12,14,0)_64%,rgba(5,6,8,.84)_94%,#050608_100%)]" />
                <div className="absolute inset-x-3 top-8 bottom-[26px] pointer-events-none">
                  <span className="absolute top-0 left-0 w-[5px] h-[5px] border-t-[0.45px] border-l-[0.45px] border-silver/52" />
                  <span className="absolute top-0 right-0 w-[5px] h-[5px] border-t-[0.45px] border-r-[0.45px] border-silver/52" />
                </div>
                <div className="absolute left-1/2 top-[144px] -translate-x-1/2 inline-flex items-center gap-[3px] px-1.5 py-[2.5px] rounded-full bg-deep/84 border-[0.5px] border-amber/68 text-silver font-mono font-bold text-[4.2px] leading-none tracking-[0.08em] uppercase whitespace-nowrap">
                  <span className="w-[2.2px] h-[2.2px] rounded-full bg-amber" />
                  <span>{photo.name} · {recipe.code}</span>
                </div>
              </div>
            </m.div>
          )}

          {/* Persistent Top Rangefinder HUD */}
          <m.div
            className="relative z-25 h-8 px-2.5 flex items-center justify-between"
            initial={false}
            animate={chromeAnimate}
            transition={chromeTransition}
            style={isGiantMode ? { pointerEvents: 'none' } : undefined}
          >
            <div className="inline-flex items-center gap-1.5" aria-hidden="true">
              <MeniscusMark className="w-[17px] h-[17px]" />
              <span className="font-wordmark font-bold text-[13px] leading-none tracking-[0.1em] text-silver/95">
                OCULAR
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {showTopRawBadge && (
                <Toggle.Root
                  pressed={rawCompare}
                  onPressedChange={toggleRawCompare}
                  title="Toggle 14-bit RAW darkroom comparison"
                  className="sensor-badge inline-flex items-center gap-1 h-6 px-2 rounded-full bg-obsidian/68 border border-silver/20 font-mono font-extrabold text-[9px] leading-none tracking-[0.06em] text-silver/92 cursor-pointer transition-[border-color,background-color] duration-180 ease-ocular motion-reduce:transition-none data-[state=on]:border-amber/72 data-[state=on]:bg-amber/20 data-[state=on]:text-amber"
                >
                  <span className="w-[4.5px] h-[4.5px] rounded-full bg-amber" />
                  <span>{rawCompare ? 'SPLIT' : 'RAW'}</span>
                </Toggle.Root>
              )}
              <button
                type="button"
                onClick={() => setQOpen((v) => !v)}
                aria-label="Toggle Ocular Q-Menu"
                aria-pressed={qOpen}
                className={cn(
                  'w-7 h-7 rounded-full bg-obsidian/66 border border-silver/20 flex items-center justify-center p-0 cursor-pointer transition-[border-color,color] duration-180 ease-ocular motion-reduce:transition-none',
                  qOpen ? 'border-amber text-amber' : 'text-silver/90',
                )}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54a.48.48 0 0 0-.48-.41h-3.84a.48.48 0 0 0-.48.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.49.49 0 0 0-.59.22L2.74 8.87a.48.48 0 0 0 .12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.26.41.48.41h3.84c.24 0 .44-.17.48-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
                </svg>
              </button>
            </div>
          </m.div>

          {/* Live 3:4 Portrait Sensor Aperture + EXIF toast */}
          <div className="relative mt-0.5 w-full">
            <ViewfinderCanvas camera={camera} showGuides={isFree ? guidesOn : true} />

            <AnimatePresence>
              {exifToast && (
                <m.div
                  key={exifToast}
                  className="absolute inset-x-2.5 top-2.5 w-fit max-w-[calc(100%-20px)] mx-auto px-2.5 py-1 rounded-full bg-deep/90 border border-amber/68 text-amber font-mono font-bold text-[9px] leading-none tracking-[0.08em] whitespace-nowrap pointer-events-none z-22"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.2, ease: EASE_OUT }}
                  role="status"
                >
                  {exifToast}
                </m.div>
              )}
            </AnimatePresence>
          </div>

          <PortraitDeck
            camera={camera}
            isFree={isFree}
            qOpen={qOpen}
            onToggleQ={() => setQOpen((v) => !v)}
            guidesOn={guidesOn}
            onToggleGuides={setGuidesOn}
            chromeAnimate={chromeAnimate}
            chromeTransition={chromeTransition}
            disablePointer={Boolean(isGiantMode)}
          />

          <QuickMenuDialog
            camera={camera}
            isFree={isFree}
            open={qOpen}
            onClose={() => setQOpen(false)}
          />

          <div
            className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[34%] h-1 rounded-full bg-silver/78 z-40 pointer-events-none"
            aria-hidden="true"
          />
        </div>
      </Dialog.Root>
    </div>
  )
})
