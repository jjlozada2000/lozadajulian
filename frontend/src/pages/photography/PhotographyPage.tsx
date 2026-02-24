import React, { useState, useEffect, useCallback } from 'react'
import { PHOTOS, Photo } from './photoData'
import '../../styles/PhotographyPage.css'

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: Photo
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  // Close on Escape, navigate with arrow keys
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft')  onPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, onNext, onPrev])

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const isPlaceholder = photo.src.includes('placeholder')

  return (
    <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label={photo.title}>
      <div className="photo-lightbox__backdrop" onClick={onClose} />

      <div className="photo-lightbox__panel">
        <button
          className="photo-lightbox__close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>

        {/* Image */}
        <div className="photo-lightbox__img-wrap">
          {isPlaceholder ? (
            <div style={{
              width: '100%',
              height: '100%',
              minHeight: 360,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 12,
            }}>
              <span style={{ fontSize: 48, opacity: 0.2 }}>📷</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'rgba(253,252,251,0.3)', letterSpacing: 2, textTransform: 'uppercase' }}>
                add photo to /public/photos/
              </span>
            </div>
          ) : (
            <img
              src={photo.src}
              alt={photo.title}
              className="photo-lightbox__img"
            />
          )}
        </div>

        {/* Info panel */}
        <div className="photo-lightbox__info">
          <div>
            <h2 className="photo-lightbox__title">{photo.title}</h2>
          </div>

          {photo.description && (
            <p className="photo-lightbox__description">{photo.description}</p>
          )}

          <div className="photo-lightbox__data">
            {photo.camera && (
              <div className="photo-lightbox__row">
                <span className="photo-lightbox__label">Camera</span>
                <span className="photo-lightbox__value">{photo.camera}</span>
              </div>
            )}
            {photo.film && (
              <div className="photo-lightbox__row">
                <span className="photo-lightbox__label">Film / Format</span>
                <span className="photo-lightbox__value">{photo.film}</span>
              </div>
            )}
            {photo.location && (
              <div className="photo-lightbox__row">
                <span className="photo-lightbox__label">Location</span>
                <span className="photo-lightbox__value">{photo.location}</span>
              </div>
            )}
            {photo.date && (
              <div className="photo-lightbox__row">
                <span className="photo-lightbox__label">Date</span>
                <span className="photo-lightbox__value">{photo.date}</span>
              </div>
            )}
          </div>

          {/* Prev / Next */}
          <div className="photo-lightbox__nav">
            <button
              className="photo-lightbox__nav-btn"
              onClick={onPrev}
              disabled={index === 0}
              aria-label="Previous photo"
            >
              ← prev
            </button>
            <button
              className="photo-lightbox__nav-btn"
              onClick={onNext}
              disabled={index === total - 1}
              aria-label="Next photo"
            >
              next →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Photo card ────────────────────────────────────────────────────────────────
function PhotoCard({ photo, onClick }: { photo: Photo; onClick: () => void }) {
  const isPlaceholder = photo.src.includes('placeholder')

  if (isPlaceholder) {
    return (
      <div className="photo-card photo-card--placeholder" onClick={onClick}>
        <span className="photo-card__placeholder-icon">📷</span>
        <span className="photo-card__placeholder-text">{photo.title}</span>
      </div>
    )
  }

  return (
    <div className="photo-card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-label={`View ${photo.title}`}
    >
      <img
        src={photo.src}
        alt={photo.title}
        className="photo-card__img"
        loading="lazy"
      />
      <div className="photo-card__overlay">
        <p className="photo-card__hover-title">{photo.title}</p>
        <p className="photo-card__hover-meta">{photo.location} · {photo.date}</p>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PhotographyPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (index: number) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i))
  }, [])

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < PHOTOS.length - 1 ? i + 1 : i))
  }, [])

  return (
    <div className="photo-page">
      {/* ── Back navigation bar ── */}
      <nav className="photo-nav">
        <a href="/" className="photo-nav__back">
          <span className="photo-nav__back-arrow">←</span>
          <span>Back to julianl.com</span>
        </a>
        <span className="photo-nav__title">julian lozada / photography</span>
      </nav>

      {/* ── Header ── */}
      <header className="photo-header">
        <p className="photo-header__eyebrow">A collection of moments</p>
        <h1 className="photo-header__title">
          Shot on<br /><em>film & pixel</em>
        </h1>
        <p className="photo-header__meta">
          {PHOTOS.length} photographs · Los Angeles & beyond
        </p>
      </header>

      {/* ── Gallery ── */}
      <main className="photo-gallery">
        {PHOTOS.map((photo, i) => (
          <PhotoCard
            key={photo.id}
            photo={photo}
            onClick={() => openLightbox(i)}
          />
        ))}
      </main>

      {/* ── Lightbox ── */}
      {lightboxIndex !== null && (
        <Lightbox
          photo={PHOTOS[lightboxIndex]}
          index={lightboxIndex}
          total={PHOTOS.length}
          onClose={closeLightbox}
          onPrev={goPrev}
          onNext={goNext}
        />
      )}
    </div>
  )
}