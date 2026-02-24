import React from 'react'

interface BeachSceneProps {
  width?: number
  height?: number
}

export default function BeachScene({ width = 1440, height = 500 }: BeachSceneProps) {
  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMax slice"
      style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 1 }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="60%" stopColor="#bae6fd" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
        <linearGradient id="ocean-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="sand-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width={width} height={height * 0.65} fill="url(#sky-grad)" />

      {/* Distant ocean horizon */}
      <rect x="0" y={height * 0.55} width={width} height={height * 0.15} fill="url(#ocean-grad)" opacity="0.7" />

      {/* Santa Monica buildings */}
      <BuildingRow width={width} baseY={height * 0.38} />

      {/* Palm trees */}
      <PalmTree x={80}           baseY={height * 0.6}  treeHeight={110} />
      <PalmTree x={210}          baseY={height * 0.62} treeHeight={90} />
      <PalmTree x={width - 100}  baseY={height * 0.6}  treeHeight={105} />
      <PalmTree x={width - 230}  baseY={height * 0.62} treeHeight={85} />

      {/* Ferris wheel (Santa Monica Pier icon) */}
      <FerrisWheel cx={width * 0.72} cy={height * 0.36} r={38} />

      {/* Beach sand */}
      <path
        d={`M0,${height * 0.72} Q${width * 0.25},${height * 0.68} ${width * 0.5},${height * 0.72} Q${width * 0.75},${height * 0.76} ${width},${height * 0.72} L${width},${height} L0,${height} Z`}
        fill="url(#sand-grad)"
      />
      {/* Wet sand highlight */}
      <path
        d={`M0,${height * 0.72} Q${width * 0.25},${height * 0.68} ${width * 0.5},${height * 0.72} Q${width * 0.75},${height * 0.76} ${width},${height * 0.72} L${width},${height * 0.76} Q${width * 0.75},${height * 0.8} ${width * 0.5},${height * 0.76} Q${width * 0.25},${height * 0.72} 0,${height * 0.76} Z`}
        fill="#fcd34d"
        opacity="0.4"
      />

      {/* Ocean waves */}
      <OceanWaves width={width} y={height * 0.68} opacity={0.9} />
      <OceanWaves width={width} y={height * 0.65} opacity={0.5} offset={width * 0.2} />
    </svg>
  )
}

// ── Building row ──────────────────────────────────────────────────────────────
function BuildingRow({ width, baseY }: { width: number; baseY: number }) {
  const buildings = [
    { x: 0,           w: 80,  h: 140, color: '#fef3c7', windows: '#7dd3fc',  roof: '#d97706' },
    { x: 75,          w: 60,  h: 100, color: '#fde68a', windows: '#bae6fd',  roof: '#b45309' },
    { x: 130,         w: 100, h: 160, color: '#fef9c3', windows: '#93c5fd',  roof: '#d97706' },
    { x: 225,         w: 55,  h: 80,  color: '#fde68a', windows: '#7dd3fc',  roof: '#ef4444' },
    { x: width * 0.5, w: 90,  h: 130, color: '#fef3c7', windows: '#bae6fd',  roof: '#b45309' },
    { x: width * 0.6, w: 70,  h: 95,  color: '#fde68a', windows: '#93c5fd',  roof: '#d97706' },
    { x: width - 200, w: 80,  h: 110, color: '#fef9c3', windows: '#7dd3fc',  roof: '#ef4444' },
    { x: width - 120, w: 55,  h: 85,  color: '#fde68a', windows: '#bae6fd',  roof: '#b45309' },
    { x: width - 70,  w: 70,  h: 100, color: '#fef3c7', windows: '#93c5fd',  roof: '#d97706' },
  ]
  return (
    <g opacity="0.85">
      {buildings.map((b, i) => (
        <Building key={i} {...b} baseY={baseY} />
      ))}
    </g>
  )
}

