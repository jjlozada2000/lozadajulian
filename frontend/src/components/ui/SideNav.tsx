import React, { useState, useEffect } from 'react'
import { NAV_SECTIONS } from '../../config/siteConfig'
import '../../styles/SideNav.css'

export default function SideNav() {
  const [active, setActive] = useState('')

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id)
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [])

  return (
    <nav className="sidenav" aria-label="Section navigation">
      {NAV_SECTIONS.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`sidenav__dot ${active === id ? 'sidenav__dot--active' : ''}`}
          aria-label={label}
          title={label}
        >
          <span className="sidenav__dot-inner" />
          <span className="sidenav__label">{label}</span>
        </a>
      ))}
    </nav>
  )
}
