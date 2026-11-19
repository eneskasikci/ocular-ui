import { lazy, Suspense, useEffect, useState } from 'react'
import { LazyMotion, MotionConfig, useReducedMotion } from 'motion/react'
import { SCENES } from './config'
import { Backdrop } from './components/Backdrop'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { CameraExperience } from './components/scenes/CameraExperience'
import { useRouter } from './context/router-context'
import { RouterProvider } from './context/RouterProvider'
import { useActiveScene } from './hooks/useActiveScene'

const PrivacyPage = lazy(() => import('./components/pages/PrivacyPage'))
const SupportPage = lazy(() => import('./components/pages/SupportPage'))

const DESKTOP_BP = 900

function getStepFromHash(): number {
  if (typeof window === 'undefined') return 0
  const id = window.location.hash.replace('#', '')
  const idx = SCENES.findIndex((s) => s.id === id)
  return idx >= 0 ? idx : 0
}

function HomePage() {
  const reduce = Boolean(useReducedMotion())
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280))
  const [step, setStep] = useState<number>(() => getStepFromHash())

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth)
    const onHashChange = () => setStep(getStepFromHash())
    window.addEventListener('resize', onResize, { passive: true })
    window.addEventListener('hashchange', onHashChange)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
    }
  }, [])

  const isDesktopDeck = vw >= DESKTOP_BP && !reduce
  const scrollActive = useActiveScene(isDesktopDeck)
  const active = isDesktopDeck ? step : scrollActive

  useEffect(() => {
    document.title = 'Ocular — Film-recipe RAW camera for iPhone and iPad'
  }, [])

  useEffect(() => {
    if (isDesktopDeck) window.scrollTo({ top: 0, behavior: 'instant' })
  }, [isDesktopDeck])

  return (
    <>
      <Backdrop active={SCENES[active].backdrop} />
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

function AppShell() {
  const { route } = useRouter()
  if (route === 'privacy') {
    return (
      <Suspense fallback={null}>
        <PrivacyPage />
      </Suspense>
    )
  }
  if (route === 'support') {
    return (
      <Suspense fallback={null}>
        <SupportPage />
      </Suspense>
    )
  }
  return <HomePage />
}

export default function App() {
  return (
    <LazyMotion features={() => import('./motionFeatures').then((m) => m.default)} strict>
      <MotionConfig reducedMotion="user">
        <RouterProvider>
          <AppShell />
        </RouterProvider>
      </MotionConfig>
    </LazyMotion>
  )
}
