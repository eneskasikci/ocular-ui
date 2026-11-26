import { lazy, memo, Suspense, useState } from 'react'
import * as m from 'motion/react-m'
import { Toggle } from 'radix-ui'
import { buildOpticalFilter } from '../../data/recipes'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { cn } from '../../lib/cn'
import { EASE_BUTTER, EASE_OUT } from '../../lib/motion'
import { MeniscusMark } from '../MeniscusMark'
import { PortraitDeck } from './PortraitDeck'
import { ViewfinderCanvas } from './ViewfinderCanvas'

const QuickMenuDialog = lazy(() =>
  import('./QuickMenuDialog').then((mod) => ({ default: mod.QuickMenuDialog })),
)
const RecipeSideMenu = lazy(() =>
  import('./RecipeSideMenu').then((mod) => ({ default: mod.RecipeSideMenu })),
)
const SettingsQuickSheet = lazy(() =>
  import('./SettingsQuickSheet').then((mod) => ({ default: mod.SettingsQuickSheet })),
)

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
  const { t } = useI18n()
  const [qOpen, setQOpen] = useState(false)
  const [qMounted, setQMounted] = useState(false)
  const [recipeMenuOpen, setRecipeMenuOpen] = useState(false)
  const [recipeMenuMounted, setRecipeMenuMounted] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settingsMounted, setSettingsMounted] = useState(false)

  const toggleQ = () => {
    setQMounted(true)
    setQOpen((v) => !v)
  }

  const openRecipeMenu = () => {
    setRecipeMenuMounted(true)
    setQOpen(false)
    setRecipeMenuOpen(true)
  }

  const openSettings = () => {
    setSettingsMounted(true)
    setQOpen(false)
    setSettingsOpen(true)
  }

  const {
    photo,
    phoneRecipe,
    ev,
    dr,
    rawCompare,
    dynamicIslandStatus,
    hudLayout,
    toggleRawCompare,
    setHudLayout,
  } = camera
  const isFree = hudLayout === 'free'
  const showTopRawBadge = !isFree || rawCompare
  const opticalFilter = buildOpticalFilter(phoneRecipe, ev, dr)

  const giantAware = isGiantMode !== undefined
  const chromeAnimate = giantAware ? { opacity: isGiantMode ? 0 : 1 } : undefined
  const chromeTransition = giantAware
    ? { duration: 0.5, ease: EASE_BUTTER }
    : undefined

  return (
    <div
      className="phone-shell relative w-[min(100%,308px)] aspect-[78/163.4] mx-auto rounded-[46px] p-[7px] bg-[linear-gradient(155deg,#353842_0%,#1d1f25_36%,#111215_72%,#262930_100%)] border border-silver/20 shadow-[0_24px_56px_rgba(0,0,0,.62),0_6px_18px_rgba(0,0,0,.42),inset_0_1px_0_rgba(243,241,236,.18)]"
      role="region"
      aria-label={t.a11y.phoneSimulator}
    >
      <HardwareButtons />

      <div className="phone-screen relative w-full h-full rounded-[39px] overflow-hidden [contain:layout_paint] bg-[#050608] text-silver font-body border border-black/70 select-none">
        {/* Status Bar & Morphing Dynamic Island (`DynamicIslandStatusPillView`) */}
        <div className="relative z-32 h-[34px] pt-2 px-[18px] flex items-center justify-between pointer-events-none" aria-hidden="true">
          <m.span
            className="font-ios font-semibold text-[10.5px] leading-none text-silver tracking-[-0.01em]"
            initial={false}
            animate={chromeAnimate}
            transition={chromeTransition}
          >
            9:41
          </m.span>

          <m.div
            layout
            className={cn(
              'phone-island absolute left-1/2 -translate-x-1/2 bg-[#050507] border flex items-center overflow-hidden',
              dynamicIslandStatus
                ? 'top-[9px] min-w-[164px] max-w-[218px] h-auto px-2.5 pt-[15px] pb-1.5 rounded-[16px] border-white/14 shadow-[0_6px_18px_rgba(0,0,0,.65)] justify-center gap-1.5'
                : 'top-[13.5px] w-[24%] h-[15px] rounded-full border-silver/9 justify-end pr-[5px]',
            )}
            transition={{ duration: 0.24, ease: EASE_OUT }}
          >
            {dynamicIslandStatus ? (
              <div className="flex items-center gap-1 font-mono leading-none">
                <svg width="8.5" height="8.5" viewBox="0 0 16 16" fill="#e8832a" className="shrink-0">
                  <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm3.3 5.4l-3.9 4.1a.6.6 0 0 1-.86.02L4.7 8.7a.6.6 0 1 1 .84-.86l1.4 1.38 3.48-3.66a.6.6 0 1 1 .88.84z" />
                </svg>
                <span className="px-1 py-[1.5px] rounded-full bg-amber text-obsidian font-black text-[6.8px]">
                  {dynamicIslandStatus.badge}
                </span>
                <span className="font-bold text-[7px] text-white whitespace-nowrap truncate">
                  {dynamicIslandStatus.title}
                </span>
              </div>
            ) : (
              <span className="w-[5px] h-[5px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#3c5678,#0c1018_72%)]" />
            )}
          </m.div>

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
            animate={
              isGiantMode
                ? { opacity: 1, visibility: 'visible' }
                : { opacity: 0, transitionEnd: { visibility: 'hidden' } }
            }
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
              {phoneRecipe.shadowTint && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: phoneRecipe.shadowTint.background,
                    mixBlendMode: phoneRecipe.shadowTint.blendMode,
                    opacity: phoneRecipe.shadowTint.opacity,
                  }}
                />
              )}
              {phoneRecipe.highlightTint && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: phoneRecipe.highlightTint.background,
                    mixBlendMode: phoneRecipe.highlightTint.blendMode,
                    opacity: phoneRecipe.highlightTint.opacity,
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
                <span>{photo.name} · {phoneRecipe.slotCode}</span>
              </div>
            </div>
          </m.div>
        )}

        {/* Camera HUD Content (shifts & scales right when RecipeSideMenu is open, matching `ContentView.swift`) */}
        <div className="relative w-full h-[calc(100%-34px)] overflow-hidden">
        <m.div
          className="relative w-full h-full"
          animate={recipeMenuOpen ? { x: 24, scale: 0.94 } : { x: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: EASE_OUT }}
        >
          {/* Persistent Top Rangefinder HUD */}
          <m.div
            className="relative z-25 h-8 px-2.5 flex items-center justify-between"
            initial={false}
            animate={chromeAnimate}
            transition={chromeTransition}
            style={isGiantMode ? { pointerEvents: 'none' } : undefined}
          >
            <div className="inline-flex items-center gap-1.5 [filter:drop-shadow(0_0_8px_rgba(243,241,236,.22))]" aria-hidden="true">
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
                  title={t.a11y.toggleRawCompare}
                  className="sensor-badge inline-flex items-center gap-1 h-6 px-2 rounded-full bg-obsidian/68 border border-silver/20 font-mono font-extrabold text-[8.5px] leading-none tracking-[0.05em] text-silver/92 cursor-pointer transition-[border-color,background-color] duration-180 ease-ocular motion-reduce:transition-none data-[state=on]:border-amber/72 data-[state=on]:bg-amber/20 data-[state=on]:text-amber"
                >
                  <span className={cn('w-[4.5px] h-[4.5px] rounded-full', rawCompare ? 'bg-amber' : 'bg-emerald')} />
                  <span>{rawCompare ? t.phone.split : t.phone.heicRaw}</span>
                </Toggle.Root>
              )}
              <button
                type="button"
                onClick={openSettings}
                aria-label="Camera Settings"
                aria-pressed={settingsOpen}
                className={cn(
                  'w-7 h-7 rounded-full bg-obsidian/66 border border-silver/20 flex items-center justify-center p-0 cursor-pointer transition-[border-color,color] duration-180 ease-ocular motion-reduce:transition-none',
                  settingsOpen ? 'border-amber text-amber' : 'text-silver/90',
                )}
              >
                {/* SF Symbol `slider.horizontal.3` */}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <circle cx="9" cy="6" r="2" fill="currentColor" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <circle cx="15" cy="12" r="2" fill="currentColor" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                  <circle cx="10" cy="18" r="2" fill="currentColor" />
                </svg>
              </button>
            </div>
          </m.div>

          {/* Live 3:4 Portrait Sensor Aperture */}
          <div className="relative mt-0.5 w-full">
            <ViewfinderCanvas camera={camera} />
          </div>

          <PortraitDeck
            camera={camera}
            isFree={isFree}
            qOpen={qOpen}
            onToggleQ={toggleQ}
            onOpenRecipeMenu={openRecipeMenu}
            onSwitchToPro={() => setHudLayout('pro')}
            chromeAnimate={chromeAnimate}
            chromeTransition={chromeTransition}
            disablePointer={Boolean(isGiantMode)}
          />
        </m.div>
        </div>

        {recipeMenuOpen && (
          <div className="absolute inset-0 bg-obsidian/72 pointer-events-none z-33" aria-hidden="true" />
        )}

        {qMounted && (
          <Suspense fallback={null}>
            <QuickMenuDialog
              camera={camera}
              isFree={isFree}
              open={qOpen}
              onClose={() => setQOpen(false)}
              onSwitchToPro={() => setHudLayout('pro')}
            />
          </Suspense>
        )}

        {recipeMenuMounted && (
          <Suspense fallback={null}>
            <RecipeSideMenu
              camera={camera}
              isFree={isFree}
              open={recipeMenuOpen}
              onClose={() => setRecipeMenuOpen(false)}
              onSwitchToPro={() => setHudLayout('pro')}
            />
          </Suspense>
        )}

        {settingsMounted && (
          <Suspense fallback={null}>
            <SettingsQuickSheet
              camera={camera}
              open={settingsOpen}
              onClose={() => setSettingsOpen(false)}
            />
          </Suspense>
        )}

        <div
          className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[34%] h-1 rounded-full bg-silver/78 z-40 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    </div>
  )
})
