import { useState } from 'react'

const STATUS = {
  live:        { label: 'En vivo',          color: '#1a7a5e' },
  demo:        { label: 'Demo interactiva', color: '#1d5fa8' },
  development: { label: 'En desarrollo',    color: '#b45309' },
  concept:     { label: 'Concepto',         color: '#8c8a85' },
}

const CTA = {
  live:        { label: 'Abrir app' },
  demo:        { label: 'Probar demo' },
  development: { label: 'Ver más' },
  concept:     { label: 'Ver idea' },
}

export default function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false)
  const status = STATUS[project.status]
  const cta = CTA[project.status]

  const handleCta = () => {
    if (project.status === 'live' && project.url) {
      window.open(project.url, '_blank', 'noopener,noreferrer')
    } else {
      setExpanded((v) => !v)
    }
  }

  return (
    <article className="project-card">
      <div className="project-card-header">
        <h3 className="project-name">{project.name}</h3>
        <span className="project-status" style={{ color: status.color }}>
          <svg width="8" height="8" viewBox="0 0 8 8" aria-hidden="true">
            <circle cx="4" cy="4" r="4" fill={status.color} />
          </svg>
          {status.label}
        </span>
      </div>

      <p className="project-tagline">{project.tagline}</p>
      <p className="project-description">{project.description}</p>

      <div className="project-tags">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {expanded && project.highlights && (
        <ul className="project-highlights">
          {project.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
          {project.audience && (
            <li className="project-audience">Para: {project.audience}</li>
          )}
        </ul>
      )}

      <button className="btn-card" onClick={handleCta}>
        {project.status === 'live' ? cta.label : expanded ? 'Cerrar' : cta.label}
        {project.status === 'live' && (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        )}
      </button>
    </article>
  )
}
