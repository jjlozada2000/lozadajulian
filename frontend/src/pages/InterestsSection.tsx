import React, { useRef, useEffect, useState, useCallback } from 'react'
import { navigate } from '../App'
import '../styles/InterestsSection.css'

interface Interest {
  id: string
  label: string
  sub?: string
  onClick?: () => void
}

const INTERESTS: Interest[] = [
  {
    id: 'photography',
    label: 'Photography',
    sub: 'film & digital',
    onClick: () => navigate('/photography'),
  },
  {
    id: 'coffee',
    label: 'Coffee',
    sub: 'my favorite work space',
  },
  {
    id: 'gaming',
    label: 'Gaming',
    sub: 'playing the same game for 10+ years',
  },
  {
    id: 'bowling',
    label: 'Bowling',
    sub: 'cannot break over 200 still',
  }
  // { id: 'coffee',  label: 'Coffee',  sub: 'always brewing' },
  // { id: 'ocean',   label: 'Ocean',   sub: 'salt & surf' },
  // { id: 'gaming',  label: 'Gaming',  sub: 'competitive & casual' },
]

// Many copies so the user never reaches an edge during normal use
const REPEAT = 20
const REPEATED = Array.from({ length: REPEAT }, () => INTERESTS).flat()
const COUNT = INTERESTS.length

export default function InterestsSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [styles, setStyles] = useState<Array<{
    opacity: number
    scale: number
    translateY: number
    isActive: boolean
  }>>([])

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const trackCenterX = track.scrollLeft + track.clientWidth / 2
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.interest-item'))

    setStyles(cards.map((card) => {
      const cardCenterX = card.offsetLeft + card.offsetWidth / 2
      const dist = cardCenterX - trackCenterX
      const halfSpan = card.offsetWidth * 0.9
      const t = Math.min(Math.abs(dist) / halfSpan, 1)

      return {
        opacity: 1 - t * 0.78,
        scale: 1 - t * 0.32,
        translateY: t * 10,
        isActive: Math.abs(dist) < card.offsetWidth * 0.45,
      }
    }))
  }, [])

  // On mount, jump to the middle of the repeated list
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.querySelectorAll<HTMLElement>('.interest-item'))
    // Start at the midpoint copy so the user has ~10 copies in each direction
    const midIndex = Math.floor(REPEAT / 2) * COUNT
    const midCard = cards[midIndex]
    if (!midCard) return
    track.scrollLeft = midCard.offsetLeft - track.clientWidth / 2 + midCard.offsetWidth / 2
    measure()
  }, [measure])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('resize', measure)
    return () => {
      track.removeEventListener('scroll', measure)
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <section id="interests" className="interests">
      <div className="interests__header reveal">
        <span className="section-label">Interests</span>
        <p className="interests__subtitle">or new obsessions</p>
      </div>

      <div className="interests__track-wrap">
        <div className="interests__track" ref={trackRef}>
          {REPEATED.map((item, i) => {
            const s = styles[i] ?? { opacity: 0.22, scale: 0.68, translateY: 10, isActive: false }

            return (
              <div
                key={`${item.id}-${i}`}
                className={`interest-item ${s.isActive ? 'interest-item--active' : ''} ${item.onClick ? 'interest-item--link' : ''}`}
                onClick={s.isActive ? item.onClick : undefined}
                tabIndex={s.isActive ? 0 : -1}
                onKeyDown={(e) => e.key === 'Enter' && s.isActive && item.onClick?.()}
                style={{
                  opacity: s.opacity,
                  transform: `scale(${s.scale}) translateY(${s.translateY}px)`,
                  transition: 'none',
                }}
              >
                <span className="interest-item__label">{item.label}</span>
                {item.sub && (
                  <span
                    className="interest-item__sub"
                    style={{
                      opacity: s.isActive ? 1 : 0,
                      transform: `translateY(${s.isActive ? 0 : 4}px)`,
                      transition: 'opacity 0.2s ease, transform 0.2s ease',
                    }}
                  >
                    {item.sub}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <div className="interests__fade interests__fade--left" />
        <div className="interests__fade interests__fade--right" />
      </div>
    </section>
  )
}