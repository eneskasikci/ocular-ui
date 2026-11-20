import type { CSSProperties } from 'react'
import { PHOTOS, type PhotoAsset, type PhotoId } from '../data/photos'
import { cn } from '../lib/cn'
import { GetItButton } from './GetItButton'
import { MeniscusMark } from './MeniscusMark'

interface Props {
  photoId: PhotoId
  reduceMotion: boolean
  paused?: boolean
  onSelectPhoto: (id: PhotoId) => void
  onEnterCamera?: () => void
}

function SlideCard({
  photo,
  index,
  selected,
  isDuplicate,
  onSelectPhoto,
}: {
  photo: PhotoAsset
  index: number
  selected: boolean
  isDuplicate: boolean
  onSelectPhoto: (id: PhotoId) => void
}) {
  const num = String(index + 1).padStart(2, '0')
  return (
    <button
      type="button"
      className={cn(
        'group relative flex-none h-full w-[78vw] xs:w-[clamp(300px,38vw,540px)] p-0 border-0 rounded-none overflow-hidden bg-deep cursor-pointer snap-center transition-[filter] duration-240 ease-ocular',
        selected &&
          "after:content-[''] after:absolute after:inset-0 after:shadow-[inset_0_0_0_3px_var(--color-amber)] after:pointer-events-none after:z-2",
      )}
      onClick={() => onSelectPhoto(photo.id)}
      aria-pressed={!isDuplicate ? selected : undefined}
      aria-hidden={isDuplicate || undefined}
      tabIndex={isDuplicate ? -1 : undefined}
      aria-label={isDuplicate ? undefined : `Select ${photo.name} (${photo.region}) for the Ocular camera`}
    >
      <img
        src={photo.src}
        alt={isDuplicate ? '' : photo.alt}
        className="absolute inset-0 w-full h-full object-cover block select-none [-webkit-user-drag:none] transition-transform duration-600 ease-ocular group-hover:scale-[1.03]"
        style={{ objectPosition: photo.objectPosition }}
        fetchPriority={!isDuplicate && index === 0 ? 'high' : undefined}
        loading={isDuplicate || index > 3 ? 'lazy' : 'eager'}
        decoding="async"
        draggable={false}
      />
      <span
        className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(11,12,14,.54)_0%,rgba(11,12,14,.16)_28%,rgba(11,12,14,.16)_66%,rgba(11,12,14,.84)_100%)]"
        aria-hidden="true"
      />
      {selected && (
        <>
          <span
            className="absolute top-[calc(var(--header)+14px)] left-4 z-3 px-2.5 py-[5px] rounded-full bg-deep/88 border border-amber/80 text-amber font-mono font-bold text-[0.72rem] leading-none tracking-[0.08em] pointer-events-none"
            aria-hidden="true"
          >
            IN CAMERA
          </span>
          <span
            className="absolute inset-3.5 top-[calc(var(--header)+6px)] bottom-[118px] xs:bottom-[74px] border border-amber/36 pointer-events-none z-2"
            aria-hidden="true"
          />
        </>
      )}
      <span
        className="absolute left-4 right-4 bottom-[126px] xs:bottom-[82px] z-3 flex items-baseline justify-between gap-2 pointer-events-none text-left"
        aria-hidden="true"
      >
        <span
          className={cn(
            'font-mono font-bold text-[0.76rem] leading-none shrink-0',
            selected ? 'text-amber' : 'text-ink-muted',
          )}
        >
          {num}
        </span>
        <span className="font-display font-bold text-[0.96rem] leading-[1.15] text-silver whitespace-nowrap overflow-hidden text-ellipsis">
          {photo.name}
        </span>
      </span>
    </button>
  )
}

