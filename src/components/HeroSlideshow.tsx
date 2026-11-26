import { memo, useEffect, useRef, useState, type CSSProperties } from 'react'
import { useReducedMotion } from 'motion/react'
import { HERO_SIZES, PHOTOS, type PhotoAsset, type PhotoId } from '../data/photos'
import { useI18n } from '../i18n'
import { cn } from '../lib/cn'
import { GetItButton } from './GetItButton'
import { MeniscusMark } from './MeniscusMark'

interface Props {
  photoId: PhotoId
  paused?: boolean
  inDeck?: boolean
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
  const { t, format } = useI18n()
  const num = String(index + 1).padStart(2, '0')
  return (
    <button
      type="button"
      className={cn(
        'group relative flex-none h-full w-[78vw] xs:w-[clamp(280px,32vw,460px)] p-0 border-0 rounded-none overflow-hidden bg-deep cursor-pointer snap-center transition-[filter] duration-240 ease-ocular',
        selected &&
          "after:content-[''] after:absolute after:inset-0 after:shadow-[inset_0_0_0_3px_var(--color-amber)] after:pointer-events-none after:z-2",
      )}
      onClick={() => onSelectPhoto(photo.id)}
      aria-pressed={!isDuplicate ? selected : undefined}
      aria-hidden={isDuplicate || undefined}
      tabIndex={isDuplicate ? -1 : undefined}
      aria-label={
        isDuplicate
          ? undefined
          : format(t.a11y.selectPhotoForCamera, { name: photo.name, region: photo.region })
      }
    >
      <picture>
        <source type="image/avif" srcSet={photo.avifSrcSet} sizes={HERO_SIZES} />
        <img
          src={photo.src}
          srcSet={photo.webpSrcSet}
          sizes={HERO_SIZES}
          alt={isDuplicate ? '' : photo.alt}
          className="absolute inset-0 w-full h-full object-cover block select-none [-webkit-user-drag:none] transition-transform duration-600 ease-ocular group-hover:scale-[1.03]"
          style={{ objectPosition: photo.objectPosition }}
          fetchPriority={!isDuplicate && index === 0 ? 'high' : undefined}
          loading={isDuplicate || index > 2 ? 'lazy' : 'eager'}
          decoding="async"
          draggable={false}
        />
      </picture>
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
            {t.hero.inCamera}
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
        <span className="flex flex-col min-w-0 items-end text-right">
          <span className="font-display font-bold text-[0.94rem] leading-[1.15] text-silver whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
            {photo.name}
          </span>
          <span className="font-mono font-semibold text-[0.68rem] leading-[1.2] tracking-[0.06em] text-ink-muted uppercase whitespace-nowrap">
            {photo.exif}
          </span>
        </span>
      </span>
    </button>
  )
}

