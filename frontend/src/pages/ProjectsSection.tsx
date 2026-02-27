import React, { useState } from 'react'
import '../styles/ProjectsSection.css'

// ============================================================
// Add your projects here
// ============================================================
interface Project {
  id: number
  title: string
  description: string
  year: string
  tags: string[]
  github?: string
  live?: string
  media?: string
}

const PROJECTS: Project[] = [
  {
    id: 1,
    title: 'SEATech Research Initiative',
    description: 'My senior Project.  A student-led interdisciplinary team developing low-cost, open-source tools for marine wildlife tracking. SEAtech Research Initiative is a student-led interdisciplinary team developing low-cost, open-source tools for marine wildlife tracking. Formed from a university course and now operating as an interdisciplinary campus research club, we unite CS, GIS, and marine biology students to build a complete sensor-to-map system for sea turtles in the San Andrés Archipelago. Our work focuses on expanding access to affordable telemetry and advancing geospatial intelligence for conservation.',
    year: '2025-2026',
    tags: ['React', 'TypeScript', 'Flask'],
    github: 'https://github.com/cnguye-n/seatech-web',
    live: 'https://seatech-web.vercel.app/'
  },
]

const PLACEHOLDER: Project[] = [
  { id: 1, title: 'Project One',   description: 'Add your project description here.', year: '2025', tags: ['React', 'Java'] },
  { id: 2, title: 'Project Two',   description: 'Add your project description here.', year: '2025', tags: ['TypeScript'] },
  { id: 3, title: 'Project Three', description: 'Add your project description here.', year: '2024', tags: ['Spring Boot', 'PostgreSQL'] },
]

// ── Preview panel ─────────────────────────────────────────────────────────────
function PreviewPanel({ url, label }: { url: string; label: string }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <div className="project-preview">
      <div className="project-preview__bar">
        <span className="project-preview__label">{label}</span>
        <a href={url} target="_blank" rel="noreferrer" className="project-preview__open">
          Open ↗
        </a>
      </div>
      <div className="project-preview__frame-wrap">
        {!loaded && !errored && (
          <div className="project-preview__loading">Loading preview...</div>
        )}
        {errored ? (
          <div className="project-preview__blocked">
            <p>Preview unavailable</p>
            <a href={url} target="_blank" rel="noreferrer" className="project-preview__fallback">
              Open in new tab →
            </a>
          </div>
        ) : (
          <iframe
            src={url}
            className="project-preview__iframe"
            title={label}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'github' | 'live'>(
    project.github ? 'github' : 'live'
  )

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const hasBoth = !!project.github && !!project.live

  return (
    <div className="project-modal" role="dialog" aria-modal="true">
      <div className="project-modal__backdrop" onClick={onClose} />
      <div className="project-modal__panel">
        <button className="project-modal__close" onClick={onClose}>✕</button>

        {/* Header */}
        <div className="project-modal__header">
          <div className="project-modal__header-left">
            <span className="project-modal__year">{project.year}</span>
            <h2 className="project-modal__title">{project.title}</h2>
            <div className="project-modal__tags">
              {project.tags.map(t => (
                <span key={t} className="project-modal__tag">{t}</span>
              ))}
            </div>
            <p className="project-modal__description">{project.description}</p>
          </div>
        </div>

        {/* Tab switcher — only shown if both links exist */}
        {hasBoth && (
          <div className="project-modal__tabs">
            <button
              className={`project-modal__tab ${activeTab === 'github' ? 'project-modal__tab--active' : ''}`}
              onClick={() => setActiveTab('github')}
            >
              GitHub
            </button>
            <button
              className={`project-modal__tab ${activeTab === 'live' ? 'project-modal__tab--active' : ''}`}
              onClick={() => setActiveTab('live')}
            >
              Live site
            </button>
          </div>
        )}

        {/* Previews */}
        <div className="project-modal__previews">
          {!project.github && !project.live && (
            <p className="project-modal__no-links">No links added yet.</p>
          )}

          {/* Single github */}
          {project.github && !hasBoth && (
            <PreviewPanel url={project.github} label="GitHub" />
          )}

          {/* Single live */}
          {project.live && !hasBoth && (
            <PreviewPanel url={project.live} label="Live site" />
          )}

          {/* Both — tab controlled */}
          {hasBoth && activeTab === 'github' && (
            <PreviewPanel url={project.github!} label="GitHub" />
          )}
          {hasBoth && activeTab === 'live' && (
            <PreviewPanel url={project.live!} label="Live site" />
          )}
        </div>

      </div>
    </div>
  )
}

// ── Project row ───────────────────────────────────────────────────────────────
function ProjectRow({ project, index, onClick }: { project: Project; index: number; onClick: () => void }) {
  return (
    <div
      className="project-row"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <span className="project-row__num">0{index + 1}</span>
      <span className="project-row__title">{project.title}</span>
      <div className="project-row__tags">
        {project.tags.slice(0, 3).map(t => (
          <span key={t} className="project-row__tag">{t}</span>
        ))}
      </div>
      <span className="project-row__year">{project.year}</span>
      <span className="project-row__arrow">→</span>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function ProjectsSection() {
  const [selected, setSelected] = useState<Project | null>(null)
  const list = PROJECTS.length > 0 ? PROJECTS : PLACEHOLDER

  return (
    <section id="projects" className="projects">
      <div className="projects__inner">
        <div className="reveal">
          <span className="section-label">Work</span>
          <h2 className="section-heading">Selected <em>projects</em></h2>
        </div>

        <div className="projects__list reveal reveal-delay-1">
          {list.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              onClick={() => setSelected(project)}
            />
          ))}
        </div>
      </div>

      {selected && (
        <ProjectModal project={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  )
}