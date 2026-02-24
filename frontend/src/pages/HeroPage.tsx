import React from 'react'
import '../styles/HeroPage.css'

// ============================================================
// Edit ticker items freely — these scroll across the bottom
// ============================================================
const TICKER_ITEMS: string[] = [
  'Full Stack Developer',
  'USC Trojan',
  'Los Angeles',
  'Java + React',
  'Film Photography',
  'Coffee',
  'Builder',
  'Ocean Lover',
  'Open to Opportunities',
  'Always Learning',
]

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="hero__ticker" aria-hidden="true">
      <div className="hero__ticker-track">
        {doubled.map((item, i) => (
          <span key={i} className="hero__ticker-item">
            {item}
            <span className="hero__ticker-sep">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function HeroPage() {
  return (
    <section className="hero">
      <nav className="hero__nav">
        <span className="hero__nav-brand">JL</span>
        <ul className="hero__nav-links">
          {['Projects', 'About', 'Interests', 'Contact'].map((link) => (
            <li key={link}>
              <a href={`#${link.toLowerCase()}`} className="hero__nav-link">
                {link}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hero__body">
        <p className="hero__eyebrow">Portfolio</p>
        <h1 className="hero__name">
          Julian<br /><em>Lozada</em>
        </h1>
        <p className="hero__tagline">Full Stack Developer — Los Angeles</p>
      </div>

      <Ticker />
    </section>
  )
}