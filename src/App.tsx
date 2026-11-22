import { useEffect, useState } from 'react'
import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { SCENES } from './config'
import { Backdrop } from './components/Backdrop'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CameraExperience } from './components/scenes/CameraExperience'
import { useActiveScene } from './hooks/useActiveScene'
import { useDesktopDeckNav } from './hooks/useDesktopDeckNav'
import { I18nProvider, useI18n, type Locale } from './i18n'

// The deck is driven by wheel and keyboard only, so touch screens get the scrolling flow.
const DECK_QUERY = '(min-width: 900px) and (pointer: fine)'

function getStepFromHash(): number {
  if (typeof window === 'undefined') return 0
  const id = window.location.hash.replace('#', '')
  const idx = SCENES.findIndex((s) => s.id === id)
  return idx >= 0 ? idx : 0
}

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mql = window.matchMedia(query)
    const onChange = () => setMatches(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [query])
  return matches
}

function HomePage() {
  const { t } = useI18n()
  const reduce = Boolean(useReducedMotion())
  const deckMedia = useMediaQuery(DECK_QUERY)
  const [step, setStep] = useState<number>(() => getStepFromHash())
  const isDesktopDeck = deckMedia && !reduce
  const goToStep = useDesktopDeckNav({ enabled: isDesktopDeck, step, onChangeStep: setStep })

  useEffect(() => {
    const onHashChange = () => {
      const next = getStepFromHash()
      if (isDesktopDeck) {
        goToStep(next, 'smooth')
      } else {
        setStep(next)
      }
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [goToStep, isDesktopDeck])

  const scrollActive = useActiveScene(!isDesktopDeck)
  const active = isDesktopDeck ? step : scrollActive

  useEffect(() => {
    if (!isDesktopDeck) return
    goToStep(getStepFromHash(), 'instant')
  }, [goToStep, isDesktopDeck])

  // Keep the deck step in the URL so refresh and shared links land on the same view.
  useEffect(() => {
    if (!isDesktopDeck) return
    const hash = step === 0 ? '' : `#${SCENES[step].id}`
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}${hash}`)
    }
  }, [isDesktopDeck, step])

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
        onGoTop={isDesktopDeck ? () => goToStep(0, 'smooth') : undefined}
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
