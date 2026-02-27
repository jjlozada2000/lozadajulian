import React from 'react'
import { SITE } from '../config/siteConfig'
import '../styles/AboutSection.css'

// ============================================================
// Edit your bio here
// ============================================================
const BIO_LINES = [
  "Hi, I'm Julian, a software engineer based in Los Angeles.",
  "I enjoy programming in C++, Python, Java, React, and TypeScript. I enjoy the process of working in teams and building things people enjoy.",
  "If I'm not coding, you can find me playing video games, taking photos, finding coffee, or finding my new hobby",
]

// Drop your photo into /public/photo.jpg
const PHOTO_PATH = '/about.jpeg'

export default function AboutSection() {
  return (
    <section id="about" className="about">
      <div className="about__inner">

        <div className="reveal">
          <span className="section-label">About</span>
        </div>

        <div className="about__layout">
          {/* Portrait — single photo, no toggle */}
          <div className="about__portrait reveal reveal-delay-1">
            <div className="about__portrait-frame">
              <img src={PHOTO_PATH} alt="Julian Lozada" className="about__photo" />
            </div>
          </div>

          {/* Text */}
          <div className="about__text reveal reveal-delay-2">
            <h2 className="about__name">
              Julian <span>Lozada</span>
            </h2>
            <div className="about__bio">
              {BIO_LINES.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <a href={`mailto:${SITE.email}`} className="about__cta">Get in touch →</a>
          </div>
        </div>

      </div>
    </section>
  )
}
