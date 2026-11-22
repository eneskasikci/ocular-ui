import { useCallback, useEffect, useRef, useState } from 'react'
import { useScroll, useSpring, useTransform } from 'motion/react'
import * as m from 'motion/react-m'
import { Tabs } from 'radix-ui'
import { SCENES } from '../../config'
import type { CameraController } from '../../hooks/useCameraState'
import { useI18n } from '../../i18n'
import { EASE_BUTTER, SPRING_DETENT } from '../../lib/motion'
import { Footer } from '../Footer'
import { HeroSlideshow } from '../HeroSlideshow'
import { CapturePanel } from '../panels/CapturePanel'
import { RawPanel } from '../panels/RawPanel'
import { RecipesPanel } from '../panels/RecipesPanel'
import { CameraPhone } from '../phone/CameraPhone'
import { PrivacyStage } from './Privacy'
import { HudLayoutSwitch, PhotoStepper } from './SimControls'
import { TiersStage } from './Tiers'

// Overdamped scroll spring matching minimalistscreens.com (zero bounce, silky glide).
const SCROLL_SPRING = { stiffness: 320, damping: 46, mass: 0.45 }
const MAX_STEP = SCENES.length - 1

type FeatureKey = 'recipes' | 'capture' | 'raw'

const FEATURE_TABS: readonly { id: FeatureKey; step: number; num: string }[] = [
  { id: 'recipes', step: 2, num: '01' },
  { id: 'capture', step: 3, num: '02' },
  { id: 'raw', step: 4, num: '03' },
]

const PHONE_BASE_W = 308
const PHONE_BASE_H = 645

function computeDeckMetrics(viewport: { w: number; h: number }) {
  // Gentle scale-up on large displays so phone and control deck stay refined with generous breathing room.
  const rawScale = Math.min(viewport.w / 1440, viewport.h / 900)
  const k = Math.min(1.16, Math.max(0.92, 0.94 + Math.max(0, rawScale - 1) * 0.28))
  const innerContainerW = Math.min(viewport.w / k, 1160)
  const gutter = viewport.w >= 720 ? 32 : 16
  const settledScale = Math.min(k * 0.94, Math.max(0.76, (viewport.h - 148) / PHONE_BASE_H))
  const settledLeftX = (-innerContainerW / 2 + gutter + 158) * k
  const giantScale = Math.min(5.2, Math.max(2.2, (viewport.w - 28) / PHONE_BASE_W))
  const carrierCenterY = viewport.h / 2 + 22
  const giantY = 76 + (PHONE_BASE_H / 2) * giantScale - carrierCenterY
  return { k, settledScale, settledLeftX, giantScale, giantY }
}

function renderFeaturePanel(id: FeatureKey, camera: CameraController) {
  switch (id) {
    case 'recipes':
      return <RecipesPanel headingId="h-recipes" camera={camera} />
    case 'capture':
      return <CapturePanel headingId="h-capture" camera={camera} />
    case 'raw':
      return <RawPanel headingId="h-raw" camera={camera} />
  }
}

interface Props {
  camera: CameraController
  step: number
  goToStep: (target: number) => void
}

