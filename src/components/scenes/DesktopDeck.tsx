import { useCallback, useEffect, useState } from 'react'
import * as m from 'motion/react-m'
import { Tabs } from 'radix-ui'
import { SCENES } from '../../config'
import type { CameraController } from '../../hooks/useCameraState'
import { cn } from '../../lib/cn'
import { EASE_BUTTER, EASE_OUT, SPRING_DETENT } from '../../lib/motion'
import { Footer } from '../Footer'
import { HeroSlideshow } from '../HeroSlideshow'
import { CapturePanel } from '../panels/CapturePanel'
import { RawPanel } from '../panels/RawPanel'
import { RecipesPanel } from '../panels/RecipesPanel'
import { CameraPhone } from '../phone/CameraPhone'
import { PrivacyStage } from './Privacy'
import { HudLayoutSwitch, PhotoStepper } from './SimControls'
import { TiersStage } from './Tiers'

// Slides 5-7 hold still and crossfade: opacity only, so the compositor does all the work.
const FADE = { duration: 0.4, ease: EASE_OUT }

type FeatureKey = 'recipes' | 'capture' | 'raw'

const FEATURE_TABS: readonly { id: FeatureKey; step: number; num: string; label: string }[] = [
  { id: 'recipes', step: 2, num: '01', label: 'Recipes' },
  { id: 'capture', step: 3, num: '02', label: 'Capture' },
  { id: 'raw', step: 4, num: '03', label: 'Darkroom' },
]

const PHONE_BASE_W = 308
const PHONE_BASE_H = 645

interface Props {
  camera: CameraController
  step: number
  goToStep: (target: number) => void
}

