export type PhotoId =
  | 'boulevard'
  | 'canal'
  | 'neon'
  | 'brick'
  | 'warship'
  | 'corner'
  | 'alley'
  | 'ferry'
  | 'twilight'

export interface PhotoAsset {
  id: PhotoId
  name: string
  region: string
  exif: string
  /** Single WebP (≤960w) shared by the small phone/viewfinder renders so they hit one cached file. */
  src: string
  avifSrcSet: string
  webpSrcSet: string
  objectPosition: string
  alt: string
}

/** Same rule as scripts/build-photos.sh: 640/960/1280 below the source width, plus the source width. */
const variantWidths = (width: number) => [640, 960, 1280].filter((w) => w < width).concat(width)

const srcSet = (slug: string, width: number, ext: 'avif' | 'webp') =>
  variantWidths(width)
    .map((w) => `/photos/${slug}-${w}.${ext} ${w}w`)
    .join(', ')

function photo(
  slug: string,
  width: number,
  meta: Omit<PhotoAsset, 'src' | 'avifSrcSet' | 'webpSrcSet'>,
): PhotoAsset {
  return {
    ...meta,
    src: `/photos/${slug}-${Math.min(960, width)}.webp`,
    avifSrcSet: srcSet(slug, width, 'avif'),
    webpSrcSet: srcSet(slug, width, 'webp'),
  }
}

/** Matches the hero card widths: w-[78vw] below xs (35rem), clamp(280px,32vw,460px) above. */
export const HERO_SIZES = '(min-width: 1438px) 460px, (min-width: 875px) 32vw, (min-width: 560px) 280px, 78vw'

export const PHOTOS: readonly PhotoAsset[] = [
  photo('golden-clouds-boulevard', 768, {
    id: 'boulevard',
    name: 'Golden Boulevard',
    region: 'Calm Chrome',
    exif: 'CC · 50mm · Golden Skin',
    objectPosition: '50% 56%',
    alt: 'Glowing warm dusk clouds over autumn trees lining a quiet boulevard, shot on iPhone with Ocular Calm Chrome at 50mm.',
  }),
  photo('autumn-canal-reflection', 1148, {
    id: 'canal',
    name: 'Autumn Canal',
    region: 'Color Negative',
    exif: 'CN · 24mm · DR400',
    objectPosition: '50% 54%',
    alt: 'Calm tree-lined canal reflecting autumn foliage and sunlit clouds, shot on iPhone with Ocular Color Negative at 24mm.',
  }),
  photo('rainy-night-neon-street', 1280, {
    id: 'neon',
    name: 'Rainy Neon',
    region: 'Amber Street',
    exif: 'CN · 35mm · DR400',
    objectPosition: '50% 55%',
    alt: 'Rain-slicked city street at night reflecting crimson signage and streetlamps, shot on iPhone with Ocular Amber Street at 35mm.',
  }),
  photo('waterfront-sunset-brick', 1280, {
    id: 'brick',
    name: 'Brick Sunset',
    region: 'Halation',
    exif: 'CC · 24mm · Halation',
    objectPosition: '50% 48%',
    alt: 'Red-brick Nordic waterfront buildings silhouetted beneath glowing sunset clouds, shot on iPhone with Ocular Calm Chrome and halation at 24mm.',
  }),
  photo('historic-timber-warship', 768, {
    id: 'warship',
    name: 'Timber Hull',
    region: 'Golden Skin',
    exif: 'CC · 24mm · −0.5 EV',
    objectPosition: '50% 52%',
    alt: 'Carved oak hull and rigging of a historic wooden warship in dramatic low light, shot on iPhone with Ocular Calm Chrome at 24mm.',
  }),
  photo('blue-hour-street-corner', 665, {
    id: 'corner',
    name: 'Blue Hour Corner',
    region: 'Halation',
    exif: 'CC · 24mm · DR400',
    objectPosition: '50% 54%',
    alt: 'Quiet European stone street corner and wet crosswalk at blue hour, shot on iPhone with Ocular Calm Chrome at 24mm.',
  }),
  photo('rainy-alley-string-lights', 724, {
    id: 'alley',
    name: 'Lantern Alley',
    region: 'Amber Street',
    exif: 'CN · 35mm · Amber Street',
    objectPosition: '50% 52%',
    alt: 'Rainy cobblestone alley illuminated by warm overhead string lights at night, shot on iPhone with Ocular Amber Street at 35mm.',
  }),
  photo('ferry-window-skyline', 768, {
    id: 'ferry',
    name: 'Ferry Window',
    region: 'Golden Skin',
    exif: 'CC · 77mm · −1.9 EV',
    objectPosition: '46% 52%',
    alt: 'City skyline and spire framed through a dark commuter ferry window at dusk, shot on iPhone with Ocular Calm Chrome at 77mm.',
  }),
  photo('twilight-promenade-halation', 768, {
    id: 'twilight',
    name: 'Frosty Twilight',
    region: 'Halation',
    exif: 'CC · 24mm · Halation',
    objectPosition: '50% 50%',
    alt: 'Snow-dusted waterfront promenade under glowing streetlamp halation at blue hour, shot on iPhone with Ocular Calm Chrome at 24mm.',
  }),
] as const

export const PHOTO_MAP: Record<PhotoId, PhotoAsset> = {
  boulevard: PHOTOS[0],
  canal: PHOTOS[1],
  neon: PHOTOS[2],
  brick: PHOTOS[3],
  warship: PHOTOS[4],
  corner: PHOTOS[5],
  alley: PHOTOS[6],
  ferry: PHOTOS[7],
  twilight: PHOTOS[8],
}
