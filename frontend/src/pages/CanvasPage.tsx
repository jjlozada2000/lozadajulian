import React, { useState, useEffect, useCallback, useRef } from 'react'
import '../styles/CanvasPage.css'

// ── Canvas dimensions ─────────────────────────────────────────────────────────
const COLS = 100
const ROWS = 50

// ── Palette ───────────────────────────────────────────────────────────────────
// 👉 Add or remove colors freely — keep them as valid 6-digit hex strings
const PALETTE = [
  '#f8fafc', // white
  '#94a3b8', // slate
  '#0f172a', // near-black
  '#ef4444', // red
  '#f97316', // orange
  '#fbbf24', // yellow
  '#4ade80', // green
  '#34d399', // teal
  '#38bdf8', // sky
  '#60a5fa', // blue
  '#a78bfa', // violet
  '#f472b6', // pink
  '#f43f5e', // rose
  '#84cc16', // lime
  '#06b6d4', // cyan
  '#8b5cf6', // purple
]

type PixelMap = Record<string, string> // "x,y" → color

interface PixelResponse {
  x: number
  y: number
  color: string
  authorName?: string
}

export default function CanvasPage() {
  const [pixels, setPixels] = useState<PixelMap>({})
  const [selectedColor, setSelectedColor] = useState(PALETTE[9]) // start on blue
  const [authorName, setAuthorName] = useState('')
  const [isPainting, setIsPainting] = useState(false)
  const [status, setStatus] = useState('')
  const [totalPlaced, setTotalPlaced] = useState(0)
  const [loading, setLoading] = useState(true)
  const pendingRef = useRef<Set<string>>(new Set())

  // ── Load canvas on mount ────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/canvas')
      .then((r) => r.json())
      .then((data: PixelResponse[]) => {
        const map: PixelMap = {}
        data.forEach((p) => { map[`${p.x},${p.y}`] = p.color })
        setPixels(map)
        setTotalPlaced(data.length)
        setLoading(false)
      })
      .catch(() => {
        setStatus('Could not load canvas — is the backend running?')
        setLoading(false)
      })
  }, [])

  // ── Paint a pixel ───────────────────────────────────────────────────────────
  const paintPixel = useCallback(
    async (x: number, y: number) => {
      const key = `${x},${y}`

      // Optimistic UI update
      setPixels((prev) => ({ ...prev, [key]: selectedColor }))

      // Debounce: skip if already pending
      if (pendingRef.current.has(key)) return
      pendingRef.current.add(key)

      try {
        await fetch('/api/canvas/pixel', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            x,
            y,
            color: selectedColor,
            authorName: authorName.trim() || 'anonymous',
          }),
        })
        setTotalPlaced((n) => n + 1)
      } catch {
        setStatus('Failed to save pixel.')
      } finally {
        pendingRef.current.delete(key)
      }
    },
    [selectedColor, authorName]
  )

  const handlePixelClick = (x: number, y: number) => paintPixel(x, y)

  const handleMouseEnter = (x: number, y: number) => {
    if (isPainting) paintPixel(x, y)
  }

  return (
    <div id="canvas" className="ocean__section">
      <div className="ocean__section-divider" />

      <h2 className="canvas__heading">// guest_canvas</h2>
      <p className="canvas__subtext">
        Leave your mark in the abyss. Pick a color, click a pixel.
        Everyone who visits can paint here.
      </p>

      {/* ── Controls ── */}
      <div className="canvas__controls">
        <input
          type="text"
          className="canvas__name-input"
          placeholder="Your name (optional)"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          maxLength={24}
        />

        <div className="canvas__palette" role="group" aria-label="Color palette">
          {PALETTE.map((color) => (
            <button
              key={color}
              className={`canvas__palette-swatch ${
                color === selectedColor ? 'canvas__palette-swatch--active' : ''
              }`}
              style={{ background: color }}
              onClick={() => setSelectedColor(color)}
              aria-label={color}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      {loading ? (
        <div className="canvas__loading">loading canvas...</div>
      ) : (
        <div className="canvas__grid-wrapper">
          <div
            className="canvas__grid"
            style={{ gridTemplateColumns: `repeat(${COLS}, 10px)` }}
            onMouseDown={() => setIsPainting(true)}
            onMouseUp={() => setIsPainting(false)}
            onMouseLeave={() => setIsPainting(false)}
          >
            {Array.from({ length: ROWS }, (_, y) =>
              Array.from({ length: COLS }, (_, x) => {
                const key = `${x},${y}`
                const color = pixels[key]
                return (
                  <div
                    key={key}
                    className="canvas__pixel"
                    style={color ? { background: color } : undefined}
                    onClick={() => handlePixelClick(x, y)}
                    onMouseEnter={() => handleMouseEnter(x, y)}
                  />
                )
              })
            )}
          </div>
        </div>
      )}

      {status && <p className="canvas__status">{status}</p>}
      <p className="canvas__count">{totalPlaced} pixels placed by visitors</p>
    </div>
  )
}