export function HeroSlideshow({
  photoId,
  reduceMotion,
  paused = false,
  onSelectPhoto,
  onEnterCamera,
}: Props) {
  const activeIndex = Math.max(0, PHOTOS.findIndex((p) => p.id === photoId))
  const activePhoto = PHOTOS[activeIndex] ?? PHOTOS[0]

  const stepPhoto = (dir: -1 | 1) => {
    const nextIdx = (activeIndex + dir + PHOTOS.length) % PHOTOS.length
    onSelectPhoto(PHOTOS[nextIdx].id)
  }

  return (
    <section className="relative h-svh min-h-[580px] overflow-hidden" id="top" aria-labelledby="h-hero">
      <div
        className="absolute inset-0 z-1 overflow-hidden"
        role="region"
        aria-label="Choose a photograph to preview inside the Ocular camera"
      >
        <div
          className={cn(
            'flex gap-2.5 h-full',
            reduceMotion
              ? 'w-full overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:thin]'
              : 'w-max will-change-transform slideshow-track-drift',
            paused && 'is-paused',
          )}
        >
          {PHOTOS.map((photo, index) => (
            <SlideCard
              key={photo.id}
              photo={photo}
              index={index}
              selected={photo.id === photoId}
              isDuplicate={false}
              onSelectPhoto={onSelectPhoto}
            />
          ))}
          {!reduceMotion &&
            PHOTOS.map((photo, index) => (
              <SlideCard
                key={`${photo.id}-dup`}
                photo={photo}
                index={index}
                selected={photo.id === photoId}
                isDuplicate
                onSelectPhoto={onSelectPhoto}
              />
            ))}
        </div>
      </div>

      <div className="relative z-5 h-full pt-[calc(var(--header)+16px)] px-[var(--gutter)] pb-5 flex flex-col justify-between pointer-events-none">
        <div
          className="absolute inset-0 -z-1 pointer-events-none bg-[linear-gradient(180deg,rgba(11,12,14,.64)_0%,rgba(11,12,14,0)_24%,rgba(11,12,14,0)_64%,rgba(11,12,14,.84)_100%),radial-gradient(64%_52%_at_50%_48%,rgba(11,12,14,.84)_0%,rgba(11,12,14,.54)_58%,rgba(11,12,14,0)_100%)]"
          aria-hidden="true"
        />

        <div className="my-auto flex flex-col items-center text-center gap-3 max-w-[560px] mx-auto px-3 py-5">
          <div className="hero-in inline-flex items-center gap-3.5" style={{ '--i': 0 } as CSSProperties}>
            <MeniscusMark className="w-[clamp(34px,4.2vw,46px)] h-[clamp(34px,4.2vw,46px)] shrink-0" />
            <h1
              id="h-hero"
              className="font-wordmark font-bold text-[clamp(2.4rem,6vw,4.35rem)] leading-[0.94] tracking-[0.1em] text-silver [text-shadow:0_4px_28px_rgba(0,0,0,.55)]"
            >
              OCULAR
            </h1>
          </div>

          <p
            className="hero-in font-body font-normal text-[clamp(1.04rem,2vw,1.26rem)] leading-[1.45] text-silver max-w-[36ch] mt-0.5 mb-1.5 tracking-[-0.01em] [text-shadow:0_2px_16px_rgba(0,0,0,.65)]"
            style={{ '--i': 1 } as CSSProperties}
          >
            Film recipes and 14-bit RAW, framed before the shutter.
          </p>

          <div className="hero-in pointer-events-auto flex justify-center" style={{ '--i': 2 } as CSSProperties}>
            <GetItButton />
          </div>

          <p
            className="hero-in mt-0.5 mb-0 font-mono font-medium text-[0.78rem] leading-[1.5] tracking-[0.04em] text-silver/84 [text-shadow:0_1px_10px_rgba(0,0,0,.7)]"
            style={{ '--i': 3 } as CSSProperties}
          >
            Free to start · 3-day Pro trial · No account
          </p>
        </div>

        <div
          className="hero-in w-full max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-3"
          style={{ '--i': 4 } as CSSProperties}
        >
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex gap-1.5 pointer-events-auto" role="group" aria-label="Step through sample photographs">
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] rounded-full bg-obsidian/86 border border-hair-strong text-silver font-body font-semibold text-[1.15rem] leading-none inline-flex items-center justify-center cursor-pointer transition-colors duration-180 ease-ocular hover:border-amber hover:text-amber"
                onClick={() => stepPhoto(-1)}
                aria-label="Previous photograph"
              >
                ‹
              </button>
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] rounded-full bg-obsidian/86 border border-hair-strong text-silver font-body font-semibold text-[1.15rem] leading-none inline-flex items-center justify-center cursor-pointer transition-colors duration-180 ease-ocular hover:border-amber hover:text-amber"
                onClick={() => stepPhoto(1)}
                aria-label="Next photograph"
              >
                ›
              </button>
            </div>
            <span className="font-mono font-bold text-[0.75rem] leading-[1.2] tracking-[0.08em] text-silver [text-shadow:0_1px_10px_rgba(0,0,0,.75)]">
              <strong className="text-amber">
                {String(activeIndex + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
              </strong>
              <span> · {activePhoto.name.toUpperCase()}</span>
            </span>
          </div>

          <a
            className="pointer-events-auto inline-flex items-center gap-3 min-h-[44px] text-silver no-underline font-mono font-bold text-[0.75rem] tracking-[0.14em] uppercase [text-shadow:0_1px_10px_rgba(0,0,0,.75)] hover:text-amber"
            href="#camera"
            onClick={(e) => {
              if (!onEnterCamera) return
              e.preventDefault()
              onEnterCamera()
            }}
          >
            <span className="scroll-cue-line block w-px h-6 bg-current origin-top" aria-hidden="true" />
            <span>Scroll into camera</span>
          </a>
        </div>
      </div>
    </section>
  )
}
