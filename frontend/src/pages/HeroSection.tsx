import React from 'react'
import { SITE, TICKER_ITEMS } from '../config/siteConfig'
import '../styles/HeroSection.css'

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

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero__inner">

        {/* Top row — location + links */}
        <div className="hero__top">
          <span className="hero__location">{SITE.location}</span>
          <div className="hero__links">
            <a href={SITE.github} target="_blank" rel="noreferrer" className="hero__link">GitHub</a>
            <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="hero__link">LinkedIn</a>
          </div>
        </div>

        {/* Name */}
        <div className="hero__name-wrap">
          <h1 className="hero__name">
            <span className="hero__name-first">Julian</span>
            <span className="hero__name-last"><em>Lozada</em></span>
          </h1>
        </div>

        {/* Bottom row — role + scroll hint */}
        <div className="hero__bottom">
          <p className="hero__role">{SITE.role}</p>
          <div className="hero__scroll">
            <div className="hero__scroll-line" />
            <span className="hero__scroll-label">Scroll</span>
          </div>
        </div>

      </div>

      {/* Ticker strip */}
      <Ticker />
    </section>
  )
}
