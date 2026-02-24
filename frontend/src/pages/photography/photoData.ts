// ============================================================
// 📷  PHOTO DATA  — edit this file to add / remove photos
// ============================================================
//
// HOW TO ADD A PHOTO:
// 1. Drop the image file into /public/photos/
// 2. Copy one of the entries below and fill in your details
// 3. Save — the gallery updates automatically
//
// src: path relative to /public  (e.g. "/photos/myshot.jpg")
//      OR a full URL              (e.g. "https://...")
// ============================================================

export interface Photo {
  id: number
  src: string
  title: string
  camera: string
  film: string        // film stock, or "Digital" if digital
  location: string
  date: string        // free text e.g. "March 2024" or "Summer '23"
  description: string
  aspect?: 'portrait' | 'landscape' | 'square' // controls grid sizing
}

export const PHOTOS: Photo[] = [
  // ── Replace these placeholders with your real shots ──────────────────────
  {
    id: 1,
    src: '/photos/placeholder-1.jpg',
    title: 'Golden Hour',
    camera: 'Canon AE-1',
    film: 'Kodak Portra 400',
    location: 'Santa Monica, CA',
    date: 'January 2025',
    description: 'Late afternoon light bleeding across the pier.',
    aspect: 'landscape',
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
    aspect: 'portrait',
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
    aspect: 'square',
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
    aspect: 'landscape',
  },
  {
    id: 5,
    src: '/photos/placeholder-5.jpg',
    title: 'Morning Fog',
    camera: 'Pentax K1000',
    film: 'Kodak ColorPlus 200',
    location: 'Pacific Coast Highway',
    date: 'May 2025',
    description: 'Fog rolling in off the Pacific just after sunrise.',
    aspect: 'landscape',
  },
  {
    id: 6,
    src: '/photos/placeholder-6.jpg',
    title: 'Corner Store',
    camera: 'Olympus Stylus Epic',
    film: 'Cinestill 800T',
    location: 'Silver Lake, CA',
    date: 'June 2025',
    description: 'Tungsten warmth spilling out onto the sidewalk.',
    aspect: 'portrait',
  },
]