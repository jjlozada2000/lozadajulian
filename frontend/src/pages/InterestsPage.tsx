import React from 'react'
import { navigate } from '../App'
import '../styles/InterestsPage.css'

interface Interest {
  icon: string
  label: string
  secret?: boolean        // marks the photography tile
  secretHint?: string     // tooltip text on hover
  onClick?: () => void
}

// ── Your interests — edit freely ──────────────────────────────────────────────
// 👉 Uncomment the ones that fit, add your own, or swap icons
const buildInterests = (): Interest[] => [
  {
    icon: '📷',
    label: 'Photography',
    secret: true,
    secretHint: 'click to see the photos',
    onClick: () => navigate('/photography'),
  },

  // Add yours below — just uncomment or copy the pattern:
  // { icon: '💻', label: 'Building things' },
  // { icon: '☕', label: 'Coffee' },
  // { icon: '🌊', label: 'Beach / Ocean' },
  // { icon: '🎮', label: 'Gaming' },
  // { icon: '🎵', label: 'Music' },
  // { icon: '📚', label: 'Reading' },
  // { icon: '🏋️', label: 'Fitness' },
  // { icon: '✈️', label: 'Travel' },
  // { icon: '🎨', label: 'Design' },
  // { icon: '🍜', label: 'Food' },
]

// ── Tile ──────────────────────────────────────────────────────────────────────
function InterestTile({ item }: { item: Interest }) {
  const [hovered, setHovered] = React.useState(false)

  if (item.secret) {
    return (
      <div
        className="interest-tile interest-tile--secret"
        onClick={item.onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && item.onClick?.()}
        aria-label={`${item.label} — ${item.secretHint}`}
      >
        <span className="interest-tile__icon" aria-hidden="true">
          {item.icon}
        </span>
        <span className="interest-tile__label">
          {hovered && item.secretHint ? item.secretHint : item.label}
        </span>
        {hovered && (
          <span className="interest-tile__secret-arrow" aria-hidden="true">→</span>
        )}
      </div>
    )
  }

  return (
    <div className="interest-tile">
      <span className="interest-tile__icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="interest-tile__label">{item.label}</span>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InterestsPage() {
  const interests = buildInterests()
  const hasInterests = interests.length > 0
  const PLACEHOLDER_COUNT = 6

  return (
    <div id="interests" className="ocean__section">
      <div className="ocean__section-divider" />

      <h2 className="interests__heading">// interests</h2>
      <p className="interests__subtext">Things that keep me going.</p>

      <div className="interests__grid">
        {hasInterests
          ? interests.map((item) => (
              <InterestTile key={item.label} item={item} />
            ))
          : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
              <div key={i} className="interest-tile">
                <span className="interest-tile__placeholder">
                  add to interests array
                </span>
              </div>
            ))}
      </div>
    </div>
  )
}