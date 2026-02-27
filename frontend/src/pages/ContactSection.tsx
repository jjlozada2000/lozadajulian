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
        <div className="reveal">
          <span className="section-label">Contact</span>
          <h2 className="section-heading">Get in <em>touch</em></h2>
        </div>

        <div className="contact__layout reveal reveal-delay-1">
          <div className="contact__intro">
            <p>I'd love to hear from you! Send me an email how you found my website and I'll get back to you soon.</p>
            <a href={`mailto:${SITE.email}`} className="contact__email">{SITE.email}</a>
          </div>

          <form className="contact__form" onSubmit={handleSubmit} noValidate>
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