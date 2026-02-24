import React, { useState } from 'react'
import { AIRPLANE_FLAGS, AIRPLANE_DURATION_MS } from '../../config/siteConfig'

interface PlaneInstance {
  id: number
  flagIndex: number
  yOffset: number
  delay: number
  scale: number
  flipped: boolean
}

function buildPlanes(): PlaneInstance[] {
  return AIRPLANE_FLAGS.map((_, i) => ({
    id: i,
    flagIndex: i,
    yOffset: 60 + (i % 4) * 40,
    delay: i * (AIRPLANE_DURATION_MS / AIRPLANE_FLAGS.length),
    scale: 0.75 + (i % 3) * 0.15,
    flipped: i % 2 === 0,
  }))
}

function Airplane({ text, scale = 1, flipped = false }: { text: string; scale?: number; flipped?: boolean }) {
  const flagW = Math.min(text.length * 7 + 16, 180)
  const ropeLen = 36

  return (
    <g
      transform={`scale(${flipped ? -scale : scale}, ${scale})`}
      style={{ transformOrigin: '50px 18px' }}
    >
      {/* Fuselage */}
      <ellipse cx="50" cy="18" rx="32" ry="9"  fill="#e2e8f0" />
      <ellipse cx="80" cy="18" rx="6"  ry="6"  fill="#e2e8f0" />
      {/* Tail fin */}
      <polygon points="18,18 10,6 22,10"        fill="#cbd5e1" />
      {/* Wing */}
      <polygon points="44,20 64,20 70,32 38,32"  fill="#cbd5e1" />
      {/* Engine */}
      <ellipse cx="58" cy="30" rx="6" ry="3"    fill="#94a3b8" />
      {/* Windows */}
      <rect x="52" y="13" width="6" height="5" rx="1.5" fill="#7dd3fc" />
      <rect x="62" y="13" width="6" height="5" rx="1.5" fill="#7dd3fc" />
      <rect x="72" y="14" width="5" height="4" rx="1.5" fill="#7dd3fc" />

      {/* Rope */}
      <line
        x1={flipped ? 82 : 18}
        y1="18"
        x2={flipped ? 82 + ropeLen : 18 - ropeLen}
        y2="20"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeDasharray="4 2"
      />

      {/* Banner */}
      <g transform={`translate(${flipped ? 82 + ropeLen : 18 - ropeLen - flagW}, 10)`}>
        <rect x="0" y="0" width={flagW} height={20} fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" rx="2" />
        <text
          x={flagW / 2}
          y={14}
          textAnchor="middle"
          fontSize="11"
          fontFamily="'DM Mono', monospace"
          fontWeight="500"
          fill="#92400e"
        >
          {text}
        </text>
      </g>
    </g>
  )
}

export default function AirplaneLayer({ skyHeight = 320 }: { skyHeight?: number }) {
  const [planes] = useState<PlaneInstance[]>(buildPlanes)

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: skyHeight,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <style>{`
        @keyframes fly-ltr { from{transform:translateX(-320px)} to{transform:translateX(calc(100vw + 320px))} }
        @keyframes fly-rtl { from{transform:translateX(calc(100vw + 320px))} to{transform:translateX(-320px)} }
      `}</style>

      {planes.map((plane) => (
        <div
          key={plane.id}
          style={{
            position: 'absolute',
            top: plane.yOffset,
            left: 0,
            width: '100%',
            animation: `${plane.flipped ? 'fly-rtl' : 'fly-ltr'} ${AIRPLANE_DURATION_MS}ms linear ${plane.delay}ms infinite`,
            willChange: 'transform',
          }}
        >
          <svg width="300" height="60" viewBox="0 0 300 60" style={{ overflow: 'visible' }}>
            <Airplane
              text={AIRPLANE_FLAGS[plane.flagIndex]}
              scale={plane.scale}
              flipped={plane.flipped}
            />
          </svg>
        </div>
      ))}
    </div>
  )
}