export const HeroSlideshow = memo(function HeroSlideshow({
  photoId,
  paused = false,
  inDeck = false,
  onSelectPhoto,
  onEnterCamera,
}: Props) {
  const { t } = useI18n()
  const reduceMotion = Boolean(useReducedMotion())
  const [userPaused, setUserPaused] = useState(false)
  // Stop the infinite drift once the hero scrolls out of view (scroll layout).
  const sectionRef = useRef<HTMLElement>(null)
  const [offscreen, setOffscreen] = useState(false)
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setOffscreen(!e.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const activeIndex = Math.max(0, PHOTOS.findIndex((p) => p.id === photoId))
  const activePhoto = PHOTOS[activeIndex] ?? PHOTOS[0]

  const stepPhoto = (dir: -1 | 1) => {
    const nextIdx = (activeIndex + dir + PHOTOS.length) % PHOTOS.length
    onSelectPhoto(PHOTOS[nextIdx].id)
  }

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative overflow-hidden',
        inDeck
          ? 'h-svh min-h-[580px]'
          : 'h-[82svh] min-h-[560px] max-h-[760px] deck:h-svh deck:min-h-[580px] deck:max-h-none',
      )}
      id="top"
      aria-labelledby="h-hero"
    >
      <div
        className="absolute inset-0 z-1 overflow-hidden"
        role="region"
        aria-label={t.a11y.choosePhoto}
      >
        <div
          className={cn(
            'flex gap-2.5 h-full',
            reduceMotion
              ? 'w-full overflow-x-auto [scroll-snap-type:x_mandatory] [scrollbar-width:thin]'
              : 'w-max slideshow-track-drift',
            !reduceMotion && !(paused || userPaused || offscreen) && 'will-change-transform',
            (paused || userPaused || offscreen) && 'is-paused',
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

        <div className="my-auto flex flex-col items-center text-center gap-3 max-w-[640px] mx-auto px-3 py-5">
          <div className="hero-in inline-flex items-center gap-2.5" style={{ '--i': 0 } as CSSProperties}>
            <MeniscusMark className="w-6 h-6 xs:w-7 xs:h-7 shrink-0" />
            <span className="font-wordmark font-bold text-[0.98rem] xs:text-[1.15rem] leading-none tracking-[0.16em] text-silver/95 [text-shadow:0_2px_16px_rgba(0,0,0,.6)]">
              OCULAR
            </span>
          </div>

          <h1
            id="h-hero"
            className="hero-in font-display font-bold text-[clamp(1.75rem,4.6vw,3rem)] leading-[1.04] tracking-[-0.025em] text-silver max-w-[18ch] [text-shadow:0_4px_28px_rgba(0,0,0,.6)]"
            style={{ '--i': 1 } as CSSProperties}
          >
            {t.hero.headline}
          </h1>

          <p
            className="hero-in font-body font-normal text-[clamp(0.98rem,1.9vw,1.18rem)] leading-[1.45] text-silver max-w-[44ch] mt-0.5 mb-1.5 tracking-[-0.01em] [text-shadow:0_2px_16px_rgba(0,0,0,.65)]"
            style={{ '--i': 2 } as CSSProperties}
          >
            {t.hero.tagline}
          </p>

          <div className="hero-in pointer-events-auto flex justify-center" style={{ '--i': 3 } as CSSProperties}>
            <GetItButton />
          </div>

          <p
            className="hero-in mt-0.5 mb-0 font-mono font-medium text-[0.78rem] leading-[1.5] tracking-[0.04em] text-silver/84 [text-shadow:0_1px_10px_rgba(0,0,0,.7)]"
            style={{ '--i': 4 } as CSSProperties}
          >
            {t.hero.subline}
          </p>
        </div>

        <div
          className="hero-in w-full max-w-[1100px] mx-auto flex flex-wrap items-center justify-between gap-3"
          style={{ '--i': 5 } as CSSProperties}
        >
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex gap-1.5 pointer-events-auto" role="group" aria-label={t.a11y.stepPhotos}>
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] rounded-full bg-obsidian/86 border border-hair-strong text-silver font-body font-semibold text-[1.15rem] leading-none inline-flex items-center justify-center cursor-pointer transition-colors duration-180 ease-ocular hover:border-amber hover:text-amber"
                onClick={() => stepPhoto(-1)}
                aria-label={t.a11y.prevPhoto}
              >
                ‹
              </button>
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] rounded-full bg-obsidian/86 border border-hair-strong text-silver font-body font-semibold text-[1.15rem] leading-none inline-flex items-center justify-center cursor-pointer transition-colors duration-180 ease-ocular hover:border-amber hover:text-amber"
                onClick={() => stepPhoto(1)}
                aria-label={t.a11y.nextPhoto}
              >
                ›
              </button>
              {!reduceMotion && (
                <button
                  type="button"
                  className="min-w-[44px] min-h-[44px] rounded-full bg-obsidian/86 border border-hair-strong text-silver inline-flex items-center justify-center cursor-pointer transition-colors duration-180 ease-ocular hover:border-amber hover:text-amber"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-label={userPaused ? t.a11y.playSlideshow : t.a11y.pauseSlideshow}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                    {userPaused ? <path d="M2.5 1.2v9.6L10.5 6z" /> : <path d="M2 1h3v10H2zM7 1h3v10H7z" />}
                  </svg>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-0.5 font-mono font-bold text-[0.72rem] xs:text-[0.75rem] leading-[1.2] tracking-[0.08em] text-silver [text-shadow:0_1px_10px_rgba(0,0,0,.75)]">
              <span>
                <strong className="text-amber">
                  {String(activeIndex + 1).padStart(2, '0')} / {String(PHOTOS.length).padStart(2, '0')}
                </strong>
                <span> · {activePhoto.name.toUpperCase()}</span>
                <span className="hidden xs:inline text-ink-muted"> · {activePhoto.exif}</span>
              </span>
              <span className="text-[0.68rem] font-medium tracking-[0.06em] text-silver/82 uppercase">
                {t.hero.shotWithOcular}
              </span>
            </div>
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
            <span>{t.hero.scrollIntoCamera}</span>
          </a>
        </div>
      </div>
    </section>
  )
})