export function DesktopDeck({ camera, step, goToStep }: Props) {
  const [viewport, setViewport] = useState(() =>
    typeof window !== 'undefined'
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 1280, h: 800 },
  )

  useEffect(() => {
    const onResize = () => setViewport({ w: window.innerWidth, h: window.innerHeight })
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Viewport-aware phone coordinates (no CSS transform on carrier — Motion owns x, y, scale)
  // Layout is designed at 1440x900; larger viewports scale the deck up uniformly (CSS zoom + phone scale).
  const k = Math.min(1.6, Math.max(1, Math.min(viewport.w / 1440, viewport.h / 900)))
  const stageMaxW = Math.min(viewport.w - 64 * k, 1100 * k)
  const settledScale = Math.min(k, Math.max(0.8, (viewport.h - 110) / PHONE_BASE_H))
  const settledLeftX = -(stageMaxW / 2) + (PHONE_BASE_W * settledScale) / 2 + 8 * k
  const giantScale = Math.min(5.2, Math.max(2.2, (viewport.w - 28) / PHONE_BASE_W))
  const carrierCenterY = viewport.h / 2 + 22
  const giantY = 76 + (PHONE_BASE_H / 2) * giantScale - carrierCenterY

  const enterCamera = useCallback(() => goToStep(1), [goToStep])
  const isHero = step === 0
  const isGiant = step <= 1
  const phoneVisible = step >= 1 && step <= 4
  const phoneParted = step >= 5
  const featuresVisible = step >= 2 && step <= 4
  const tiersVisible = step === 5
  const privacyVisible = step === 6
  const activeFeature: FeatureKey = step === 3 ? 'capture' : step === 4 ? 'raw' : 'recipes'

  const slots = [
    {
      id: 'recipes' as const,
      targetStep: 2,
      content: <RecipesPanel headingId="h-recipes" camera={camera} />,
    },
    {
      id: 'capture' as const,
      targetStep: 3,
      content: <CapturePanel headingId="h-capture" camera={camera} />,
    },
    {
      id: 'raw' as const,
      targetStep: 4,
      content: <RawPanel headingId="h-raw" camera={camera} />,
    },
  ]

  return (
    <div className="desktop-deck relative h-svh w-full overflow-hidden flex items-center justify-center">
      {/* Slide 1: Full-height slideshow hero */}
      <m.div
        className="absolute inset-0 z-30 bg-obsidian will-change-transform"
        initial={false}
        // Slide only: fading a parent of the composited track forces a full-screen offscreen pass each frame.
        animate={{ y: isHero ? '0%' : '-100%' }}
        transition={{ duration: 0.78, ease: EASE_BUTTER }}
        style={{ pointerEvents: isHero ? 'auto' : 'none' }}
        aria-hidden={!isHero}
        inert={!isHero || undefined}
      >
        <HeroSlideshow
          photoId={camera.photo.id}
          paused={!isHero}
          onSelectPhoto={camera.selectPhoto}
          onEnterCamera={enterCamera}
        />
      </m.div>

      {/* Steps 1-4: Giant Phone -> Left Settled Phone -> Parting Left */}
      <m.div
        className="absolute inset-0 z-20 pointer-events-none"
        initial={false}
        animate={
          phoneParted
            ? { opacity: 0 }
            : { opacity: 1 }
        }
        transition={FADE}
        aria-hidden={!phoneVisible}
        inert={!phoneVisible || undefined}
      >
        {/* Strictly NO CSS transform utilities here — Motion owns x, y, scale */}
        <m.div
          className="phone-carrier absolute left-1/2 top-[calc(50%+22px)] w-[308px] h-[645px] -ml-[154px] -mt-[322.5px] z-20 origin-center"
          initial={false}
          animate={
            isGiant
              ? { x: 0, y: giantY, scale: giantScale }
              : { x: settledLeftX, y: 0, scale: settledScale }
          }
          transition={{ duration: 0.86, ease: EASE_BUTTER }}
          style={{ pointerEvents: phoneVisible ? 'auto' : 'none' }}
        >
          <CameraPhone camera={camera} isGiantMode={isGiant} />
        </m.div>
      </m.div>

      {/* Steps 2-4: Always-Mounted Zero-Lag Right Feature Deck (Radix Tabs) */}
      <div style={{ zoom: k }} className="relative z-22 w-full max-w-[1100px] mx-auto px-[var(--gutter)] pt-[calc(var(--header)-10px)] grid grid-cols-[332px_minmax(0,1fr)] gap-x-[clamp(32px,4.5vw,68px)] items-center pointer-events-none">
        <div aria-hidden="true" />
        <m.div
          className="feature-column"
          initial={false}
          animate={
            featuresVisible
              ? { x: 0, opacity: 1 }
              : step < 2
                ? { x: 72, opacity: 0 }
                : { x: 0, opacity: 0 }
          }
          transition={step >= 4 ? FADE : { duration: 0.76, ease: EASE_BUTTER }}
          style={{ pointerEvents: featuresVisible ? 'auto' : 'none' }}
          aria-hidden={!featuresVisible}
          inert={!featuresVisible || undefined}
        >
          <Tabs.Root
            value={activeFeature}
            onValueChange={(v) => {
              const tab = FEATURE_TABS.find((t) => t.id === v)
              if (tab) goToStep(tab.step)
            }}
            className="flex flex-col gap-3.5 min-w-0"
          >
            <div className="flex flex-col gap-2 max-w-[560px]">
              <Tabs.List
                aria-label="Camera features"
                className="self-start inline-flex gap-1 p-1 rounded-[14px] bg-[#0f1014]/94 border border-hair shadow-[0_12px_32px_rgba(0,0,0,.36)] reduced-transparency:bg-graphite"
              >
                {FEATURE_TABS.map((tab) => {
                  const isCurrent = tab.id === activeFeature
                  return (
                    <Tabs.Trigger
                      key={tab.id}
                      value={tab.id}
                      className="feature-tab relative min-h-10 px-3 border-0 rounded-[10px] bg-transparent inline-flex items-center gap-1.5 font-mono font-bold text-[0.75rem] leading-none tracking-[0.06em] text-ink-muted cursor-pointer z-1 whitespace-nowrap hover:text-silver data-[state=active]:text-amber"
                    >
                      {isCurrent && (
                        <m.span
                          layoutId="feature-tab-bg"
                          layoutDependency={tab.id}
                          className="absolute inset-0 rounded-[10px] bg-amber/16 border border-amber/60 -z-1"
                          transition={SPRING_DETENT}
                        />
                      )}
                      <span className="opacity-72">{tab.num}</span>
                      <span>{tab.label}</span>
                    </Tabs.Trigger>
                  )
                })}
              </Tabs.List>

              <div className="flex flex-wrap items-center justify-between gap-x-3.5 gap-y-2.5">
                <PhotoStepper
                  photoIndex={camera.photoIndex}
                  photoName={camera.photo.name}
                  onStep={camera.stepPhoto}
                />
                <HudLayoutSwitch
                  layout={camera.hudLayout}
                  onChange={camera.setHudLayout}
                />
              </div>
            </div>

            <div className="grid items-start">
              {slots.map(({ id, targetStep, content }) => {
                // Past the deck, the last panel stays put while the whole column fades.
                const isActive = step === targetStep || (step > 4 && targetStep === 4)
                return (
                  <Tabs.Content key={id} value={id} forceMount asChild>
                    <m.div
                      className="feature-slot col-start-1 row-start-1 min-w-0 will-change-[transform,opacity]"
                      initial={false}
                      animate={
                        isActive
                          ? { opacity: 1, y: 0, visibility: 'visible' }
                          : { opacity: 0, y: step > targetStep ? -22 : 22, transitionEnd: { visibility: 'hidden' } }
                      }
                      transition={{ duration: 0.52, ease: EASE_BUTTER }}
                      style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                      aria-hidden={!isActive}
                      inert={!isActive || undefined}
                    >
                      {content}
                    </m.div>
                  </Tabs.Content>
                )
              })}
            </div>
          </Tabs.Root>
        </m.div>
      </div>

      {/* Step 5: Free & Pro Tiers */}
      <m.section
        className="absolute inset-0 z-26 flex items-center justify-center pt-[calc(var(--header)+12px)] px-[var(--gutter)] pb-5"
        initial={false}
        animate={{ opacity: tiersVisible ? 1 : 0 }}
        transition={FADE}
        aria-labelledby="h-tiers"
        aria-hidden={!tiersVisible}
        inert={!tiersVisible || undefined}
        style={{ pointerEvents: tiersVisible ? 'auto' : 'none' }}
      >
        <div style={{ zoom: k }} className="w-full flex justify-center">
          <TiersStage headingId="h-tiers" />
        </div>
      </m.section>

      {/* Step 6: Privacy + Docked Footer */}
      <m.section
        className="absolute inset-0 z-26 pt-[var(--header)] px-0 pb-0 flex flex-col items-stretch justify-between"
        aria-labelledby="h-privacy"
        aria-hidden={!privacyVisible}
        inert={!privacyVisible || undefined}
        initial={false}
        animate={{ opacity: privacyVisible ? 1 : 0 }}
        transition={FADE}
        style={{ pointerEvents: privacyVisible ? 'auto' : 'none' }}
      >
        <div style={{ zoom: k }} className="flex-1 flex items-center justify-center py-3 px-[var(--gutter)]">
          <PrivacyStage headingId="h-privacy" />
        </div>
        <div className="deck-footer w-full shrink-0">
          <Footer />
        </div>
      </m.section>

      {/* Right-Edge Minimal Detent Rail */}
      <nav
        className="step-rail hidden rail:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 flex-col gap-1"
        aria-label="View stops"
      >
        {SCENES.map((s, idx) => {
          const isCurrent = idx === step
          return (
            <button
              key={s.id}
              type="button"
              className="step-dot group w-6 h-6 p-0 border-0 bg-transparent cursor-pointer flex items-center justify-center"
              onClick={() => goToStep(idx)}
              aria-label={`Jump to ${s.label} (${idx + 1} of ${SCENES.length})`}
              aria-current={isCurrent ? 'step' : undefined}
              title={s.label}
            >
              <span
                className={cn(
                  'block w-1.5 rounded-full transition-[height,background-color] duration-280 ease-ocular',
                  isCurrent ? 'h-5 bg-amber' : 'h-1.5 bg-silver/30 group-hover:bg-silver/72',
                )}
              />
            </button>
          )
        })}
      </nav>
    </div>
  )
}
