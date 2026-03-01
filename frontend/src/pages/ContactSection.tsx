import React, { useState } from 'react'
import { SITE } from '../config/siteConfig'
import '../styles/ContactSection.css'

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error('Something went wrong.')
      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <section id="contact" className="contact">
      <div className="contact__inner">
        <div className="contact__layout">

          {/* ── Left: info ── */}
          <div className="contact__left reveal">
            <span className="section-label">Contact</span>
            <h2 className="contact__heading">Get in <em>touch</em></h2>
            <p className="contact__blurb">
              I'd love to hear from you! Send me an email how you found my website and I'll get back to you soon.
            </p>

            <div className="contact__links">
              <a href={`mailto:${SITE.email}`} className="contact__link">
                <span className="contact__link-icon">✉</span>
                <span className="contact__link-text">{SITE.email}</span>
              </a>
              <a href={SITE.github} target="_blank" rel="noreferrer" className="contact__link">
                <span className="contact__link-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                  </svg>
                </span>
                <span className="contact__link-text">GitHub</span>
              </a>
              <a href={SITE.linkedin} target="_blank" rel="noreferrer" className="contact__link">
                <span className="contact__link-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </span>
                <span className="contact__link-text">LinkedIn</span>
              </a>
            </div>
          </div>

          {/* ── Right: form ── */}
          <form className="contact__form reveal reveal-delay-1" onSubmit={handleSubmit} noValidate>
            <div className="contact__field">
              <label className="contact__label" htmlFor="c-name">Name</label>
              <input id="c-name" name="name" type="text" className="contact__input"
                placeholder="Your name" value={form.name} onChange={handleChange}
                required disabled={status === 'sending'} />
            </div>
            <div className="contact__field">
              <label className="contact__label" htmlFor="c-email">Email</label>
              <input id="c-email" name="email" type="email" className="contact__input"
                placeholder="you@example.com" value={form.email} onChange={handleChange}
                required disabled={status === 'sending'} />
            </div>
            <div className="contact__field">
              <label className="contact__label" htmlFor="c-message">Message</label>
              <textarea id="c-message" name="message" className="contact__textarea"
                placeholder="What's on your mind?" value={form.message} onChange={handleChange}
                required disabled={status === 'sending'} />
            </div>

            {status === 'success' && (
              <p className="contact__status contact__status--success">Message sent — I'll be in touch soon.</p>
            )}
            {status === 'error' && (
              <p className="contact__status contact__status--error">{errorMsg}</p>
            )}

            <button type="submit" className="contact__submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending...' : 'Send message'}
            </button>
          </form>

        </div>
      </div>
    </section>
  )
}