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
  src: string
  objectPosition: string
  alt: string
}

export const PHOTOS: readonly PhotoAsset[] = [
  {
    id: 'reine',
    name: 'Nusfjord',
    region: 'Lofoten',
    src: '/photos/4A5DC539-F46C-400C-A8A9-A31D373D068F_1_102_a.jpeg',
    objectPosition: '50% 62%',
    alt: 'Red and ochre fishing cabins beside calm harbor water beneath rugged granite mountain peaks in Reine, Lofoten.',
  },
  {
    id: 'kotor',
    name: 'Bay of Kotor',
    region: 'Sunset',
    src: '/photos/E681E4EC-934C-4E6D-9D08-A42D9979AC8D_1_102_a.jpeg',
    objectPosition: '52% 52%',
    alt: 'Highland view overlooking a calm coastal bay at sunset with amber and magenta clouds reflecting across the water.',
  },
  {
    id: 'aurora',
    name: 'Northern Lights',
    region: 'Lofoten',
    src: '/photos/EDEF1BF6-4742-43EE-8FB9-EF89C086E5D6_1_102_o.jpeg',
    objectPosition: '50% 56%',
    alt: 'Green aurora borealis ribbons glowing above a dark mountain ridge and softly lit Nordic harbor cabins at night.',
  },
  {
    id: 'sveti',
    name: 'Sveti Stefan',
    region: 'Adriatic',
    src: '/photos/8F673B74-8062-4B02-8B45-76BE98863CEC_1_102_a.jpeg',
    objectPosition: '62% 46%',
    alt: 'Stone island village with terracotta rooftops connected by a narrow causeway over deep blue Adriatic water.',
  },
  {
    id: 'lanterns',
    name: 'Lantern Alley',
    region: 'Blue Hour',
    src: '/photos/96AC2624-1A29-437B-A572-DDFDE1B99FB9_1_105_c.jpeg',
    objectPosition: '50% 50%',
    alt: 'Warm golden string bulbs and paper lanterns illuminating a cobblestone courtyard archway during blue hour.',
  },
  {
    id: 'summit',
    name: 'Reinebringen',
    region: 'Summit',
    src: '/photos/07360E28-9D3D-40CD-8D53-EA0F4A4553E6_1_105_c.jpeg',
    objectPosition: '50% 55%',
    alt: 'Aerial summit perspective above coastal islands, bridges, and deep blue Norwegian fjord waters under clear sky.',
  },
  {
    id: 'meadow',
    name: 'Arctic Meadow',
    region: 'Lofoten',
    src: '/photos/AF336D00-8C60-4C0B-B81A-E50A66201264_1_102_a.jpeg',
    objectPosition: '50% 66%',
    alt: 'Herd of horses grazing on seaside green pasture with a coastal mountain ridge and fjord in the background.',
  },
  {
    id: 'dome',
    name: 'Marble Dome',
    region: 'Copenhagen',
    src: '/photos/AAA8B6B1-EC53-4E54-89E6-848808EF79FF_1_105_c.jpeg',
    objectPosition: '50% 42%',
    alt: 'Patina-green neoclassical church dome with limestone columns framed against a crisp blue sky.',
  },
  {
    id: 'village',
    name: 'Arctic Night',
    region: 'Lofoten',
    src: '/photos/FA2DA4C7-D3EB-4A8B-A773-61085EBF56D9_1_102_o.jpeg',
    objectPosition: '50% 68%',
    alt: 'Moody Nordic wooden houses glowing warmly under moonlight and silver clouds at night.',
  },
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
