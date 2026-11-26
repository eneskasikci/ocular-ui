import { useCallback, useLayoutEffect, useSyncExternalStore } from 'react'
import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { SCENES } from './config'
import { Backdrop } from './components/Backdrop'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { LanguageBanner } from './components/LanguageBanner'
import { CameraExperience } from './components/scenes/CameraExperience'
import { useActiveScene } from './hooks/useActiveScene'
import { getStepFromHash, useDesktopDeckNav } from './hooks/useDesktopDeckNav'
import { I18nProvider, useI18n, type Locale } from './i18n'

// The deck is driven by wheel and keyboard only, so touch screens get the scrolling flow.
const DECK_QUERY = '(min-width: 900px) and (pointer: fine)'
const getServerMediaSnapshot = () => false

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mql = window.matchMedia(query)
      const onChange = () => onStoreChange()
      mql.addEventListener('change', onChange)
      return () => mql.removeEventListener('change', onChange)
    },
    [query],
  )
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query])
  return useSyncExternalStore(subscribe, getSnapshot, getServerMediaSnapshot)
}

function HomePage() {
  const { t } = useI18n()
  const reduce = Boolean(useReducedMotion())
  const deckMedia = useMediaQuery(DECK_QUERY)
  const isDesktopDeck = deckMedia && !reduce
  const { step, goToStep } = useDesktopDeckNav({ enabled: isDesktopDeck })

  const scrollActive = useActiveScene(!isDesktopDeck)
  const active = isDesktopDeck ? step : scrollActive

  useLayoutEffect(() => {
    if (!isDesktopDeck) return
    goToStep(getStepFromHash())
  }, [goToStep, isDesktopDeck])

  return (
    <>
      {/* Hero (and the giant deck phone) cover the backdrop, so its blobs need not drift there. */}
      <Backdrop active={SCENES[active].backdrop} still={isDesktopDeck ? active <= 1 : active === 0} />
      <a
        className="fixed left-[var(--gutter)] -top-[100px] focus:top-2 z-100 px-4 py-3 bg-silver text-obsidian rounded-lg font-bold"
        href="#main"
      >
        {t.a11y.skipToContent}
      </a>
      <Header
        active={active}
        onGoTop={isDesktopDeck ? () => goToStep(0) : undefined}
      />
      <main id="main">
        <CameraExperience
          active={active}
          step={step}
          isDesktopDeck={isDesktopDeck}
          goToStep={goToStep}
        />
      </main>
      {!isDesktopDeck && <Footer />}
      <LanguageBanner />
    </>
  )
}

export default function App({ initialLocale }: { initialLocale?: Locale }) {
  return (
    <I18nProvider initialLocale={initialLocale}>
      <LazyMotion features={() => import('./motionFeatures').then((m) => m.default)} strict>
        <MotionConfig reducedMotion="user">
          <HomePage />
        </MotionConfig>
      </LazyMotion>
    </I18nProvider>
  )
}
