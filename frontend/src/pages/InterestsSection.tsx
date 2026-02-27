import React from 'react'
import { navigate } from '../App'
import '../styles/InterestsSection.css'

interface Interest {
  label: string
  description?: string
  isSecret?: boolean
  onClick?: () => void
}

const INTERESTS: Interest[] = [
  {
    label: 'Photography',
    description: 'Film & digital',
    isSecret: true,
    onClick: () => navigate('/photography'),
  },
  // Uncomment and fill in yours:
  // { label: 'Coffee',        description: 'Always brewing' },
  // { label: 'Ocean',         description: 'Salt & surf' },
  // { label: 'Gaming',        description: 'Competitive & casual' },
  // { label: 'Music',         description: 'All genres' },
  // { label: 'Reading',       description: 'Non-fiction mostly' },
  // { label: 'Fitness',       description: 'Gym & outdoor' },
  // { label: 'Travel',        description: 'Always planning' },
]

function InterestItem({ item }: { item: Interest }) {
  return (
    <div
      className={`interest-item ${item.isSecret ? 'interest-item--secret' : ''}`}
      onClick={item.onClick}
      role={item.onClick ? 'link' : undefined}
      tabIndex={item.onClick ? 0 : undefined}
      onKeyDown={(e) => e.key === 'Enter' && item.onClick?.()}
    >
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
            : <p style={{ fontFamily: 'var(--f-mono)', fontSize: 12, color: 'var(--c-ink-faint)' }}>
                Add your interests to InterestsSection.tsx
              </p>
          }
        </div>
      </div>
    </section>
  )
}