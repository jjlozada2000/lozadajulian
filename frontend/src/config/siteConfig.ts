// ============================================================
// 🎨  SITE CONFIG  — edit everything in this file freely!
// ============================================================

export const SITE_CONFIG = {
  name: 'Julian Lozada',
  tagline: 'Full Stack Developer',
  email: 'julian@example.com', // ← your real email
}

// ✈️  Airplane banner flags
// Each plane carries one banner. Add, remove, or reorder freely.
export const AIRPLANE_FLAGS: string[] = [
  'Full Stack Dev 🛠️',
  'Coffee Enthusiast ☕',
  'USC Trojan ✌️',
  'Open to Opportunities 🚀',
  'Building Cool Things 🌊',
  'Java + React = 💙',
  "Let's Connect!",
]

// ⏱️  How long (ms) each plane takes to cross the full screen
export const AIRPLANE_DURATION_MS = 18000

// ☁️  Cloud words — one cloud puff per entry, spells your name
export const CLOUD_WORDS: string[] = ['Julian', 'Lozada']

// 🌊  Ocean depth sections
// depth: 0 = surface, 1 = deepest abyss
// creature: matches a key in SEA_CREATURES (PixelArt.tsx)
export const OCEAN_SECTIONS = [
  {
    id: 'projects',
    label: 'Projects',
    depth: 0.18,
    lightColor: '#38bdf8',
    darkColor: '#0ea5e9',
    creature: 'turtle',
  },
  {
    id: 'about',
    label: 'About Me',
    depth: 0.4,
    lightColor: '#0ea5e9',
    darkColor: '#0284c7',
    creature: 'jellyfish',
  },
  {
    id: 'interests',
    label: 'Interests',
    depth: 0.62,
    lightColor: '#0369a1',
    darkColor: '#075985',
    creature: 'shark',
  },
  {
    id: 'contact',
    label: 'Contact',
    depth: 0.82,
    lightColor: '#0c4a6e',
    darkColor: '#082f49',
    creature: 'anglerfish',
  },
  {
    id: 'canvas',
    label: 'Guest Canvas',
    depth: 1.0,
    lightColor: '#041728',
    darkColor: '#020d18',
    creature: 'squid',
  },
]
