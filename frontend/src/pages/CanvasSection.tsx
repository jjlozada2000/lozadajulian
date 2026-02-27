import React, { useState, useEffect, useCallback, useRef } from 'react'
import '../styles/CanvasSection.css'

const COLS = 100
const ROWS = 50

const PALETTE = [
  '#f5f2ed', '#d9c4aa', '#b8937a', '#a89878',
  '#666655', '#2e2820', '#fdf8f4', '#c4b9a8',
  '#8c7f6e', '#4a4438', '#e8d5be', '#9e8b74',
]

type PixelMap = Record<string, string>

export default function CanvasSection() {
  const [pixels, setPixels] = useState<PixelMap>({})
  const [selected, setSelected] = useState(PALETTE[2])
  const [name, setName] = useState('')
  const [painting, setPainting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const pending = useRef<Set<string>>(new Set())

  useEffect(() => {
    fetch('/api/canvas')
      .then(r => r.json())
      .then((data: { x: number; y: number; color: string }[]) => {
        const map: PixelMap = {}
        data.forEach(p => { map[`${p.x},${p.y}`] = p.color })
        setPixels(map)
        setTotal(data.length)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const paint = useCallback(async (x: number, y: number) => {
    const key = `${x},${y}`
    setPixels(prev => ({ ...prev, [key]: selected }))
    if (pending.current.has(key)) return
    pending.current.add(key)
    try {
      await fetch('/api/canvas/pixel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y, color: selected, authorName: name || 'anonymous' }),
      })
      setTotal(n => n + 1)
    } finally {
      pending.current.delete(key)
    }
  }, [selected, name])

  return (
    <section id="canvas" className="canvas-section">
      <div className="canvas-section__inner">
        <div className="reveal">
          <span className="section-label">Guest Canvas</span>
          <h2 className="section-heading">Leave your <em>mark</em></h2>
          <p className="canvas-section__sub">
            Pick a color, paint a pixel. Everyone who visits can contribute.
            Heavily inspired by the community project done by 'r/place'.
          </p>
        </div>

        <div className="reveal reveal-delay-1">
          <div className="canvas-section__controls">
            <input
              type="text"
              className="canvas-section__name"
              placeholder="Your name (optional)"
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={24}
            />
            <div className="canvas-section__palette">
              {PALETTE.map(color => (
                <button
                  key={color}
                  className={`canvas-section__swatch ${color === selected ? 'canvas-section__swatch--active' : ''}`}
                  style={{ background: color }}
                  onClick={() => setSelected(color)}
                  title={color}
                />
              ))}
            </div>
          </div>

          {loading ? (
            <p className="canvas-section__loading">Loading canvas...</p>
          ) : (
            <div className="canvas-section__grid-wrap">
              <div
                className="canvas-section__grid"
                style={{ gridTemplateColumns: `repeat(${COLS}, 8px)` }}
                onMouseDown={() => setPainting(true)}
                onMouseUp={() => setPainting(false)}
                onMouseLeave={() => setPainting(false)}
              >
                {Array.from({ length: ROWS }, (_, y) =>
                  Array.from({ length: COLS }, (_, x) => {
                    const key = `${x},${y}`
                    return (
                      <div
                        key={key}
                        className="canvas-section__pixel"
                        style={pixels[key] ? { background: pixels[key] } : undefined}
                        onClick={() => paint(x, y)}
                        onMouseEnter={() => painting && paint(x, y)}
                      />
                    )
                  })
                )}
              </div>
            </div>
          )}

          <p className="canvas-section__count">{total} pixels placed</p>
        </div>
      </div>
    </section>
  )
}
