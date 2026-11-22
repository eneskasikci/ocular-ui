import { SCENES } from '../../config'
import { useCameraState } from '../../hooks/useCameraState'
import { DesktopDeck } from './DesktopDeck'
import { StaticCameraFlow } from './StaticCameraFlow'

interface CameraExperienceProps {
  active: number
  step: number
  isDesktopDeck: boolean
  goToStep: (target: number) => void
}

export function CameraExperience({ active, step, isDesktopDeck, goToStep }: CameraExperienceProps) {
  const activeScene = SCENES[active] ?? SCENES[0]
  const isRawActive = isDesktopDeck ? step === 4 : activeScene.id === 'raw'

  const camera = useCameraState(isRawActive)

  if (!isDesktopDeck) {
    return <StaticCameraFlow camera={camera} />
  }

  return <DesktopDeck camera={camera} step={step} goToStep={goToStep} />
}
