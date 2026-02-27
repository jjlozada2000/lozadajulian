import React, { useState, useEffect, useCallback } from 'react'
import { PHOTOS, Photo } from './photoData'
import '../../styles/PhotographyPage.css'

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  photo, index, total, onClose, onPrev, onNext,
}: {
  photo: Photo; index: number; total: number
  onClose: () => void; onPrev: () => void; onNext: () => void
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose, onNext, onPrev])

  const isPlaceholder = photo.src.includes('placeholder')

  return (
    <div className="photo-lb" role="dialog" aria-modal="true">
      <div className="photo-lb__backdrop" onClick={onClose} />
      <div className="photo-lb__panel">
        <button className="photo-lb__close" onClick={onClose}>✕</button>

        <div className="photo-lb__img-wrap">
          {isPlaceholder
            ? <div className="photo-lb__placeholder">📷</div>
            : <img src={photo.src} alt={photo.title} className="photo-lb__img" />
          }
        </div>

        <div className="photo-lb__info">
          <h2 className="photo-lb__title">{photo.title}</h2>
          {photo.description && <p className="photo-lb__desc">{photo.description}</p>}

          <div className="photo-lb__data">
            {[
              { label: 'Camera',       value: photo.camera },
              { label: 'Film / Format', value: photo.film },
              { label: 'Location',     value: photo.location },
              { label: 'Date',         value: photo.date },
            ].map(({ label, value }) => value && (
              <div key={label} className="photo-lb__row">
                <span className="photo-lb__row-label">{label}</span>
                <span className="photo-lb__row-value">{value}</span>
              </div>
            ))}
          </div>

          <div className="photo-lb__nav">
            <button className="photo-lb__nav-btn" onClick={onPrev} disabled={index === 0}>← prev</button>
            <button className="photo-lb__nav-btn" onClick={onNext} disabled={index === total - 1}>next →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Card ──────────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const isPlaceholder = photo.src.includes('placeholder')
  return (
    <div className="photo-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()}>
      {isPlaceholder
        ? <div className="photo-card__placeholder"><span>📷</span><span>{photo.title}</span></div>
        : <>
            <img src={photo.src} alt={photo.title} className="photo-card__img" loading="lazy" />
            <div className="photo-card__overlay">
              <p className="photo-card__overlay-title">{photo.title}</p>
              <p className="photo-card__overlay-meta">{photo.location} · {photo.date}</p>
            </div>
          </>
      }
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PhotographyPage() {
  const [lbIndex, setLbIndex] = useState<number | null>(null)
  const close  = () => setLbIndex(null)
  const prev   = useCallback(() => setLbIndex(i => (i !== null && i > 0 ? i - 1 : i)), [])
  const next   = useCallback(() => setLbIndex(i => (i !== null && i < PHOTOS.length - 1 ? i + 1 : i)), [])

  return (
    <div className="photo-page">
      <nav className="photo-page__nav">
        <a href="/" className="photo-page__back">← Back to julianl.com</a>
        <span className="photo-page__nav-title">julian lozada / photography</span>
      </nav>

      <header className="photo-page__header">
        <p className="photo-page__eyebrow">A collection of moments</p>
        <h1 className="photo-page__title">Shot on <em>film & pixel</em></h1>
        <p className="photo-page__meta">{PHOTOS.length} photographs · Los Angeles & beyond</p>
      </header>

      <main className="photo-page__gallery">
        {PHOTOS.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} onClick={() => setLbIndex(i)} />
        ))}
      </main>

      {lbIndex !== null && (
        <Lightbox
          photo={PHOTOS[lbIndex]}
          index={lbIndex}
          total={PHOTOS.length}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </div>
  )
}
