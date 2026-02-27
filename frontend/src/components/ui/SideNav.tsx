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
        ([entry]) => { if (entry.isIntersecting) setActive(id) },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  return (
    <nav className="sidenav" aria-label="Section navigation">
      {NAV_SECTIONS.map(({ id, label }, i) => {
        const isLeft = i % 2 === 0  // even = label left of dot, odd = label right
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
  )
}
