import { useReducedMotion } from 'motion/react'
import { SCENES } from '../../config'
import { useCameraState } from '../../hooks/useCameraState'
import { useDesktopDeckNav } from '../../hooks/useDesktopDeckNav'
import { DesktopDeck } from './DesktopDeck'
import { StaticCameraFlow } from './StaticCameraFlow'

interface CameraExperienceProps {
  active: number
  step: number
  isDesktopDeck: boolean
  onChangeStep: (next: number) => void
}

export function CameraExperience({ active, step, isDesktopDeck, onChangeStep }: CameraExperienceProps) {
  const reduceMotion = Boolean(useReducedMotion())
  const activeScene = SCENES[active] ?? SCENES[0]
  const isRawActive = isDesktopDeck ? step === 4 : activeScene.id === 'raw'

  const camera = useCameraState(isRawActive)
  const goToStep = useDesktopDeckNav({ enabled: isDesktopDeck, step, onChangeStep })

  if (!isDesktopDeck) {
    return <StaticCameraFlow camera={camera} reduceMotion={reduceMotion} />
  }

  return <DesktopDeck camera={camera} step={step} goToStep={goToStep} reduceMotion={reduceMotion} />
}