export function DesktopDeck({ camera, step, goToStep }: Props) {
  const { t } = useI18n()
  const stageRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState(() =>
    typeof window !== 'undefined'
      ? { w: window.innerWidth, h: window.innerHeight }
      : { w: 1280, h: 800 },
  )

  useEffect(() => {
    let raf = 0
    const onResize = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        setViewport({ w: window.innerWidth, h: window.innerHeight })
      })
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      if (raf) window.cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  const { k, settledScale, settledLeftX, giantScale, giantY } = computeDeckMetrics(viewport)

  // Continuous spring-damped scroll progress (0..MAX_STEP) with plateau holds around each stop.
  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ['start start', 'end end'],
  })
  const smoothProgress = useSpring(scrollYProgress, SCROLL_SPRING)
  const progress = useTransform(smoothProgress, (v) => v * MAX_STEP)

  const heroY = useTransform(progress, [0, 0.06, 0.94, 1], ['0%', '0%', '-100%', '-100%'])
  const phoneX = useTransform(progress, [0, 1.06, 1.94, MAX_STEP], [0, 0, settledLeftX, settledLeftX])
  const phoneY = useTransform(progress, [0, 1.06, 1.94, MAX_STEP], [giantY, giantY, 0, 0])
  const phoneScale = useTransform(progress, [0, 1.06, 1.94, MAX_STEP], [giantScale, giantScale, settledScale, settledScale])
  const phoneOpacity = useTransform(progress, [0, 4.08, 4.72, MAX_STEP], [1, 1, 0, 0])

  const featureX = useTransform(progress, [0, 1.12, 1.92, MAX_STEP], [72, 72, 0, 0])
  const featureOpacity = useTransform(progress, [0, 1.12, 1.85, 4.08, 4.72, MAX_STEP], [0, 0, 1, 1, 0, 0])
  const tiersOpacity = useTransform(progress, [0, 4.28, 4.92, 5.08, 5.72, MAX_STEP], [0, 0, 1, 1, 0, 0])
  const privacyOpacity = useTransform(progress, [0, 5.28, 5.92, MAX_STEP], [0, 0, 1, 1])

  const enterCamera = useCallback(() => goToStep(1), [goToStep])
  const isHero = step === 0
  const isGiant = step <= 1
  const phoneVisible = step >= 1 && step <= 4
  const featuresVisible = step >= 2 && step <= 4
  const tiersVisible = step === 5
  const privacyVisible = step === 6
  const activeFeature: FeatureKey = step === 3 ? 'capture' : step === 4 ? 'raw' : 'recipes'

  return (
    <div ref={stageRef} className="desktop-deck-runway relative w-full">
      {/* Pinned full-viewport stage driven by spring-damped scroll progress */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="desktop-deck sticky top-0 h-svh w-full overflow-hidden flex items-center justify-center pointer-events-auto">
          {/* Slide 1: Full-height slideshow hero */}
          <m.div
            className="absolute inset-0 z-30 bg-obsidian will-change-transform"
            style={{ y: heroY, pointerEvents: isHero ? 'auto' : 'none' }}
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

          {/* Steps 1-4: Giant Phone -> Left Settled Phone -> Fade Out */}
          <m.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{ opacity: phoneOpacity }}
            aria-hidden={!phoneVisible}
            inert={!phoneVisible || undefined}
          >
            {/* Strictly NO CSS transform utilities here — Motion owns x, y, scale */}
            <m.div
              className="phone-carrier absolute left-1/2 top-[calc(50%+22px)] w-[308px] h-[645px] -ml-[154px] -mt-[322.5px] z-20 origin-center will-change-transform"
              style={{
                x: phoneX,
                y: phoneY,
                scale: phoneScale,
                pointerEvents: phoneVisible ? 'auto' : 'none',
              }}
            >
              <CameraPhone camera={camera} isGiantMode={isGiant} />
            </m.div>
          </m.div>

          {/* Steps 2-4: Always-Mounted Zero-Lag Right Feature Deck (Radix Tabs) */}
          <div style={{ zoom: k }} className="relative z-22 w-full max-w-[1160px] mx-auto px-[var(--gutter)] pt-[calc(var(--header)-10px)] grid grid-cols-[316px_minmax(0,1fr)] gap-x-[clamp(56px,6.5vw,108px)] items-center pointer-events-none">
            <div aria-hidden="true" />
            <m.div
              className="feature-column"
              style={{
                x: featureX,
                opacity: featureOpacity,
                pointerEvents: featuresVisible ? 'auto' : 'none',
              }}
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
                <div className="flex flex-col gap-2 max-w-[520px]">
                  <Tabs.List
                    aria-label={t.a11y.cameraFeatures}
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
                          <span>{t.scenes[tab.id]}</span>
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
                  {FEATURE_TABS.map(({ id, step: targetStep }) => {
                    // Past the deck, the last panel stays put while the whole column fades.
                    const isActive = step === targetStep || (step > 4 && targetStep === 4)
                    return (
                      <Tabs.Content key={id} value={id} forceMount asChild>
                        <m.div
                          className="feature-slot col-start-1 row-start-1 min-w-0"
                          initial={false}
                          animate={
                            isActive
                              ? { opacity: 1, y: 0, visibility: 'visible' }
                              : { opacity: 0, y: step > targetStep ? -18 : 18, transitionEnd: { visibility: 'hidden' } }
                          }
                          transition={
                            isActive
                              ? { duration: 0.52, ease: EASE_BUTTER }
                              : { duration: 0.2, ease: EASE_BUTTER }
                          }
                          style={{ pointerEvents: isActive ? 'auto' : 'none' }}
                          aria-hidden={!isActive}
                          inert={!isActive || undefined}
                        >
                          {renderFeaturePanel(id, camera)}
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
            style={{ opacity: tiersOpacity, pointerEvents: tiersVisible ? 'auto' : 'none' }}
            aria-labelledby="h-tiers"
            aria-hidden={!tiersVisible}
            inert={!tiersVisible || undefined}
          >
            <div style={{ zoom: k }} className="w-full flex justify-center">
              <TiersStage headingId="h-tiers" />
            </div>
          </m.section>

          {/* Step 6: Privacy + Docked Footer */}
          <m.section
            className="absolute inset-0 z-26 pt-[var(--header)] px-0 pb-0 flex flex-col items-stretch justify-between"
            style={{ opacity: privacyOpacity, pointerEvents: privacyVisible ? 'auto' : 'none' }}
            aria-labelledby="h-privacy"
            aria-hidden={!privacyVisible}
            inert={!privacyVisible || undefined}
          >
            <div style={{ zoom: k }} className="flex-1 flex items-center justify-center py-3 px-[var(--gutter)]">
              <PrivacyStage headingId="h-privacy" />
            </div>
            <div className="deck-footer w-full shrink-0">
              <Footer />
            </div>
          </m.section>
        </div>
      </div>

      {/* Native scroll-stop anchors (one 100svh slice per scene) */}
      {SCENES.map((s) => (
        <div key={s.id} id={s.id} className="h-svh pointer-events-none" aria-hidden="true" />
      ))}
    </div>
  )
}
