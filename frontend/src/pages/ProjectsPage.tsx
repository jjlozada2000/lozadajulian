import React, { useState } from 'react'
import '../styles/ProjectsPage.css'

// ── Types ────────────────────────────────────────────────────────────────────
interface Project {
  id: number
  tag: string
  title: string
  description: string
  stack: string[]
  repoUrl?: string
  liveUrl?: string
}

// ── Project data ─────────────────────────────────────────────────────────────
// 👉 Add your real projects here when you're ready!
const PROJECTS: Project[] = [
  // Example — replace or add below:
  // {
  //   id: 1,
  //   tag: 'Full Stack',
  //   title: 'My Cool Project',
  //   description: 'A short description of what this project does and what you learned.',
  //   stack: ['React', 'Spring Boot', 'PostgreSQL'],
  //   repoUrl: 'https://github.com/julianlozada/...',
  //   liveUrl: 'https://...',
  // },
]

// Placeholder shown when PROJECTS array is empty
const PLACEHOLDER_COUNT = 3

// ── Flip Card ─────────────────────────────────────────────────────────────────
function ProjectCard({ project }: { project: Project }) {
  const [flipped, setFlipped] = useState(false)

  return (
    <div
      className={`project-card ${flipped ? 'project-card--flipped' : ''}`}
      onClick={() => setFlipped((f) => !f)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && setFlipped((f) => !f)}
      aria-label={`${project.title} — click to see details`}
    >
      <div className="project-card__inner">
        {/* Front */}
        <div className="project-card__front">
          <span className="project-card__tag">{project.tag}</span>
          <h3 className="project-card__title">{project.title}</h3>
          <div className="project-card__stack">
            {project.stack.map((tech) => (
              <span key={tech} className="project-card__chip">
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Back */}
        <div className="project-card__back">
          <p className="project-card__description">{project.description}</p>
          <div className="project-card__links">
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="project-card__link"
                onClick={(e) => e.stopPropagation()}
              >
                GitHub →
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="project-card__link"
                onClick={(e) => e.stopPropagation()}
              >
                Live →
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlaceholderCard({ n }: { n: number }) {
  return (
    <div className="project-card">
      <div className="project-card__inner">
        <div className="project-card__front">
          <div className="project-card__placeholder">
            <span className="project-card__placeholder-label">Project {n}</span>
            <span className="project-card__badge">add to PROJECTS array</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const hasProjects = PROJECTS.length > 0

  return (
    <div id="projects" className="ocean__section">
      <div className="ocean__section-divider" />

      <h2 className="projects__heading">// projects</h2>
      <p className="projects__subtext">
        Hover a card to flip it — see the stack on the front, details on the back.
      </p>

      <div className="projects__grid">
        {hasProjects
          ? PROJECTS.map((p) => <ProjectCard key={p.id} project={p} />)
          : Array.from({ length: PLACEHOLDER_COUNT }, (_, i) => (
              <PlaceholderCard key={i} n={i + 1} />
            ))}
      </div>
    </div>
  )
}
