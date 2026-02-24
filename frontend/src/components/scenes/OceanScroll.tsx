import React, { useMemo } from 'react'
import { useScrollDepth } from '../../hooks/useScrollDepth'
import { OCEAN_SECTIONS } from '../../config/siteConfig'
import { PixelFish } from '../pixel/PixelArt'
import '../../styles/OceanScroll.css'

// ── Color lerp helper ─────────────────────────────────────────────────────────
function lerpColor(a: string, b: string, t: number): string {
  const parse = (c: string) => [
    parseInt(c.slice(1, 3), 16),
    parseInt(c.slice(3, 5), 16),
    parseInt(c.slice(5, 7), 16),
  ]
  const [ar, ag, ab] = parse(a)
  const [br, bg, bb] = parse(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `rgb(${r},${g},${bl})`
}

// ── Sunlight rays near the surface ───────────────────────────────────────────
function SunRays({ opacity }: { opacity: number }) {
  return (
    <div className="ocean__sun-rays" style={{ opacity }} aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <div
          key={i}
          className="ocean__ray"
          style={{
            left: `${8 + i * 13}%`,
            animationDelay: `${i * 0.35}s`,
            height: `${120 + i * 30}px`,
          }}
        />
      ))}
    </div>
  )
}

// ── Slowly swimming ambient fish ──────────────────────────────────────────────
function AmbientFish({ depth }: { depth: number }) {
  const fishData = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: `${10 + ((i * 13) % 80)}%`,
        y: `${15 + ((i * 17) % 70)}%`,
        color: ['#fbbf24', '#f472b6', '#4ade80', '#60a5fa'][i % 4],
        size: 2 + (i % 2),
        delay: i * 0.4,
      })),
    []
  )

  return (
    <div
      className="ocean__fish-layer"
      style={{ opacity: Math.min(depth * 3, 0.7) }}
      aria-hidden="true"
    >
      {fishData.map((fish) => (
        <div
          key={fish.id}
          className="ocean__fish"
          style={{ left: fish.x, top: fish.y, animationDelay: `${fish.delay}s` }}
        >
          <svg
            width={fish.size * 20}
            height={fish.size * 14}
            viewBox="0 0 20 14"
            style={{ imageRendering: 'pixelated' }}
          >
            <PixelFish x={0} y={0} pixelSize={fish.size} color={fish.color} />
          </svg>
        </div>
      ))}
    </div>
  )
}

// ── Bioluminescent particles in the deep ─────────────────────────────────────
function DeepParticles({ opacity }: { opacity: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: `${(i * 5.3) % 100}%`,
        y: `${(i * 7.1) % 100}%`,
        color: ['#4ade80', '#60a5fa', '#f0abfc', '#34d399'][i % 4],
        delay: (i * 0.15) % 3,
        size: 2 + (i % 3),
      })),
    []
  )

  return (
    <div
      className="ocean__deep-particles"
      style={{ opacity }}
      aria-hidden="true"
    >
      {particles.map((p) => (
        <div
          key={p.id}
          className="ocean__particle"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 6px 2px ${p.color}`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

// ── Main wrapper ──────────────────────────────────────────────────────────────
interface OceanScrollProps {
  children: React.ReactNode
}

export default function OceanScroll({ children }: OceanScrollProps) {
  const depth = useScrollDepth()

  const bgColor = useMemo(() => {
    const surface = '#0ea5e9'
    const sorted = [...OCEAN_SECTIONS].sort((a, b) => a.depth - b.depth)
    if (sorted.length === 0) return surface

    if (depth <= sorted[0].depth) {
      return lerpColor(surface, sorted[0].lightColor, depth / sorted[0].depth)
    }
    for (let i = 0; i < sorted.length - 1; i++) {
      if (depth <= sorted[i + 1].depth) {
        const t =
          (depth - sorted[i].depth) / (sorted[i + 1].depth - sorted[i].depth)
        return lerpColor(sorted[i].darkColor, sorted[i + 1].lightColor, t)
      }
    }
    return sorted[sorted.length - 1].darkColor
  }, [depth])

  const surfaceOpacity = Math.max(0, 1 - depth * 5)
  const deepOpacity = Math.max(0, (depth - 0.6) * 3)
  const fillHeight = Math.min(depth * 100, 100)

  return (
    <div className="ocean" style={{ background: bgColor }}>
      <SunRays opacity={surfaceOpacity} />
      <AmbientFish depth={depth} />
      <DeepParticles opacity={deepOpacity} />

      {/* Depth meter */}
      <div className="ocean__depth-meter" aria-hidden="true">
        <div
          className="ocean__depth-fill"
          style={{ height: `${fillHeight * 2}px` }}
        />
        <span className="ocean__depth-label">
          {Math.round(depth * 11000)}m
        </span>
      </div>

      <div className="ocean__content">{children}</div>
    </div>
  )
}
