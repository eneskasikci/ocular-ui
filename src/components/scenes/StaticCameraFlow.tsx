import type { CameraController } from '../../hooks/useCameraState'
import { HeroSlideshow } from '../HeroSlideshow'
import { CapturePanel } from '../panels/CapturePanel'
import { RawPanel } from '../panels/RawPanel'
import { RecipesPanel } from '../panels/RecipesPanel'
import { CameraPhone } from '../phone/CameraPhone'
import { ViewfinderCanvas } from '../phone/ViewfinderCanvas'
import { Privacy } from './Privacy'
import { HudLayoutSwitch, PhotoStepper } from './SimControls'
import { Tiers } from './Tiers'

interface Props {
  camera: CameraController
}

export function StaticCameraFlow({ camera }: Props) {
  const sections = [
    {
      id: 'recipes',
      headingId: 'h-recipes-static',
      panel: <RecipesPanel headingId="h-recipes-static" camera={camera} />,
    },
    {
      id: 'capture',
      headingId: 'h-capture-static',
      panel: <CapturePanel headingId="h-capture-static" camera={camera} />,
    },
    {
      id: 'raw',
      headingId: 'h-raw-static',
      panel: <RawPanel headingId="h-raw-static" camera={camera} />,
    },
  ]

  return (
    <div className="phone-static-compact relative">
      <HeroSlideshow
        photoId={camera.photo.id}
        onSelectPhoto={camera.selectPhoto}
      />

      <div className="camera-static max-w-[1160px] mx-auto px-[var(--gutter)] grid grid-cols-1 gap-[18px] deck:grid-cols-[minmax(308px,340px)_minmax(0,1.08fr)] deck:gap-x-[clamp(48px,6vw,96px)] deck:gap-y-0 deck:items-start">
        <aside
          className="static-phone w-full max-w-[348px] mx-auto pt-7 pb-2 deck:col-1 deck:row-[1/4] deck:sticky deck:top-[calc(var(--header)+12px)] deck:min-h-[calc(100svh-var(--header)-24px)] deck:flex deck:flex-col deck:justify-center deck:py-0"
          id="camera"
          aria-label="Interactive Ocular camera viewfinder"
        >
          <div className="flex flex-col items-center gap-3">
            <CameraPhone camera={camera} />
            <HudLayoutSwitch
              layout={camera.hudLayout}
              onChange={camera.setHudLayout}
              wide
            />
            <PhotoStepper
              photoIndex={camera.photoIndex}
              photoName={camera.photo.name}
              wide
              onStep={camera.stepPhoto}
            />
          </div>
        </aside>

        {sections.map(({ id, headingId, panel }) => (
          <section
            key={id}
            className="flex flex-col justify-center gap-5 py-11 deck:col-2 deck:min-h-[84svh] deck:py-14"
            id={id}
            aria-labelledby={headingId}
          >
            <div className="flex flex-col gap-2.5 deck:hidden">
              <ViewfinderCanvas camera={camera} compact />
            </div>
            {panel}
          </section>
        ))}
      </div>

      <Tiers />
      <Privacy />
    </div>
  )
}
