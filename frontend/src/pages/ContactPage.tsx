import React, { useState } from 'react'
import '../styles/ContactPage.css'

interface FormState {
  name: string
  email: string
  message: string
}

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message ?? 'Something went wrong.')
      }

      setStatus('success')
      setForm({ name: '', email: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <div id="contact" className="ocean__section">
      <div className="ocean__section-divider" />

      <h2 className="contact__heading">// reach_out</h2>
      <p className="contact__subtext">
        Drop a message — I read every single one.
      </p>

      <form className="contact__form" onSubmit={handleSubmit} noValidate>
        <div className="contact__field">
          <label htmlFor="contact-name" className="contact__label">Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            className="contact__input"
            placeholder="Your name"
            value={form.name}
            onChange={handleChange}
            required
            disabled={status === 'sending'}
          />
        </div>

        <div className="contact__field">
          <label htmlFor="contact-email" className="contact__label">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="contact__input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            required
            disabled={status === 'sending'}
          />
        </div>

        <div className="contact__field">
          <label htmlFor="contact-message" className="contact__label">Message</label>
          <textarea
            id="contact-message"
            name="message"
            className="contact__textarea"
            placeholder="What's on your mind?"
            value={form.message}
            onChange={handleChange}
            required
            disabled={status === 'sending'}
          />
        </div>

        {status === 'success' && (
          <p className="contact__status contact__status--success">
            ✓ Message sent! I'll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="contact__status contact__status--error">
            ✗ {errorMsg}
          </p>
        )}

        <button
          type="submit"
          className="contact__submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'sending...' : 'send message'}
        </button>
      </form>
    </div>
  )
}
