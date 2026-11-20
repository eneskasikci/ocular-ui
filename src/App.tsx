import { useEffect, useState } from 'react'
import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { SCENES } from './config'
import { Backdrop } from './components/Backdrop'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CameraExperience } from './components/scenes/CameraExperience'
import { useActiveScene } from './hooks/useActiveScene'

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
  const reduce = Boolean(useReducedMotion())
  const deckMedia = useMediaQuery(DECK_QUERY)
  const [step, setStep] = useState<number>(() => getStepFromHash())

  useEffect(() => {
    const onHashChange = () => setStep(getStepFromHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const isDesktopDeck = deckMedia && !reduce
  const scrollActive = useActiveScene(isDesktopDeck)
  const active = isDesktopDeck ? step : scrollActive

  useEffect(() => {
    document.title = 'Ocular — Film-recipe RAW camera for iPhone and iPad'
  }, [])

  useEffect(() => {
    if (isDesktopDeck) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [isDesktopDeck])

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
        Skip to content
      </a>
      <Header active={active} onGoTop={isDesktopDeck ? () => setStep(0) : undefined} />
      <main id="main">
        <CameraExperience
          active={active}
          step={step}
          isDesktopDeck={isDesktopDeck}
          onChangeStep={setStep}
        />
      </main>
      {!isDesktopDeck && <Footer />}
    </>
  )
}

export default function App() {
  return (
    <LazyMotion features={() => import('./motionFeatures').then((m) => m.default)} strict>
      <MotionConfig reducedMotion="user">
        <HomePage />
      </MotionConfig>
    </LazyMotion>
  )
}
