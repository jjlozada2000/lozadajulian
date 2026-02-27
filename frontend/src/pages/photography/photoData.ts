// ============================================================
// PHOTO DATA — edit this to add your photos
// ============================================================
// Drop images into /public/photos/ and update src paths below

export interface Photo {
  id: number
  src: string
  title: string
  camera: string
  film: string
  location: string
  date: string
  description: string
}

export const PHOTOS: Photo[] = [
  {
    id: 1,
    src: '/photos/placeholder-1.jpg',
    title: 'Golden Hour',
    camera: 'Canon AE-1',
    film: 'Kodak Portra 400',
    location: 'Santa Monica, CA',
    date: 'January 2025',
    description: 'Late afternoon light bleeding across the pier.',
  },
  {
    id: 2,
    src: '/photos/placeholder-2.jpg',
    title: 'Quiet Street',
    camera: 'Minolta X-700',
    film: 'Fujifilm Superia 200',
    location: 'Los Angeles, CA',
    date: 'February 2025',
    description: 'An empty street just before the city wakes up.',
  },
  {
    id: 3,
    src: '/photos/placeholder-3.jpg',
    title: 'Tide Pools',
    camera: 'Canon AE-1',
    film: 'Ilford HP5 Plus',
    location: 'Malibu, CA',
    date: 'March 2025',
    description: 'Black and white study of the rocky shoreline.',
  },
  {
    id: 4,
    src: '/photos/placeholder-4.jpg',
    title: 'City at Dusk',
    camera: 'Sony A7III',
    film: 'Digital',
    location: 'Downtown LA',
    date: 'April 2025',
    description: 'The skyline shifting from blue to amber.',
  },
]
