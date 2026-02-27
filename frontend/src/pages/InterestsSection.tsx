import React, { useState, useRef } from 'react'
import { navigate } from '../App'
import '../styles/InterestsSection.css'

interface Interest {
  label: string
  description?: string
  isSecret?: boolean
  onClick?: () => void
  // Filenames from /public/photos/ to randomly reveal on hover
  photos?: string[]
}

const INTERESTS: Interest[] = [
  {
    label: 'Photography',
    description: 'Film & digital',
    isSecret: true,
    onClick: () => navigate('/photography'),
    photos: [
      // Add your photo filenames here, e.g:
      // '/photos/shot-01.jpg',
      // '/photos/shot-02.jpg',
    ],
  },
  // Uncomment and fill in yours:
  // { label: 'Coffee',   description: 'Always brewing', photos: ['/photos/coffee-01.jpg'] },
  // { label: 'Ocean',    description: 'Salt & surf',    photos: ['/photos/ocean-01.jpg'] },
  // { label: 'Gaming',   description: 'Competitive & casual', photos: [] },
]

function pickRandom<T>(arr: T[]): T | null {
  if (!arr || arr.length === 0) return null
  return arr[Math.floor(Math.random() * arr.length)]
}

function InterestItem({ item }: { item: Interest }) {
  const [hovered, setHovered] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)

  const handleEnter = () => {
    setPhoto(pickRandom(item.photos ?? []))
    setHovered(true)
  }

  const handleLeave = () => {
    setHovered(false)
  }

  return (
    <div
      className={`interest-item ${item.isSecret ? 'interest-item--secret' : ''} ${hovered ? 'interest-item--hovered' : ''}`}
      onClick={item.onClick}
      role={item.onClick ? 'link' : undefined}
      tabIndex={item.onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && item.onClick?.()}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Photo layer — always behind, full tile */}
      <div className="interest-item__photo-wrap">
        {photo ? (
          <img src={photo} alt="" className="interest-item__photo" draggable={false} />
        ) : (
          <div className="interest-item__photo-fallback" />
        )}
      </div>

      {/* Text panel — slides right to uncover the photo */}
      <div className="interest-item__text">
        <span className="interest-item__label">
          {item.isSecret ? (
            <>
              <span className="interest-item__label-default">{item.label}</span>
              <span className="interest-item__label-hover">View photos →</span>
            </>
          ) : (
            item.label
          )}
        </span>
        {item.description && (
          <span className="interest-item__desc">{item.description}</span>
        )}
      </div>
    </div>
  )
}

export default function InterestsSection() {
  return (
    <section id="interests" className="interests">
      <div className="interests__inner">
        <div className="reveal">
          <span className="section-label">Interests</span>
          <h2 className="section-heading">Interests</h2>
          <p className="interests__subtitle">or new obsessions</p>
        </div>

        <div className="interests__grid reveal reveal-delay-1">
          {INTERESTS.length > 0
            ? INTERESTS.map((item) => (
                <InterestItem key={item.label} item={item} />
              ))
            : (
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-ink-faint)', padding: '24px' }}>
                Add your interests to InterestsSection.tsx
              </p>
            )
          }
        </div>
      </div>
    </section>
  )
}