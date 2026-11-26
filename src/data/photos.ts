export type PhotoId =
  | 'reine'
  | 'kotor'
  | 'aurora'
  | 'sveti'
  | 'lanterns'
  | 'summit'
  | 'meadow'
  | 'dome'
  | 'village'

export interface PhotoAsset {
  id: PhotoId
  name: string
  region: string
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
  photo('nusfjord-lofoten-fishing-cabins', 720, {
    id: 'reine',
    name: 'Nusfjord',
    region: 'Lofoten',
    objectPosition: '50% 62%',
    alt: 'Red and ochre fishing cabins beside calm harbor water beneath rugged granite peaks in Nusfjord, Lofoten.',
  }),
  photo('bay-of-kotor-sunset', 720, {
    id: 'kotor',
    name: 'Bay of Kotor',
    region: 'Sunset',
    objectPosition: '52% 52%',
    alt: 'Highland view over the Bay of Kotor at sunset, with amber and magenta clouds reflecting across the water.',
  }),
  photo('lofoten-northern-lights', 960, {
    id: 'aurora',
    name: 'Northern Lights',
    region: 'Lofoten',
    objectPosition: '50% 56%',
    alt: 'Green northern lights glowing above a dark mountain ridge and softly lit harbor cabins in Lofoten at night.',
  }),
  photo('sveti-stefan-island-montenegro', 1280, {
    id: 'sveti',
    name: 'Sveti Stefan',
    region: 'Adriatic',
    objectPosition: '62% 46%',
    alt: 'Sveti Stefan island village with terracotta rooftops, linked by a narrow causeway over deep blue Adriatic water.',
  }),
  photo('lantern-alley-blue-hour', 1086, {
    id: 'lanterns',
    name: 'Lantern Alley',
    region: 'Blue Hour',
    objectPosition: '50% 50%',
    alt: 'Warm golden string bulbs and paper lanterns illuminating a cobblestone courtyard archway during blue hour.',
  }),
  photo('reinebringen-lofoten-summit-view', 886, {
    id: 'summit',
    name: 'Reinebringen',
    region: 'Summit',
    objectPosition: '50% 55%',
    alt: 'View from the Reinebringen summit over coastal islands, bridges, and deep blue Lofoten fjord water under clear sky.',
  }),
  photo('lofoten-horses-arctic-meadow', 960, {
    id: 'meadow',
    name: 'Arctic Meadow',
    region: 'Lofoten',
    objectPosition: '50% 66%',
    alt: 'Horses grazing on a green seaside pasture in Lofoten, with a coastal mountain ridge and fjord behind.',
  }),
  photo('copenhagen-marble-church-dome', 768, {
    id: 'dome',
    name: 'Marble Dome',
    region: 'Copenhagen',
    objectPosition: '50% 42%',
    alt: "Patina-green dome of Copenhagen's Marble Church with limestone columns framed against a crisp blue sky.",
  }),
  photo('lofoten-village-arctic-night', 960, {
    id: 'village',
    name: 'Arctic Night',
    region: 'Lofoten',
    objectPosition: '50% 68%',
    alt: 'Wooden Lofoten houses glowing warmly under moonlight and silver clouds at night.',
  }),
] as const

export const PHOTO_MAP: Record<PhotoId, PhotoAsset> = {
  reine: PHOTOS[0],
  kotor: PHOTOS[1],
  aurora: PHOTOS[2],
  sveti: PHOTOS[3],
  lanterns: PHOTOS[4],
  summit: PHOTOS[5],
  meadow: PHOTOS[6],
  dome: PHOTOS[7],
  village: PHOTOS[8],
}
