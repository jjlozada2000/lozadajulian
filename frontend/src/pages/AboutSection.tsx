import React, { useState, useEffect } from 'react'
import '../styles/AboutSection.css'

const BIO_LINES = [
  "Hi, I'm Julian, a software engineer based in Los Angeles.",
  "I enjoy programming in C++, Python, Java, React, and TypeScript. I work best in teams while building things people enjoy.",
  "If I'm not coding, you can find me playing video games, taking photos, finding coffee, or searching for my new hobby",
]

const PHOTO_PATH = '/about.jpeg'
const RESUME_PATH = '/assets/JulianLozadaResume.pdf'

function ResumeModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="resume-modal" role="dialog" aria-modal="true">
      <div className="resume-modal__backdrop" onClick={onClose} />
      <div className="resume-modal__panel">
        <button className="resume-modal__close" onClick={onClose}>✕</button>
        <div className="resume-modal__header">
          <h2 className="resume-modal__title">Resume</h2>
          <a href={RESUME_PATH} download className="resume-modal__download">
            Download PDF ↓
          </a>
        </div>
        <div className="resume-modal__body">
          <iframe
            src={RESUME_PATH}
            className="resume-modal__iframe"
            title="Julian Lozada Resume"
          />
        </div>
      </div>
    </div>
  )
}

export default function AboutSection() {
  const [showResume, setShowResume] = useState(false)

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
            <div className="about__actions">
              <button onClick={() => setShowResume(true)} className="about__resume-link">
                My Resume →
              </button>
              <a href="#contact" onClick={scrollToContact} className="about__cta">
                Get in touch →
              </a>
            </div>
          </div>
        </div>

      </div>

      {showResume && <ResumeModal onClose={() => setShowResume(false)} />}
    </section>
  )
}