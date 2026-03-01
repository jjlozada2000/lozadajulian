import React from 'react'
import '../styles/AboutSection.css'

const BIO_LINES = [
  "Hi, I'm Julian, a software engineer based in Los Angeles.",
  "I enjoy programming in C++, Python, Java, React, and TypeScript. I enjoy the process of working in teams and building things people enjoy.",
  "If I'm not coding, you can find me playing video games, taking photos, finding coffee, or finding my new hobby",
]

const PHOTO_PATH = '/about.jpeg'

export default function AboutSection() {
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="about" className="about">
      <div className="about__inner">

        <div className="reveal">
          <span className="section-label">About</span>
        </div>

        <div className="about__layout">
          <div className="about__portrait reveal reveal-delay-1">
            <div className="about__portrait-frame">
              <img src={PHOTO_PATH} alt="Julian Lozada" className="about__photo" />
            </div>
          </div>

          <div className="about__text reveal reveal-delay-2">
            <h2 className="about__name">
              Julian <span>Lozada</span>
            </h2>
            <div className="about__bio">
              {BIO_LINES.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <a href="#contact" onClick={scrollToContact} className="about__cta">
              Get in touch →
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}