function Building({
  x, baseY, w, h, color, windows, roof,
}: {
  x: number; baseY: number; w: number; h: number
  color: string; windows: string; roof: string
}) {
  const top = baseY - h
  const px = 4
  const sx = Math.round(x / px) * px
  const sh = Math.round(h / px) * px
  const sw = Math.round(w / px) * px
  const st = Math.round(top / px) * px
  const winW = Math.max(sw * 0.18, 6)
  const winH = px * 2
  const cols = Math.max(Math.floor(sw / (winW + px * 2)), 1)
  const rows = Math.max(Math.floor(sh / (winH + px * 4)) - 1, 0)

  return (
    <g>
      <rect x={sx} y={st} width={sw} height={sh} fill={color} />
      <rect x={sx} y={st} width={sw} height={px * 3} fill={roof} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={sx + (c + 1) * (sw / (cols + 1)) - winW / 2}
            y={st + px * 6 + r * (winH + px * 4)}
            width={winW}
            height={winH}
            fill={windows}
            opacity="0.8"
          />
        ))
      )}
    </g>
  )
}

// ── Palm tree ─────────────────────────────────────────────────────────────────
function PalmTree({ x, baseY, treeHeight }: { x: number; baseY: number; treeHeight: number }) {
  return (
    <g>
      <path
        d={`M${x},${baseY} Q${x + 12},${baseY - treeHeight * 0.5} ${x + 6},${baseY - treeHeight}`}
        stroke="#92400e"
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: 5 }, (_, i) => {
        const t = (i + 1) / 6
        return (
          <rect
            key={i}
            x={x + 12 * t - 4}
            y={baseY - treeHeight * t}
            width={8}
            height={3}
            fill="#78350f"
            opacity="0.4"
          />
        )
      })}
      {[-60, -30, 0, 30, 60, 90, 120, 150].map((angle, i) => {
        const rad = (angle * Math.PI) / 180
        const tipX = x + 6 + Math.cos(rad) * 45
        const tipY = baseY - treeHeight + Math.sin(rad) * 35
        return (
          <path
            key={i}
            d={`M${x + 6},${baseY - treeHeight} Q${(x + 6 + tipX) / 2 + Math.sin(rad) * 10},${(baseY - treeHeight + tipY) / 2 - 8} ${tipX},${tipY}`}
            stroke={i % 2 === 0 ? '#4ade80' : '#166534'}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
          />
        )
      })}
    </g>
  )
}

// ── Ferris wheel ──────────────────────────────────────────────────────────────
function FerrisWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <line x1={cx - r * 0.6} y1={cy + r} x2={cx} y2={cy + r * 1.8} stroke="#92400e" strokeWidth="4" />
      <line x1={cx + r * 0.6} y1={cy + r} x2={cx} y2={cy + r * 1.8} stroke="#92400e" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r}       fill="none" stroke="#d97706" strokeWidth="4" />
      <circle cx={cx} cy={cy} r={r * 0.3} fill="none" stroke="#d97706" strokeWidth="3" />
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const sx = cx + Math.cos(angle) * r * 0.3
        const sy = cy + Math.sin(angle) * r * 0.3
        const ex = cx + Math.cos(angle) * r
        const ey = cy + Math.sin(angle) * r
        return (
          <g key={i}>
            <line x1={sx} y1={sy} x2={ex} y2={ey} stroke="#d97706" strokeWidth="2" opacity="0.7" />
            <rect x={ex - 6} y={ey - 5} width={12} height={10} rx="2" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={6} fill="#d97706" />
    </g>
  )
}

// ── Ocean wave lines ──────────────────────────────────────────────────────────
function OceanWaves({
  width, y, opacity = 1, offset = 0,
}: {
  width: number; y: number; opacity?: number; offset?: number
}) {
  const waveW = 120
  const waveH = 8
  const count = Math.ceil(width / waveW) + 2
  return (
    <g opacity={opacity}>
      {Array.from({ length: count }, (_, i) => {
        const wx = offset + i * waveW - waveW
        return (
          <path
            key={i}
            d={`M${wx},${y} Q${wx + waveW * 0.25},${y - waveH} ${wx + waveW * 0.5},${y} Q${wx + waveW * 0.75},${y + waveH} ${wx + waveW},${y}`}
            fill="none"
            stroke="#bae6fd"
            strokeWidth="3"
          />
        )
      })}
    </g>
  )
}
