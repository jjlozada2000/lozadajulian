import React from 'react'
import { CLOUD_WORDS } from '../../config/siteConfig'

function CloudPuff({ text, x, y }: { text: string; x: number; y: number }) {
  const w = Math.max(text.length * 14 + 40, 80)
  const h = 52
  const id = `cg-${text}`

  return (
    <g style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.12))' }}>
      <defs>
        <radialGradient id={id} cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e0f2fe" />
        </radialGradient>
      </defs>
      <ellipse cx={x + w * 0.5} cy={y + h * 0.65} rx={w * 0.48} ry={h * 0.32} fill={`url(#${id})`} />
      <ellipse cx={x + w * 0.28} cy={y + h * 0.45} rx={w * 0.26} ry={h * 0.3}  fill={`url(#${id})`} />
      <ellipse cx={x + w * 0.55} cy={y + h * 0.35} rx={w * 0.28} ry={h * 0.32} fill={`url(#${id})`} />
      <ellipse cx={x + w * 0.78} cy={y + h * 0.48} rx={w * 0.22} ry={h * 0.26} fill={`url(#${id})`} />
      <text
        x={x + w / 2}
        y={y + h * 0.68}
        textAnchor="middle"
        fontSize={19}
        fontFamily="'Press Start 2P', monospace"
        fill="#0c4a6e"
        letterSpacing="1"
      >
        {text}
      </text>
    </g>
  )
}

export default function CloudNameLayer({
  svgWidth = 1440,
  skyHeight = 320,
}: {
  svgWidth?: number
  skyHeight?: number
}) {
  const gap = svgWidth / (CLOUD_WORDS.length + 1)

  return (
    <>
      <style>{`
        @keyframes cloud-drift     { 0%,100%{transform:translateX(0)}  50%{transform:translateX(12px)} }
        @keyframes cloud-drift-alt { 0%,100%{transform:translateX(0)}  50%{transform:translateX(-10px)} }
        .cloud-d  { animation: cloud-drift     8s ease-in-out infinite; }
        .cloud-da { animation: cloud-drift-alt 10s ease-in-out infinite; }
      `}</style>
      <svg
        aria-label={CLOUD_WORDS.join(' ')}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: skyHeight,
          pointerEvents: 'none',
          zIndex: 3,
          overflow: 'visible',
        }}
        viewBox={`0 0 ${svgWidth} ${skyHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {CLOUD_WORDS.map((word, i) => {
          const cx = gap * (i + 1)
          const cy = 30 + (i % 2) * 30
          const cloudW = Math.max(word.length * 14 + 40, 80)
          return (
            <g
              key={word}
              className={i % 2 === 0 ? 'cloud-d' : 'cloud-da'}
              style={{ transformOrigin: `${cx}px ${cy + 26}px` }}
            >
              <CloudPuff text={word} x={cx - cloudW / 2} y={cy} />
            </g>
          )
        })}
      </svg>
    </>
  )
}
