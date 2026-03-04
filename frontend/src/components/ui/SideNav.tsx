import React, { useState, useEffect } from 'react'
import { NAV_SECTIONS } from '../../config/siteConfig'
import '../../styles/SideNav.css'

export default function SideNav() {
  const [active, setActive] = useState('')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNav = () => {
    setMobileOpen(false)
  }

  return (
    <>
      {/* ─ Desktop nav ─ */}
      <nav className="sidenav sidenav--desktop" aria-label="Section navigation">
        {NAV_SECTIONS.map(({ id, label }, i) => {
          const isLeft = i % 2 === 0
          return (
            <a
              key={id}
              href={`#${id}`}
              className={`sidenav__item ${active === id ? 'sidenav__item--active' : ''}`}
              aria-label={label}
            >
              {isLeft && <span className="sidenav__label sidenav__label--left">{label}</span>}
              <span className="sidenav__dot" />
              {!isLeft && <span className="sidenav__label sidenav__label--right">{label}</span>}
            </a>
          )
        })}
      </nav>

      {/* ─ Mobile nav ─ */}
      {mobileOpen && (
        <div className="sidenav-mobile__backdrop" onClick={() => setMobileOpen(false)} />
      )}

      <div className={`sidenav-mobile ${mobileOpen ? 'sidenav-mobile--open' : ''}`}>
        <button
          className="sidenav-mobile__trigger"
          onClick={() => setMobileOpen(prev => !prev)}
          aria-label="Toggle navigation"
        >
          <span className="sidenav-mobile__trigger-dot" />
        </button>

        <div className="sidenav-mobile__menu">
          {NAV_SECTIONS.map(({ id, label }, i) => (
            <a
              key={id}
              href={`#${id}`}
              className={`sidenav-mobile__link ${active === id ? 'sidenav-mobile__link--active' : ''}`}
              style={{ transitionDelay: mobileOpen ? `${i * 0.05}s` : '0s' }}
              onClick={handleNav}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}