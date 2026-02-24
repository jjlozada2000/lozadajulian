import React, { useState } from 'react'
import { PixelJulian } from '../components/pixel/PixelArt'
import '../styles/AboutPage.css'

// 👉 Drop your real photo into /public/photo.jpg and update the path below
const PHOTO_PATH = '/photo.jpg'

// 👉 Write your bio here
const BIO = `Hi! I'm Julian — a full stack developer based in Los Angeles.
I build things with Java, React, and a healthy appreciation for good coffee.
When I'm not coding you'll find me at the beach or hunting for the best
taco spots in the city.`

export default function AboutPage() {
  const [showPhoto, setShowPhoto] = useState(false)

  return (
    <div id="about" className="ocean__section">
      <div className="ocean__section-divider" />

      <h2 className="about__heading">// about_me</h2>

      <div className="about__layout">
        {/* ── Portrait ── */}
        <div className="about__portrait">
          <div className="about__portrait-frame">
            <div
              className={`about__portrait-face ${
                showPhoto ? 'about__portrait-face--photo' : 'about__portrait-face--pixel'
              }`}
            >
              {showPhoto ? (
                <img src={PHOTO_PATH} alt="Julian Lozada" />
              ) : (
                <svg
                  width="200"
                  height="200"
                  viewBox="0 0 200 200"
                  style={{ imageRendering: 'pixelated' }}
                  aria-label="Pixel art of Julian"
                >
                  <PixelJulian x={56} y={8} pixelSize={6} />
                </svg>
              )}
            </div>

            <button
              className="about__portrait-toggle"
              onClick={() => setShowPhoto((s) => !s)}
              aria-label={showPhoto ? 'Show pixel version' : 'Show real photo'}
              title={showPhoto ? 'Switch to pixel art' : 'Switch to photo'}
            >
              {showPhoto ? '🎮' : '📷'}
            </button>
            <span className="about__portrait-label">
              {showPhoto ? 'irl mode' : 'pixel mode'}
            </span>
          </div>
        </div>

        {/* ── Text ── */}
        <div className="about__text">
          <h3 className="about__name">Julian Lozada</h3>
          <span className="about__role">Full Stack Developer</span>

          {BIO ? (
            <p className="about__bio">{BIO}</p>
          ) : (
            <p className="about__bio-placeholder">
              {/* 👉 Set the BIO constant at the top of this file */}
              Add your bio in AboutPage.tsx → BIO
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
